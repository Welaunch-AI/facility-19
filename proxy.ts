import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.welaunch.ai";

const REDIRECT_HOSTS = new Set([
  "f19-polsia.vercel.app",
  "welaunch.space",
  "www.welaunch.space",
  "welaunch.site",
  "www.welaunch.site",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host && REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon.png|facility|api|sitemap\\.xml|robots\\.txt|llms\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
