import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();
  if (host === "f19-polsia.vercel.app") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.facility19.com";
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
    "/((?!_next/static|_next/image|favicon\\.ico|favicon.png|facility|api|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
