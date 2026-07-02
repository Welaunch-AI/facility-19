import type { SupabaseClient } from "@supabase/supabase-js";
import { extractUserGoalSignals } from "@/lib/user-goal-signals";
import { getOwnedWorkspace } from "@/lib/workspace-api";
import type { BusinessProfile, CompanyProfile, WorkspaceResearch } from "@/lib/workspaces";

const RESEARCH_POLL_MS = 500;
const RESEARCH_MAX_WAIT_MS = 8000;

/** Companies without facility / field operations evidence */
const NON_FACILITY_OPS_PATTERNS = [
  /\bsaas\b/i,
  /\bsoftware\b/i,
  /\bplatform\b/i,
  /\bagency\b/i,
  /\bconsulting\b/i,
  /\bgtm\b/i,
  /\bgo-to-market\b/i,
  /\brevops?\b/i,
  /\bmarketing agency\b/i,
  /\bventure\b/i,
  /\bstartup studio\b/i,
  /\bedtech\b/i,
  /\bfintech\b/i,
  /\bapp studio\b/i,
  /\bproduct studio\b/i,
  /\bautomation agency\b/i,
];

const FACILITY_OPS_SIGNAL_PATTERNS = [
  /\btechnician/i,
  /\bfleet\b/i,
  /\btruck/i,
  /\bcmms\b/i,
  /\bwork order/i,
  /\bdispatch/i,
  /\bfield service/i,
  /\bjob site/i,
  /\bhvac\b/i,
  /\bplumb/i,
  /\bmaintenance crew/i,
  /\bgeofenc/i,
  /\binspection/i,
  /\bviolation/i,
  /\bfacility management/i,
  /\bbuilding maintenance/i,
  /\bproperty management\b/i,
  /\bservice truck/i,
  /\bfleet gps\b/i,
  /\bsubcontractor/i,
  /\bvendor compliance/i,
  /\bcertificate of insurance\b/i,
  /\bcoi\b/i,
  /\bpayroll/i,
  /\bovertime/i,
  /\binvoice reconcil/i,
  /\baccounts receivable\b/i,
  /\bar collections\b/i,
  /\bpreventive maintenance\b/i,
  /\basset lifecycle/i,
  /\bparts inventory\b/i,
  /\bnte\b/i,
  /\bnot-to-exceed\b/i,
  /\bepa\b/i,
  /\bosha\b/i,
  /\bfdny\b/i,
  /\bcustomer retention\b/i,
  /\bhelp desk\b/i,
  /\bworkforce planning\b/i,
  /\brecruiting technicians\b/i,
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

/** @deprecated alias — use assessFacilityOpsEligibility */
export type FacilityOpsEligibility = FieldOpsEligibility;

export function assessFacilityOpsEligibility(
  research?: WorkspaceResearch,
  domain?: string,
  userGoals?: Pick<BusinessProfile, "sixty_day_goal" | "primary_goals" | "custom_goal">,
): FieldOpsEligibility {
  return assessFieldOpsEligibility(research, domain, userGoals);
}

export function assessFieldOpsEligibility(
  research?: WorkspaceResearch,
  domain?: string,
  userGoals?: Pick<BusinessProfile, "sixty_day_goal" | "primary_goals" | "custom_goal">,
): FieldOpsEligibility {
  const goalSignals = userGoals ? extractUserGoalSignals(userGoals) : null;
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
  const fieldCompanyTypes = [
    "field_service",
    "facility_management",
    "property_management",
    "building_maintenance",
  ];

  const typeIsNonField = nonFieldCompanyTypes.some((t) => companyType.includes(t));
  const typeIsField = fieldCompanyTypes.some((t) => companyType.includes(t));

  const nonFieldOpsDetected =
    typeIsNonField || NON_FACILITY_OPS_PATTERNS.some((p) => p.test(corpus));
  const matchedSignals = FACILITY_OPS_SIGNAL_PATTERNS.filter((p) =>
    p.test(corpus),
  ).map((p) => p.source.replace(/\\b/g, "").replace(/\\s\*/g, "").slice(0, 48));

  const strongFieldKeywords =
    /\b(field service|cmms|technician|fleet|work order|hvac|facility management|property management|building maintenance|dispatch|inspection|subcontractor)\b/i;

  const hasFieldOpsEvidence =
    typeIsField ||
    matchedSignals.length >= 2 ||
    (matchedSignals.length >= 1 && strongFieldKeywords.test(lower)) ||
    goalSignals?.indicatesFacilityOps === true;

  if (nonFieldOpsDetected && !hasFieldOpsEvidence) {
    const industry =
      research?.company_profile?.industry ??
      research?.company_profile?.company_type ??
      "your industry";
    return {
      eligible: false,
      nonFieldOpsDetected: true,
      fieldOpsSignals: matchedSignals,
      reason: `Based on ${domain ? domain : "your website"}, you appear to be a ${industry} business (SaaS, agency, or GTM/RevOps) without facility or field-operations signals. Facility 19's 49 agents target dispatched crews, fleets, CMMS, compliance, vendors, billing, and customer operations — we didn't find those patterns, so no agents are recommended.`,
    };
  }

  if (!hasFieldOpsEvidence && corpus.length > 80) {
    const goalSummary = goalSignals?.primaryGoals.length
      ? ` You selected goals focused on ${goalSignals.clusterHints.slice(0, 3).join(", ") || "field operations"}, but we could not align them with agents without clearer operational context.`
      : "";
    return {
      eligible: false,
      nonFieldOpsDetected: false,
      fieldOpsSignals: matchedSignals,
      reason: `We analyzed ${domain ? domain : "your website"} but didn't find clear facility or field-operations signals (technicians, fleets, CMMS, inspections, vendors, or on-site dispatch).${goalSummary} No agents are recommended — your vision roadmap will focus on your stated goals instead.`,
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
