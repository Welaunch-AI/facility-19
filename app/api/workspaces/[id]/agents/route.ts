import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";

export async function GET(
  _request: Request,
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

  return NextResponse.json({
    selected: ws.business_profile?.selected_agent_ids ?? [],
    recommended: ws.business_profile?.recommended_details ?? [],
    research: ws.business_profile?.research,
  });
}

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

  const body = (await request.json()) as { selected_agent_ids?: string[] };
  const selected = body.selected_agent_ids ?? [];

  await updateWorkspaceProfile(supabase, id, {
    selected_agent_ids: selected,
  });

  return NextResponse.json({ ok: true, selected });
}
