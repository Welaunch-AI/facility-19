import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth-server";
import type { BusinessProfile } from "@/lib/workspaces";
import { displayNameFromEmail } from "@/lib/workspaces";
import { WorkspaceHomeClient } from "./workspace-home-client";
import "../../app-shell.css";
import { AppShellBodyUnlock } from "@/components/app-shell-body-unlock";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, business_profile, owner_id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!workspace) notFound();

  const bp = (workspace.business_profile ?? {}) as BusinessProfile;

  const userName =
    profile?.full_name ??
    displayNameFromEmail(profile?.email ?? user.email ?? "");

  return (
    <>
      <AppShellBodyUnlock />
      <WorkspaceHomeClient
        workspaceId={id}
        workspaceName={workspace.name}
        userName={userName}
        businessProfile={bp}
      />
    </>
  );
}
