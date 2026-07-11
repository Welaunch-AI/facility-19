import type { BusinessProfile, ProfileRow } from "@/lib/workspaces";
import { ONBOARDING_COMPLETE_STEP } from "@/lib/workspaces";

export function getResumePath(profile: ProfileRow, workspaceId?: string | null) {
  const wsId = workspaceId ?? profile.active_workspace_id;

  // If they already have a workspace, always send them there — never re-onboard.
  if (wsId) {
    const stage = (profile.onboarding_answers as { journey_stage?: string })
      ?.journey_stage;
    return getJourneyPath(wsId, stage as BusinessProfile["journey_stage"]);
  }

  // No workspace yet — resume or start onboarding.
  if (profile.onboarding_step < ONBOARDING_COMPLETE_STEP) {
    const step = Math.max(1, Math.min(5, profile.onboarding_step));
    return `/onboarding?step=${step}`;
  }

  return "/onboarding?step=5";
}

export function getJourneyPath(
  workspaceId: string,
  stage?: BusinessProfile["journey_stage"],
) {
  switch (stage) {
    case "roadmap":
      return `/workspaces/${workspaceId}/roadmap`;
    case "dashboard":
    case "complete":
      return `/workspaces/${workspaceId}/dashboard`;
    case "agents":
    default:
      return `/workspaces/${workspaceId}`;
  }
}

export function sanitizeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/onboarding?step=1";
  }
  return next;
}
