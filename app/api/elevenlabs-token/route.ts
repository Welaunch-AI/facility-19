import { NextResponse } from "next/server";

/** Default agent from Lovable export; override with ELEVENLABS_AGENT_ID. */
const DEFAULT_AGENT_ID = "agent_7701kpawyap3f3qt28vjpzexgmda";

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing ELEVENLABS_API_KEY" },
      { status: 500 },
    );
  }

  let agentId = process.env.ELEVENLABS_AGENT_ID?.trim() || DEFAULT_AGENT_ID;
  try {
    const body = (await request.json()) as { agentId?: string };
    if (typeof body?.agentId === "string" && body.agentId.trim()) {
      agentId = body.agentId.trim();
    }
  } catch {
    /* empty body */
  }

  const url = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url",
  );
  url.searchParams.set("agent_id", agentId);

  const upstream = await fetch(url.toString(), {
    method: "GET",
    headers: { "xi-api-key": apiKey },
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return NextResponse.json(
      { error: text || "Failed to get signed URL from ElevenLabs" },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as { signed_url?: string };
  if (!data.signed_url) {
    return NextResponse.json(
      { error: "No signed_url in ElevenLabs response" },
      { status: 502 },
    );
  }

  return NextResponse.json({ signedUrl: data.signed_url });
}
