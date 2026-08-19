import { NextResponse } from "next/server";
import {
  isNotionConfigured,
  resolveNotionBlockFileUrl,
  resolveNotionCoverUrl,
} from "@/lib/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

async function proxyImage(sourceUrl: string) {
  const upstream = await fetch(sourceUrl, {
    // Notion signed URLs are short-lived; never reuse a stale fetch cache entry.
    cache: "no-store",
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Failed to fetch Notion asset" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Cache-Control", CACHE_CONTROL);
  headers.set("Content-Type", upstream.headers.get("Content-Type") || "application/octet-stream");

  const contentLength = upstream.headers.get("Content-Length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}

export async function GET(request: Request) {
  if (!isNotionConfigured()) {
    return NextResponse.json({ error: "Notion is not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");
  const blockId = searchParams.get("blockId");

  if (!pageId && !blockId) {
    return NextResponse.json({ error: "pageId or blockId is required" }, { status: 400 });
  }

  try {
    const sourceUrl = pageId
      ? await resolveNotionCoverUrl(pageId)
      : await resolveNotionBlockFileUrl(blockId!);

    if (!sourceUrl) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return await proxyImage(sourceUrl);
  } catch (error) {
    console.error("[notion-asset] failed to resolve asset", error);
    return NextResponse.json({ error: "Failed to resolve Notion asset" }, { status: 500 });
  }
}
