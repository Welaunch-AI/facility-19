import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/onboarding";
import { getResumePath, sanitizeNextPath } from "@/lib/routing";
import type { ProfileRow } from "@/lib/workspaces";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureProfile(supabase, user, "oauth");

        const { data: profile } = await supabase
          .from("profiles")
          .select(
            "id, email, full_name, onboarding_step, onboarding_answers, auth_provider, active_workspace_id, tour_completed_at",
          )
          .eq("id", user.id)
          .maybeSingle();

        const destination = profile
          ? getResumePath(profile as ProfileRow)
          : "/onboarding?step=1";

        return NextResponse.redirect(`${origin}${destination}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/start?error=auth`);
}
