import { NextResponse } from "next/server";
import {
  AGENT_CATALOG,
  AUTO_SELECT_THRESHOLD,
  MIN_USE_CASE_THRESHOLD,
  catalogClusterSummary,
  catalogForPrompt,
  getCatalogAgent,
} from "@/lib/agent-catalog";
import {
  assessFieldOpsEligibility,
  researchContextForPrompt,
  waitForResearch,
} from "@/lib/agent-matching";
import {
  augmentRecommendations,
  boostHintScores,
} from "@/lib/recommendation-augment";
import { withCustomAgentsCta } from "@/lib/custom-agents-cta";
import { generateNoMatchAnalysis } from "@/lib/no-match-analysis";
import { chatCompletion } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import {
  extractUserGoalSignals,
  userGoalsContextForPrompt,
} from "@/lib/user-goal-signals";
import { hasCompletedAgentMatching, AGENT_MATCHING_VERSION } from "@/lib/workspaces";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";
import type { RecommendedAgentDetail } from "@/lib/workspaces";

type LlmAgentResult = RecommendedAgentDetail & {
  relevanceScore?: number;
  requirementReason?: string;
};

type LlmResponse = {
  agents?: LlmAgentResult[];
  skippedReason?: string;
};

function validateRecommendations(
  agents: LlmAgentResult[],
  skippedReason?: string,
  goalAgentHints: string[] = [],
): { agents: RecommendedAgentDetail[]; skippedReason?: string } {
  const validated: RecommendedAgentDetail[] = [];
  const hintSet = new Set(goalAgentHints);

  for (const agent of agents) {
    const catalog = getCatalogAgent(agent.id);
    if (!catalog) continue;
    let score = agent.relevanceScore ?? 0;
    if (hintSet.has(agent.id) && score >= MIN_USE_CASE_THRESHOLD - 0.05) {
      score = Math.max(score, MIN_USE_CASE_THRESHOLD);
    }
    if (score < MIN_USE_CASE_THRESHOLD) continue;

    validated.push({
      id: catalog.id,
      name: catalog.name,
      problemSolved: agent.problemSolved || catalog.automates,
      goalMapping: agent.goalMapping || "",
      description: agent.description || catalog.description,
      relevanceScore: score,
      requirementReason: agent.requirementReason,
    });
  }

  validated.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

  return {
    agents: validated,
    skippedReason: validated.length === 0 ? skippedReason : undefined,
  };
}

