import { NextResponse } from "next/server";
import { getCatalogAgent } from "@/lib/agent-catalog";
import { researchContextForPrompt } from "@/lib/agent-matching";
import { chatCompletion, getRoadmapModel } from "@/lib/openrouter";
import {
  extractUserGoalSignals,
  userGoalsContextForPrompt,
} from "@/lib/user-goal-signals";
import { createClient } from "@/lib/supabase/server";
import { hasRecommendedAgents } from "@/lib/workspaces";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";
import {
  normalizeVisionRoadmap,
  roadmapPromptSchema,
  visionRoadmapToMarkdown,
  VISION_ROADMAP_VERSION,
  type VisionRoadmapDocument,
} from "@/lib/vision-roadmap";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: workspaceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ws = await getOwnedWorkspace(supabase, workspaceId, user.id);
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bp = ws.business_profile ?? {};

  if (!hasRecommendedAgents(bp)) {
    return NextResponse.json({
      skipped: true,
      doc: null,
      markdown: null,
      reason:
        bp.recommendation_skipped_reason ??
        "No Facility 19 agents matched your business — vision roadmap was not generated.",
    });
  }

  const selectedIds = bp.selected_agent_ids ?? [];
  const recommendedDetails = bp.recommended_details ?? [];
  const agents = selectedIds
    .map((id) => {
      const catalog = getCatalogAgent(id);
      const rec = recommendedDetails.find((r) => r.id === id);
      if (!catalog) return null;
      return {
        id: catalog.id,
        name: catalog.name,
        role: catalog.role,
        description: catalog.description,
        problemSolved: rec?.problemSolved ?? catalog.automates,
        goalMapping: rec?.goalMapping ?? "",
      };
    })
    .filter(Boolean);

  const hasAgents = agents.length > 0;
  const goalSignals = extractUserGoalSignals(bp);

  const prompt = `Create a personalized "Roadmap to 100x" vision document for ${ws.name}.

Domain: ${bp.domain ?? "unknown"}
Company: ${ws.name}

${userGoalsContextForPrompt(goalSignals)}

${researchContextForPrompt(bp.research)}

${
  hasAgents
    ? `Selected agents (ONLY use these ids — do not invent others):
${agents.map((a) => `- id: ${a!.id} | ${a!.name} (${a!.role}) | ${a!.description} | Maps to goal: ${a!.goalMapping || a!.problemSolved}`).join("\n")}`
    : "No agents selected. agents array must be empty."
}

Full recommended agent details from matching:
${JSON.stringify(recommendedDetails, null, 2)}

Instructions:
- Be specific to THIS company — cite their website, industry, and stated goals.
- Write for a founder/operator who needs a clear visual journey: today → 60-day goal → agents → timeline → outcomes.
- Pain points must come from real signals (dispatch, compliance, billing, technicians, etc.).
- Tie profit/revenue goals to operational levers (efficiency, billing, labor cost, retention).
- Phases must show logical deployment order — foundation agents first, then scale, then optimize.
- Metrics must be realistic and tied to their 60-day goal.

${roadmapPromptSchema(hasAgents)}`;

  let doc: VisionRoadmapDocument;

  try {
    const raw = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You are a strategic operations consultant for Facility 19. You produce structured vision roadmaps for field service and facility management companies. Return valid JSON only. Be specific — never generic boilerplate. Every pain point and outcome must reference this company's actual operations.",
        },
        { role: "user", content: prompt },
      ],
      { json: true, model: getRoadmapModel() },
    );
    doc = normalizeVisionRoadmap(
      JSON.parse(raw) as Partial<VisionRoadmapDocument>,
      bp,
      ws.name,
      selectedIds,
    );
  } catch {
    doc = normalizeVisionRoadmap({}, bp, ws.name, selectedIds);
  }

  const markdown = visionRoadmapToMarkdown(doc);

  await updateWorkspaceProfile(supabase, workspaceId, {
    vision_roadmap: markdown,
    vision_roadmap_doc: doc,
    vision_roadmap_version: VISION_ROADMAP_VERSION,
    journey_stage: "roadmap",
  });

  return NextResponse.json({ doc, markdown });
}

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

  return NextResponse.json({
    doc: bp.vision_roadmap_doc ?? null,
    markdown: bp.vision_roadmap ?? null,
    agents: (bp.selected_agent_ids ?? [])
      .map((aid) => getCatalogAgent(aid))
      .filter(Boolean),
  });
}
