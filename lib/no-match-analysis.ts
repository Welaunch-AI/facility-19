import { chatCompletion } from "@/lib/openrouter";
import { displaySkippedReason } from "@/lib/custom-agents-cta";
import { researchContextForPrompt } from "@/lib/agent-matching";
import type { BusinessProfile, NoMatchAnalysis } from "@/lib/workspaces";

type LlmNoMatchResponse = {
  websiteSummary?: string;
  whyNotFacility19?: string;
  customAgents?: Array<{
    name?: string;
    role?: string;
    description?: string;
    mapsToGoal?: string;
  }>;
};

function fallbackAnalysis(
  bp: BusinessProfile,
  skippedReason?: string,
): NoMatchAnalysis {
  const research = bp.research;
  const profile = research?.company_profile;
  const domain = bp.domain ?? "your website";
  const industry = profile?.industry ?? profile?.company_type ?? "your industry";
  const goal = bp.sixty_day_goal ?? bp.custom_goal ?? "your 60-day goal";

  const operations = profile?.operations?.slice(0, 4) ?? [];
  const signals = profile?.signals?.slice(0, 4) ?? [];

  const websiteSummary =
    research?.summary ??
    `We reviewed ${domain}. Based on the homepage and metadata, this looks like a ${industry} business${
      operations.length ? ` focused on ${operations.join(", ")}` : ""
    }.`;

  const whyNotFacility19 =
    displaySkippedReason(skippedReason) ??
    `Facility 19's pre-built agents target physical field operations — technicians, fleets, CMMS work orders, and on-site compliance. We didn't find those patterns on ${domain}, so our standard agent catalog isn't a fit.`;

  const customAgents = buildFallbackAgents(industry, goal, bp.primary_goals ?? [], signals);

  return { websiteSummary, whyNotFacility19, customAgents };
}

function buildFallbackAgents(
  industry: string,
  goal: string,
  primaryGoals: string[],
  signals: string[],
) {
  const goalsText = [...primaryGoals, goal].filter(Boolean).join("; ");
  const signalHint = signals[0] ?? industry;

  return [
    {
      name: "Research Agent",
      role: "Market & account intelligence",
      description: `Monitors ${signalHint}-relevant signals, enriches leads, and surfaces talking points before your team engages.`,
      mapsToGoal: `Supports "${goalsText.slice(0, 120)}" by reducing manual research time.`,
    },
    {
      name: "Outreach Agent",
      role: "Pipeline & follow-up automation",
      description:
        "Drafts personalized sequences, tracks replies, and nudges stalled conversations based on your ICP and offer.",
      mapsToGoal: "Keeps outbound and follow-ups moving without adding headcount.",
    },
    {
      name: "Ops Agent",
      role: "Workflow orchestration",
      description:
        "Connects your CRM, inbox, and internal tools — routing tasks, summarizing updates, and flagging blockers daily.",
      mapsToGoal: "Compounds small efficiency gains toward your 60-day target.",
    },
  ];
}

export async function generateNoMatchAnalysis(
  bp: BusinessProfile,
  skippedReason?: string,
): Promise<NoMatchAnalysis> {
  const fallback = fallbackAnalysis(bp, skippedReason);

  try {
    const raw = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You analyze companies for AI agent fit. Facility 19 ships pre-built agents for physical field operations (HVAC, fleets, CMMS, technicians). When a company is NOT a fit, explain why and propose 2-4 custom AI agents tailored to THEIR actual business from website research — not field-ops agents. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Domain: ${bp.domain ?? "unknown"}
60-day goal: ${bp.sixty_day_goal ?? "not provided"}
Primary goals: ${(bp.primary_goals ?? []).join(", ") || "none"}
Custom goal: ${bp.custom_goal ?? "none"}
Skip reason: ${displaySkippedReason(skippedReason) ?? "no field-ops match"}

${researchContextForPrompt(bp.research)}

Return JSON:
{
  "websiteSummary": "2-3 sentences on what this company does based on the website research — specific, not generic",
  "whyNotFacility19": "2-3 sentences explaining why Facility 19's field-operations agent catalog (technicians, fleets, CMMS, building maintenance) does not apply — reference their actual business model",
  "customAgents": [
    {
      "name": "Agent name (e.g. Pipeline Agent, Content Agent)",
      "role": "Short role label",
      "description": "What this custom agent would do for THIS company specifically",
      "mapsToGoal": "How it maps to their 60-day or stated goals"
    }
  ]
}

Rules:
- customAgents: 2-4 items, each grounded in website research and goals
- Do NOT suggest Facility 19 catalog agents (ARIA, Molly, Dex, etc.)
- Be specific to their industry (SaaS, agency, EdTech, GTM, etc.)
- whyNotFacility19 must be clear and non-judgmental`,
        },
      ],
      { json: true },
    );

    const parsed = JSON.parse(raw) as LlmNoMatchResponse;
    const customAgents = (parsed.customAgents ?? [])
      .filter((a) => a.name && a.description)
      .slice(0, 4)
      .map((a) => ({
        name: a.name!,
        role: a.role ?? "Custom AI agent",
        description: a.description!,
        mapsToGoal: a.mapsToGoal ?? "",
      }));

    return {
      websiteSummary: parsed.websiteSummary?.trim() || fallback.websiteSummary,
      whyNotFacility19: parsed.whyNotFacility19?.trim() || fallback.whyNotFacility19,
      customAgents: customAgents.length > 0 ? customAgents : fallback.customAgents,
    };
  } catch {
    return fallback;
  }
}

export const WELAUNCH_CASE_STUDIES_URL = "https://www.welaunch.ai/case-studies";
