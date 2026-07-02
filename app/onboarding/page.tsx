import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireProfile } from "@/lib/auth-server";
import type { OnboardingAnswers, ProfileRow } from "@/lib/workspaces";
import { ONBOARDING_COMPLETE_STEP } from "@/lib/workspaces";
import { getResumePath } from "@/lib/routing";
import { OnboardingWizard } from "./onboarding-wizard";
import "../app-shell.css";
import { AppShellBodyUnlock } from "@/components/app-shell-body-unlock";

export default async function OnboardingPage() {
  const { profile } = await requireProfile();
  if (!profile) redirect("/start");

  if (profile.onboarding_step >= ONBOARDING_COMPLETE_STEP) {
    redirect(getResumePath(profile as ProfileRow));
  }

  return (
    <>
      <AppShellBodyUnlock />
      <Suspense>
        <OnboardingWizard
          initialAnswers={(profile.onboarding_answers ?? {}) as OnboardingAnswers}
          initialStep={profile.onboarding_step}
          initialWorkspaceId={profile.active_workspace_id}
        />
      </Suspense>
    </>
  );
}