async function saveEmptyRecommendations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  skippedReason: string,
  noMatchAnalysis?: Awaited<ReturnType<typeof generateNoMatchAnalysis>>,
) {
  await updateWorkspaceProfile(supabase, workspaceId, {
    recommended_agent_ids: [],
    recommended_details: [],
    selected_agent_ids: [],
    recommendation_skipped_reason: skippedReason,
    no_match_analysis: noMatchAnalysis,
    agent_matching_completed_at: new Date().toISOString(),
    agent_matching_version: AGENT_MATCHING_VERSION,
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: workspaceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ws = await getOwnedWorkspace(supabase, workspaceId, user.id);
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bp = ws.business_profile ?? {};

  if (hasCompletedAgentMatching(bp)) {
    return NextResponse.json({
      agents: bp.recommended_details ?? [],
      skippedReason: bp.recommendation_skipped_reason,
      noMatchAnalysis: bp.no_match_analysis,
      cached: true,
      catalog: AGENT_CATALOG,
    });
  }

  let research = bp.research;
  if (research?.status === "pending") {
    research = await waitForResearch(supabase, workspaceId, user.id);
  }

  const eligibility = assessFieldOpsEligibility(research, bp.domain, {
    sixty_day_goal: bp.sixty_day_goal,
    primary_goals: bp.primary_goals,
    custom_goal: bp.custom_goal,
  });
  if (!eligibility.eligible) {
    const skippedReason = withCustomAgentsCta(eligibility.reason);
    const noMatchAnalysis = await generateNoMatchAnalysis(
      { ...bp, research },
      skippedReason,
    );
    await saveEmptyRecommendations(
      supabase,
      workspaceId,
      skippedReason,
      noMatchAnalysis,
    );
    return NextResponse.json({
      agents: [],
      skippedReason,
      noMatchAnalysis,
      catalog: AGENT_CATALOG,
    });
  }

  const goalSignals = extractUserGoalSignals(bp);
  const catalogJson = JSON.stringify(catalogForPrompt());
  const clusterJson = JSON.stringify(catalogClusterSummary());
  const userGoalsBlock = userGoalsContextForPrompt(goalSignals);
  const wantsMonitoring = goalSignals.wantsMonitoring;

  const prompt = `${userGoalsBlock}

Company domain: ${bp.domain ?? "unknown"}
User wants unified monitoring/analytics: ${wantsMonitoring ? "yes" : "no"}
Facility ops signals detected on website: ${eligibility.fieldOpsSignals.join(", ") || "limited"}

${researchContextForPrompt(research)}

Agent clusters (49 agents total): ${clusterJson}

Full agent catalog: ${catalogJson}

Return JSON:
{
  "agents": [
    {
      "id": "exact catalog id",
      "name": "agent name",
      "relevanceScore": 0.0-1.0,
      "problemSolved": "specific problem for THIS company",
      "goalMapping": "quote or paraphrase which user goal(s) this addresses — 60-day goal, primary goals, and/or custom goal",
      "description": "why this fits their stated goals and operations",
      "requirementReason": "evidence from user goals AND/OR website — user goals count as primary evidence"
    }
  ],
  "skippedReason": "required when agents array is empty — explain why none fit"
}

Scoring — evaluate ALL 49 agents. Apply in this priority order:
1. USER GOALS (highest weight): 60-day goal, each selected primary goal, and custom goal.
2. Outcome themes in free text (e.g. profit → billing/expense/efficiency agents; monitoring → oversight agents).
3. Website research: refine and validate, not override explicit user goals.
4. Cluster fit across all 12 clusters.
5. notIdealFor: omit ONLY when clearly incompatible with BOTH website and user goals.
6. Multiple agents per cluster: INCLUDE ALL with distinct use cases — do not collapse to one per cluster.

Rules:
- Return EVERY agent with any plausible use case (relevanceScore 0.35+). There is NO maximum count.
- NEVER ignore user-stated goals. If primary goals map to clusters, include ALL agents in those clusters unless notIdealFor clearly blocks them.
- Translate business outcomes in the 60-day goal (e.g. "make profit") into operational agents — cite the translation in goalMapping.
- ONLY skip an individual agent when it has zero use case for this company. ONLY return an empty array when the company is pure SaaS/agency/GTM with NO operational goals AND no website ops signals.
- Do NOT force-fit agents with no use case. Do NOT omit agents with even a partial use case.
- relevanceScore guide: 0.85+ strong fit, 0.65–0.84 good fit, 0.35–0.64 partial fit worth considering.
- Include monica when multiple operational agents apply OR user is deploying across clusters.
- Include harvey when user wants monitoring OR selected fleet/jobs visibility OR multiple operational agents apply.
- Include claire, seth, evan when compliance/audit/SLA/escalation needs appear in goals or website.
- Agents in priority clusters from user goals: ${goalSignals.agentHints.join(", ") || "derive from goals"} — include each unless clearly blocked.
- Use exact catalog ids only (linda, rae, pete, molly, vera, ace, cal, beau, clark, nora, rico, ford, gus, quinn, neil, drew, omar, brook, glen, renata, june, nico, wade, finn, max, dale, maya, lena, rose, sam, jennie, toby, iris, skip, zara, vic, gina, cole, emma, stella, harvey, brent, nate, wren, chip, monica, claire, seth, evan).
- If returning zero agents, skippedReason must reference which user goals were considered and why they did not map to catalog agents.`;

  let recommended: RecommendedAgentDetail[] = [];
  let skippedReason: string | undefined;

  try {
    const raw = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You recommend AI agents from WeLaunch's full catalog of 49 agents across 12 clusters. User-stated goals are PRIMARY inputs. Evaluate every agent — return ALL with any plausible use case (score 0.35+). No maximum count. Include multiple agents per cluster when each has a distinct use case. Omit individual agents only when notIdealFor clearly blocks them. Return empty array only for pure SaaS/agency/GTM with no operational goals and no website ops signals. Never force-fit. Return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      { json: true },
    );
    const parsed = JSON.parse(raw) as LlmResponse;
    const result = validateRecommendations(
      parsed.agents ?? [],
      parsed.skippedReason,
      goalSignals.agentHints,
    );
    recommended = augmentRecommendations(
      boostHintScores(result.agents, goalSignals.agentHints),
      goalSignals,
    );
    skippedReason =
      recommended.length === 0
        ? result.skippedReason ??
          parsed.skippedReason ??
          "None of our WeLaunch agents match your business based on your website and goals."
        : undefined;
  } catch {
    recommended = [];
    skippedReason = "Could not generate recommendations. Try refreshing.";
  }

  if (skippedReason && recommended.length === 0) {
    skippedReason = withCustomAgentsCta(skippedReason);
  }

  let noMatchAnalysis: Awaited<ReturnType<typeof generateNoMatchAnalysis>> | undefined;
  if (recommended.length === 0) {
    noMatchAnalysis = await generateNoMatchAnalysis(
      { ...bp, research },
      skippedReason,
    );
  }

  const autoSelectIds = recommended
    .filter((a) => (a.relevanceScore ?? 0) >= AUTO_SELECT_THRESHOLD)
    .map((a) => a.id);

  await updateWorkspaceProfile(supabase, workspaceId, {
    recommended_agent_ids: recommended.map((a) => a.id),
    recommended_details: recommended,
    selected_agent_ids: autoSelectIds,
    recommendation_skipped_reason: skippedReason,
    no_match_analysis: noMatchAnalysis,
    agent_matching_completed_at: new Date().toISOString(),
    agent_matching_version: AGENT_MATCHING_VERSION,
  });

  return NextResponse.json({
    agents: recommended,
    skippedReason,
    noMatchAnalysis,
    catalog: AGENT_CATALOG,
  });
}
