import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth-server";
import type { BusinessProfile } from "@/lib/workspaces";
import { hasRecommendedAgents } from "@/lib/workspaces";
import { RoadmapClient } from "./roadmap-client";
import "../../../app-shell.css";
import { AppShellBodyUnlock } from "@/components/app-shell-body-unlock";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireProfile();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, business_profile, owner_id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!workspace) notFound();

  const bp = (workspace.business_profile ?? {}) as BusinessProfile;

  return (
    <>
      <AppShellBodyUnlock />
      <RoadmapClient
        workspaceId={id}
        workspaceName={workspace.name}
        initialMarkdown={bp.vision_roadmap ?? null}
        agentsMatched={hasRecommendedAgents(bp)}
      />
    </>
  );
}
