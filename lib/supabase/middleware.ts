import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ONBOARDING_COMPLETE_STEP } from "@/lib/workspaces";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const code = request.nextUrl.searchParams.get("code");

  // Supabase OAuth sometimes lands on Site URL (/) instead of /auth/callback.
  if (code && pathname !== "/auth/callback") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  const publicPaths = ["/privacy", "/terms", "/partners", "/talk-to-aria"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPrefixes = ["/workspaces", "/onboarding"];

  if (!user && protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/start";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/start" || pathname === "/")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_step, active_workspace_id, onboarding_answers")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    if (!profile || profile.onboarding_step < ONBOARDING_COMPLETE_STEP) {
      const step = profile?.onboarding_step ?? 1;
      url.pathname = "/onboarding";
      url.searchParams.set("step", String(Math.min(5, Math.max(1, step))));
    } else if (profile.active_workspace_id) {
      url.pathname = `/workspaces/${profile.active_workspace_id}`;
    } else {
      url.pathname = "/workspaces";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
