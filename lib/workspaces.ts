export type ResearchStatus = "pending" | "complete" | "failed";

export type CompanyProfile = {
  company_type?: string;
  industry?: string;
  operations?: string[];
  signals?: string[];
};

export type WorkspaceResearch = {
  status: ResearchStatus;
  started_at: string;
  completed_at?: string;
  summary?: string;
  page_title?: string;
  company_profile?: CompanyProfile;
  raw?: Record<string, unknown>;
};

export type JourneyStage =
  | "onboarding"
  | "agents"
  | "roadmap"
  | "dashboard"
  | "complete";

export type BusinessProfile = {
  domain?: string;
  sixty_day_goal?: string;
  primary_goals?: string[];
  custom_goal?: string;
  research?: WorkspaceResearch;
  recommended_agent_ids?: string[];
  selected_agent_ids?: string[];
  recommended_details?: RecommendedAgentDetail[];
  recommendation_skipped_reason?: string;
  no_match_analysis?: NoMatchAnalysis;
  /** Set when agent matching has run once — prevents re-analysis on revisit. */
  agent_matching_completed_at?: string;
  vision_roadmap?: string;
  journey_stage?: JourneyStage;
};

export type RecommendedAgentDetail = {
  id: string;
  name: string;
  problemSolved: string;
  goalMapping: string;
  description: string;
  relevanceScore?: number;
  requirementReason?: string;
};

export type CustomAgentIdea = {
  name: string;
  role: string;
  description: string;
  mapsToGoal: string;
};

export type NoMatchAnalysis = {
  websiteSummary: string;
  whyNotFacility19: string;
  customAgents: CustomAgentIdea[];
};

export type OnboardingAnswers = {
  full_name?: string;
  domain?: string;
  sixty_day_goal?: string;
  primary_goals?: string[];
  custom_goal?: string;
};

export type WorkspaceRow = {
  id: string;
  name: string;
  lane: string;
  status: string;
  created_at: string;
  business_profile?: BusinessProfile;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  onboarding_step: number;
  onboarding_answers: OnboardingAnswers;
  auth_provider: string | null;
  active_workspace_id: string | null;
  tour_completed_at: string | null;
};

export const ONBOARDING_COMPLETE_STEP = 6;

export function defaultBusinessProfile(
  partial?: Partial<BusinessProfile>,
): BusinessProfile {
  return {
    primary_goals: [],
    recommended_agent_ids: [],
    selected_agent_ids: [],
    journey_stage: "onboarding",
    ...partial,
  };
}

export function formatLaneLabel(lane: string) {
  const labels: Record<string, string> = {
    facility: "Facility / Franchise",
    home: "Home Services",
    pe: "Private Equity",
    private_equity: "Private Equity",
    franchise: "Facility / Franchise",
  };
  return labels[lane] ?? lane.replace(/_/g, " ");
}

export function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  const first = local.split(/[._-]/)[0] ?? local;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function formatWorkspaceDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function normalizeDomain(input: string) {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return value;
}

export function workspaceNameFromDomain(domain: string) {
  const base = domain.split(".")[0] ?? domain;
  return base.charAt(0).toUpperCase() + base.slice(1) + " Workspace";
}

export function hasRecommendedAgents(bp: BusinessProfile): boolean {
  return (bp.recommended_agent_ids ?? []).length > 0;
}

export function hasCompletedAgentMatching(bp: BusinessProfile): boolean {
  if (bp.agent_matching_completed_at) return true;
  if (bp.recommendation_skipped_reason) return true;
  if (bp.no_match_analysis) return true;
  if (Array.isArray(bp.recommended_details)) return true;
  return false;
}
