import type { BusinessProfile, ProfileRow } from "@/lib/workspaces";
import { ONBOARDING_COMPLETE_STEP } from "@/lib/workspaces";

export function getResumePath(profile: ProfileRow, workspaceId?: string | null) {
  if (profile.onboarding_step < ONBOARDING_COMPLETE_STEP) {
    const step = Math.max(1, Math.min(5, profile.onboarding_step));
    return `/onboarding?step=${step}`;
  }

  const wsId = workspaceId ?? profile.active_workspace_id;
  if (!wsId) return "/onboarding?step=5";

  const stage = (profile.onboarding_answers as { journey_stage?: string })
    ?.journey_stage;

  return getJourneyPath(wsId, stage as BusinessProfile["journey_stage"]);
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
    return "/workspaces";
  }
  return next;
}
