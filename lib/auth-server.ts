import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ProfileRow } from "@/lib/workspaces";
import { getResumePath } from "@/lib/routing";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/start");
  return { supabase, user };
}

export async function requireProfile() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, onboarding_step, onboarding_answers, auth_provider, active_workspace_id, tour_completed_at",
    )
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    profile: profile as ProfileRow | null,
  };
}

export async function redirectToResume() {
  const { profile } = await requireProfile();
  if (!profile) redirect("/onboarding?step=1");
  redirect(getResumePath(profile));
}
