import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth-server";
import { getResumePath } from "@/lib/routing";
import type { ProfileRow, WorkspaceRow } from "@/lib/workspaces";
import { ONBOARDING_COMPLETE_STEP } from "@/lib/workspaces";
import { WorkspacesView } from "./workspaces-view";
import "../app-shell.css";
import { AppShellBodyUnlock } from "@/components/app-shell-body-unlock";

export default async function WorkspacesPage() {
  const { supabase, user, profile } = await requireProfile();

  if (profile && profile.onboarding_step < ONBOARDING_COMPLETE_STEP) {
    redirect(getResumePath(profile as ProfileRow));
  }

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name, lane, status, created_at, business_profile")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <AppShellBodyUnlock />
      <WorkspacesView
        email={profile?.email ?? user.email ?? ""}
        fullName={profile?.full_name ?? null}
        workspaces={(workspaces ?? []) as WorkspaceRow[]}
      />
    </>
  );
}
