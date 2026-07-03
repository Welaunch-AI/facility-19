import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getResumePath } from "@/lib/routing";
import type { ProfileRow } from "@/lib/workspaces";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const params = await searchParams;

  if (params.code) {
    const qs = new URLSearchParams();
    qs.set("code", params.code);
    if (params.next) qs.set("next", params.next);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, onboarding_step, onboarding_answers, auth_provider, active_workspace_id, tour_completed_at",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      redirect(getResumePath(profile as ProfileRow));
    }
    redirect("/onboarding?step=1");
  }

  redirect("/start");
}
