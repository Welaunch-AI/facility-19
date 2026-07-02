import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildVisionRoadmapPdfBytes,
  roadmapPdfFilename,
} from "@/lib/vision-roadmap-pdf";
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
  const hasContent = Boolean(bp.vision_roadmap_doc || bp.vision_roadmap?.trim());
  if (!hasContent) {
    return NextResponse.json(
      { error: "Vision roadmap not generated yet. Open the roadmap page first." },
      { status: 404 },
    );
  }

  try {
    const pdfBytes = buildVisionRoadmapPdfBytes(
      ws.name,
      bp.vision_roadmap_doc ?? null,
      bp.vision_roadmap ?? null,
    );

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${roadmapPdfFilename(ws.name)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate PDF. Try again in a moment." },
      { status: 500 },
    );
  }
}
