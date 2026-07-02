import { NextResponse } from "next/server";
import { getCatalogAgent } from "@/lib/agent-catalog";
import { researchContextForPrompt } from "@/lib/agent-matching";
import { chatCompletion } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import { hasRecommendedAgents } from "@/lib/workspaces";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";

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
      markdown: null,
      reason:
        bp.recommendation_skipped_reason ??
        "No Facility 19 agents matched your business — vision roadmap was not generated.",
    });
  }

  const selectedIds = bp.selected_agent_ids ?? [];
  const agents = selectedIds
    .map((id) => getCatalogAgent(id))
    .filter(Boolean)
    .map(
      (a) =>
        `${a!.name} (${a!.role}): ${a!.description}. Automates: ${a!.automates}`,
    );

  const hasAgents = agents.length > 0;

  const prompt = `Write a personalized "Roadmap to 100x" vision document in markdown for ${ws.name}.

Domain: ${bp.domain ?? "unknown"}
60-day goal: ${bp.sixty_day_goal ?? "not provided"}
Primary goals: ${(bp.primary_goals ?? []).join(", ") || "none"}
Custom goal: ${bp.custom_goal ?? "none"}

${researchContextForPrompt(bp.research)}

${hasAgents ? `Selected agents (ONLY mention these—do not invent others):\n${agents.join("\n")}` : "No agents selected. Do NOT mention or invent any agents. Focus on operational baseline and phased plan from their goals and website."}

Instructions:
- Be specific to THIS company. Cite signals from their website research and 60-day goal.
- Do NOT genericize. Do NOT mention agents that were not selected.
- Quote or paraphrase their 60-day goal in a dedicated section.

Include these markdown sections:
1. Where you are today (1x baseline) — grounded in research
2. Your 60-day north star — tied to their stated goal
${hasAgents ? "3. Your agent package — each selected agent tied to a specific pain point from their operations\n4. 30 / 60 / 90 day phased timeline\n5. Measurable outcomes and headline metric" : "3. 30 / 60 / 90 day phased timeline\n4. Measurable outcomes and headline metric"}`;

  let markdown: string;
  try {
    markdown = await chatCompletion([
      {
        role: "system",
        content:
          "You write strategic operations roadmaps for B2B founders in field service and facility management. Use markdown headings. Be specific—never generic boilerplate.",
      },
      { role: "user", content: prompt },
    ]);
  } catch {
    markdown = `# Roadmap to 100x — ${ws.name}\n\n## Where you are today\n${bp.research?.summary ?? bp.domain ?? "Your operations"}\n\n## Your 60-day north star\n${bp.sixty_day_goal ?? "Operational improvement"}\n\n${
      hasAgents
        ? `## Your agent package\n${agents.join("\n")}`
        : "## Phased plan\nFocus on goals from your onboarding interview."
    }\n\n## 30 / 60 / 90 days\nPhased deployment aligned to your stated goals.`;
  }

  await updateWorkspaceProfile(supabase, workspaceId, {
    vision_roadmap: markdown,
    journey_stage: "roadmap",
  });

  return NextResponse.json({ markdown });
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

  return NextResponse.json({
    markdown: ws.business_profile?.vision_roadmap ?? null,
    agents: (ws.business_profile?.selected_agent_ids ?? [])
      .map((aid) => getCatalogAgent(aid))
      .filter(Boolean),
  });
}
