import { getLlmsTxt } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await getLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
