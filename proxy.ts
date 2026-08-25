import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const CANONICAL_HOST = "www.welaunch.ai";

const REDIRECT_HOSTS = new Set([
  "f19-polsia.vercel.app",
  "welaunch.space",
  "www.welaunch.space",
  "welaunch.site",
  "www.welaunch.site",
]);

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host && REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";

    if (url.pathname === "/" && url.searchParams.has("code")) {
      url.pathname = "/auth/callback";
    }

    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon.png|facility|api|sitemap\\.xml|robots\\.txt|llms\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
