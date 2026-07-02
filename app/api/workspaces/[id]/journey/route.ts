import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";
import type { JourneyStage } from "@/lib/workspaces";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ws = await getOwnedWorkspace(supabase, id, user.id);
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { stage?: JourneyStage };
  if (!body.stage) {
    return NextResponse.json({ error: "Missing stage" }, { status: 400 });
  }

  await updateWorkspaceProfile(supabase, id, { journey_stage: body.stage });

  if (body.stage === "complete") {
    await supabase
      .from("workspaces")
      .update({ status: "active" })
      .eq("id", id);
  }

  return NextResponse.json({ ok: true });
}
