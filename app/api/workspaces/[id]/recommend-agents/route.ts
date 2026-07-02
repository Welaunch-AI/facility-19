import { NextResponse } from "next/server";
import {
  AGENT_CATALOG,
  AUTO_SELECT_THRESHOLD,
  RELEVANCE_THRESHOLD,
  catalogForPrompt,
  getCatalogAgent,
} from "@/lib/agent-catalog";
import {
  assessFieldOpsEligibility,
  researchContextForPrompt,
  waitForResearch,
} from "@/lib/agent-matching";
import { withCustomAgentsCta } from "@/lib/custom-agents-cta";
import { generateNoMatchAnalysis } from "@/lib/no-match-analysis";
import { chatCompletion } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import { hasCompletedAgentMatching } from "@/lib/workspaces";
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
): { agents: RecommendedAgentDetail[]; skippedReason?: string } {
  const validated: RecommendedAgentDetail[] = [];

  for (const agent of agents) {
    const catalog = getCatalogAgent(agent.id);
    if (!catalog) continue;
    const score = agent.relevanceScore ?? 0;
    if (score < RELEVANCE_THRESHOLD) continue;

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
    agents: validated.slice(0, 4),
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

  const eligibility = assessFieldOpsEligibility(research, bp.domain);
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

  const catalogJson = JSON.stringify(catalogForPrompt());
  const wantsMonitoring = (bp.primary_goals ?? []).some((g) =>
    /monitor|one place|central/i.test(g),
  );

  const prompt = `Company domain: ${bp.domain ?? "unknown"}
60-day goal: ${bp.sixty_day_goal ?? "not provided"}
Primary goals: ${(bp.primary_goals ?? []).join(", ") || "none"}
Custom goal: ${bp.custom_goal ?? "none"}
User wants unified monitoring: ${wantsMonitoring ? "yes" : "no"}
Field ops signals detected: ${eligibility.fieldOpsSignals.join(", ") || "limited"}

${researchContextForPrompt(research)}

Agent catalog: ${catalogJson}

Return JSON:
{
  "agents": [
    {
      "id": "exact catalog id",
      "name": "agent name",
      "relevanceScore": 0.0-1.0,
      "problemSolved": "specific problem for THIS company",
      "goalMapping": "how this maps to their 60-day goal",
      "description": "why this fits their website/industry",
      "requirementReason": "why this is a genuine requirement, not nice-to-have"
    }
  ],
  "skippedReason": "required when agents array is empty — explain why none fit"
}

Rules:
- ONLY recommend agents when the company runs physical field operations (technicians, fleets, CMMS, on-site jobs).
- If the company is SaaS, agency, GTM, RevOps, consulting, or software-only with NO field crews, return an empty agents array.
- Do NOT stretch agent descriptions to fit unrelated businesses. Do NOT mention "facility management" unless the website shows it.
- Zero agents is valid and preferred over weak matches. Do NOT pad recommendations.
- Maximum 4 agents only when multiple strong fits exist.
- relevanceScore 0.65+ only for real matches with website or goal evidence.
- Do NOT recommend Jarvis unless 2+ other agents match OR user wants unified monitoring.
- Use exact catalog ids only.
- If returning zero agents, skippedReason must clearly state why (e.g. wrong industry, no field ops, goal mismatch).`;

  let recommended: RecommendedAgentDetail[] = [];
  let skippedReason: string | undefined;

  try {
    const raw = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You recommend specialized AI agents ONLY for companies with physical field operations (technicians, trucks, CMMS, job sites). For SaaS, agencies, and GTM companies without field crews, return empty agents with a clear skippedReason. Never force-fit. Return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      { json: true },
    );
    const parsed = JSON.parse(raw) as LlmResponse;
    const result = validateRecommendations(parsed.agents ?? [], parsed.skippedReason);
    recommended = result.agents;
    skippedReason =
      result.skippedReason ??
      (recommended.length === 0
        ? parsed.skippedReason ??
          "None of our field-operations agents match your business based on your website and goals."
        : undefined);
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
  });

  return NextResponse.json({
    agents: recommended,
    skippedReason,
    noMatchAnalysis,
    catalog: AGENT_CATALOG,
  });
}
