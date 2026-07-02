import type { SupabaseClient } from "@supabase/supabase-js";
import { getOwnedWorkspace } from "@/lib/workspace-api";
import type { CompanyProfile, WorkspaceResearch } from "@/lib/workspaces";

const RESEARCH_POLL_MS = 500;
const RESEARCH_MAX_WAIT_MS = 8000;

/** Companies that need physical field ops evidence before any agent is suggested */
const NON_FIELD_OPS_PATTERNS = [
  /\bsaas\b/i,
  /\bsoftware\b/i,
  /\bplatform\b/i,
  /\bagency\b/i,
  /\bconsulting\b/i,
  /\bgtm\b/i,
  /\bgo-to-market\b/i,
  /\brevops?\b/i,
  /\bmarketing\b/i,
  /\bventure\b/i,
  /\bstartup\b/i,
  /\bedtech\b/i,
  /\bfintech\b/i,
  /\bapp\b/i,
  /\bcloud\b/i,
  /\bapi\b/i,
  /\bproduct studio\b/i,
  /\bautomation agency\b/i,
];

const FIELD_OPS_SIGNAL_PATTERNS = [
  /\btechnician/i,
  /\bfleet\b/i,
  /\btruck/i,
  /\bcmms\b/i,
  /\bwork order/i,
  /\bdispatch(?!ing software)/i,
  /\bfield service/i,
  /\bjob site/i,
  /\bhvac\b/i,
  /\bplumb/i,
  /\bmaintenance crew/i,
  /\bintellishift\b/i,
  /\brail redi\b/i,
  /\bgeofenc/i,
  /\binspection schedule/i,
  /\bfacility management/i,
  /\bbuilding maintenance/i,
  /\bproperty management\b/i,
  /\bservice truck/i,
  /\bfleet gps\b/i,
];

function collectResearchText(research?: WorkspaceResearch, domain?: string) {
  const profile = research?.company_profile;
  const raw = research?.raw;
  return [
    domain,
    research?.summary,
    research?.page_title,
    profile?.company_type,
    profile?.industry,
    ...(profile?.operations ?? []),
    ...(profile?.signals ?? []),
    raw?.meta_description,
    raw?.og_description,
    raw?.body_excerpt,
    ...(Array.isArray(raw?.headings) ? raw.headings : []),
    ...(Array.isArray(raw?.industry_hints) ? raw.industry_hints : []),
  ]
    .filter(Boolean)
    .join(" ");
}

export type FieldOpsEligibility = {
  eligible: boolean;
  reason: string;
  nonFieldOpsDetected: boolean;
  fieldOpsSignals: string[];
};

export function assessFieldOpsEligibility(
  research?: WorkspaceResearch,
  domain?: string,
): FieldOpsEligibility {
  const corpus = collectResearchText(research, domain);
  const lower = corpus.toLowerCase();

  const profile = research?.company_profile;
  const companyType = profile?.company_type?.toLowerCase() ?? "";
  const nonFieldCompanyTypes = [
    "saas",
    "agency",
    "gtm_revops",
    "consulting",
    "software",
    "marketing",
  ];
  const fieldCompanyTypes = ["field_service", "facility_management"];

  const typeIsNonField = nonFieldCompanyTypes.some((t) => companyType.includes(t));
  const typeIsField = fieldCompanyTypes.some((t) => companyType.includes(t));

  const nonFieldOpsDetected =
    typeIsNonField || NON_FIELD_OPS_PATTERNS.some((p) => p.test(corpus));
  const matchedSignals = FIELD_OPS_SIGNAL_PATTERNS.filter((p) => p.test(corpus)).map(
    (p) => p.source.replace(/\\b/g, "").replace(/\\s\*/g, "").slice(0, 40),
  );

  const hasFieldOpsEvidence =
    typeIsField ||
    matchedSignals.length >= 2 ||
    (matchedSignals.length >= 1 &&
      /\b(field service|cmms|technician|fleet|work order|hvac|facility management)\b/i.test(
        lower,
      ));

  if (nonFieldOpsDetected && !hasFieldOpsEvidence) {
    const industry =
      research?.company_profile?.industry ??
      research?.company_profile?.company_type ??
      "your industry";
    return {
      eligible: false,
      nonFieldOpsDetected: true,
      fieldOpsSignals: matchedSignals,
      reason: `Based on ${domain ? domain : "your website"}, you appear to be a ${industry} business (SaaS, agency, or GTM/RevOps). Our agents are built for physical field operations — technicians, fleets, CMMS work orders, and on-site compliance. We didn't find those signals on your site, so no agents are recommended. You can still continue to a vision roadmap focused on your 60-day goal.`,
    };
  }

  if (!hasFieldOpsEvidence && corpus.length > 80) {
    return {
      eligible: false,
      nonFieldOpsDetected: false,
      fieldOpsSignals: matchedSignals,
      reason: `We analyzed ${domain ? domain : "your website"} but didn't find clear field-operations signals (technicians, fleets, CMMS, or on-site dispatch). These agents target companies running physical service crews. No agents are recommended — your vision roadmap will focus on your stated goals instead.`,
    };
  }

  return {
    eligible: true,
    nonFieldOpsDetected,
    fieldOpsSignals: matchedSignals,
    reason: "",
  };
}

export async function waitForResearch(
  supabase: SupabaseClient,
  workspaceId: string,
  userId: string,
): Promise<WorkspaceResearch | undefined> {
  const deadline = Date.now() + RESEARCH_MAX_WAIT_MS;

  while (Date.now() < deadline) {
    const ws = await getOwnedWorkspace(supabase, workspaceId, userId);
    const research = ws?.business_profile?.research;
    if (research?.status === "complete" || research?.status === "failed") {
      return research;
    }
    await new Promise((resolve) => setTimeout(resolve, RESEARCH_POLL_MS));
  }

  const ws = await getOwnedWorkspace(supabase, workspaceId, userId);
  return ws?.business_profile?.research;
}

export function researchContextForPrompt(research?: WorkspaceResearch) {
  if (!research) return "Research: not available";
  const profile = research.company_profile;
  const parts = [
    `Research status: ${research.status}`,
    research.summary ? `Summary: ${research.summary}` : null,
    profile?.company_type ? `Company type: ${profile.company_type}` : null,
    profile?.industry ? `Industry: ${profile.industry}` : null,
    profile?.operations?.length
      ? `Operations: ${profile.operations.join(", ")}`
      : null,
    profile?.signals?.length ? `Signals: ${profile.signals.join(", ")}` : null,
    research.raw?.body_excerpt
      ? `Page excerpt: ${String(research.raw.body_excerpt).slice(0, 1500)}`
      : null,
  ].filter(Boolean);
  return parts.join("\n");
}
