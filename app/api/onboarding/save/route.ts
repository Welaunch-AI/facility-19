import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveOnboardingStep } from "@/lib/onboarding";
import {
  defaultBusinessProfile,
  normalizeDomain,
  ONBOARDING_COMPLETE_STEP,
  workspaceNameFromDomain,
} from "@/lib/workspaces";
import { updateWorkspaceProfile } from "@/lib/workspace-api";

type SaveBody = {
  step: number;
  answers: {
    full_name?: string;
    domain?: string;
    sixty_day_goal?: string;
    primary_goals?: string[];
    custom_goal?: string;
  };
  workspaceId?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { step, answers } = body;
  if (!step || step < 1 || step > 6) {
    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  }

  const profileStep = step === 6 ? ONBOARDING_COMPLETE_STEP : step;
  const merged = await saveOnboardingStep(
    supabase,
    user.id,
    profileStep,
    answers,
  );

  let workspaceId = body.workspaceId ?? null;

  if (step >= 1 && answers.full_name && !workspaceId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("active_workspace_id")
      .eq("id", user.id)
      .single();

    workspaceId = profile?.active_workspace_id ?? null;

    if (!workspaceId) {
      const { data: ws, error } = await supabase
        .from("workspaces")
        .insert({
          owner_id: user.id,
          name: "New Workspace",
          lane: "facility",
          status: "onboarding",
          business_profile: defaultBusinessProfile(),
        })
        .select("id")
        .single();

      if (error || !ws) {
        return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
      }
      workspaceId = ws.id;
      await supabase
        .from("profiles")
        .update({ active_workspace_id: workspaceId })
        .eq("id", user.id);
    }
  }

  if (workspaceId) {
    const patch: Record<string, unknown> = {};
    if (answers.domain) {
      const domain = normalizeDomain(answers.domain);
      patch.domain = domain;
      await updateWorkspaceProfile(supabase, workspaceId, patch, {
        name: workspaceNameFromDomain(domain),
      });
    }
    if (answers.sixty_day_goal) patch.sixty_day_goal = answers.sixty_day_goal;
    if (answers.primary_goals) patch.primary_goals = answers.primary_goals;
    if (answers.custom_goal !== undefined) patch.custom_goal = answers.custom_goal;

    if (Object.keys(patch).length > 0) {
      await updateWorkspaceProfile(supabase, workspaceId, patch);
    }

    if (answers.domain && step >= 2) {
      const origin = new URL(request.url).origin;
      fetch(`${origin}/api/research/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({ workspaceId, domain: normalizeDomain(answers.domain) }),
      }).catch(() => {});
    }

    if (step === 6) {
      await updateWorkspaceProfile(supabase, workspaceId, {
        journey_stage: "agents",
      });
      await supabase.from("intake_messages").insert({
        workspace_id: workspaceId,
        owner_id: user.id,
        role: "system",
        content: "Onboarding completed",
        metadata: merged,
      });
    }
  }

  return NextResponse.json({ ok: true, workspaceId, answers: merged });
}
