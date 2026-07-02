import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { getCatalogAgent } from "@/lib/agent-catalog";
import { createClient } from "@/lib/supabase/server";
import { getOwnedWorkspace } from "@/lib/workspace-api";

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

  const bp = ws.business_profile ?? {};
  const markdown = bp.vision_roadmap ?? "Vision roadmap not yet generated.";
  const agentNames = (bp.selected_agent_ids ?? [])
    .map((aid) => getCatalogAgent(aid)?.name)
    .filter(Boolean)
    .join(", ");

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(
    `Facility 19 — Roadmap to 100x\n${ws.name}\n\n${markdown}\n\nAgent package: ${agentNames}`,
    180,
  );
  doc.text(lines, 14, 20);

  const pdfBytes = doc.output("arraybuffer");

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${ws.name.replace(/\s+/g, "-")}-roadmap.pdf"`,
    },
  });
}
