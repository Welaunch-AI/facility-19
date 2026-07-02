import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth-server";
import type { BusinessProfile } from "@/lib/workspaces";
import { displayNameFromEmail } from "@/lib/workspaces";
import { DashboardShell } from "../dashboard-shell";
import { NationalDashboardClient } from "../national-client";

export default async function NationalDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, business_profile, owner_id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!workspace) notFound();

  const bp = (workspace.business_profile ?? {}) as BusinessProfile;
  const userName =
    profile?.full_name ??
    displayNameFromEmail(profile?.email ?? user.email ?? "");

  return (
    <DashboardShell
      workspaceId={id}
      userName={userName}
      userEmail={profile?.email ?? user.email ?? ""}
      domain={bp.domain}
      sixtyDayGoal={bp.sixty_day_goal}
      primaryGoals={bp.primary_goals}
    >
      <NationalDashboardClient />
    </DashboardShell>
  );
}
