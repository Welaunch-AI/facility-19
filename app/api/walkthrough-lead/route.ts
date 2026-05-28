import { NextResponse } from "next/server";

/** Default n8n webhook; override with N8N_WALKTHROUGH_WEBHOOK_URL if needed. */
const DEFAULT_N8N_WALKTHROUGH_WEBHOOK =
  "https://welaunch-kaif.app.n8n.cloud/webhook/02f72f5d-1202-4061-b498-e06bba4a7266";

type LeadPayload = {
  fullName: string;
  workEmail: string;
  industry: string;
};

function parsePayload(body: unknown): LeadPayload | null {
  if (!body || typeof body !== "object") return null;
  const { fullName, workEmail, industry } = body as Record<string, unknown>;
  if (
    typeof fullName !== "string" ||
    typeof workEmail !== "string" ||
    typeof industry !== "string"
  ) {
    return null;
  }
  const trimmedName = fullName.trim();
  const trimmedEmail = workEmail.trim().toLowerCase();
  const trimmedIndustry = industry.trim();
  if (!trimmedName || trimmedName.length > 200) return null;
  if (!trimmedEmail || trimmedEmail.length > 320) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return null;
  if (!trimmedIndustry || trimmedIndustry.length > 120) return null;
  return {
    fullName: trimmedName,
    workEmail: trimmedEmail,
    industry: trimmedIndustry,
  };
}

export async function POST(request: Request) {
  const webhookUrl =
    process.env.N8N_WALKTHROUGH_WEBHOOK_URL?.trim() ||
    DEFAULT_N8N_WALKTHROUGH_WEBHOOK;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lead = parsePayload(body);
  if (!lead) {
    return NextResponse.json(
      { error: "Invalid full name, work email, or industry" },
      { status: 400 },
    );
  }

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    console.error("[walkthrough-lead] n8n webhook failed:", upstream.status, text);
    return NextResponse.json(
      { error: "Failed to submit your request" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
