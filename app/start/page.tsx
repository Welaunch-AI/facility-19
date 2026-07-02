import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getResumePath } from "@/lib/routing";
import type { ProfileRow } from "@/lib/workspaces";
import { AuthForm } from "@/components/auth-form";

export default async function StartPage() {
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

  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
