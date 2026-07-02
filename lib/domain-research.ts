const MAX_BODY_CHARS = 8000;
const FETCH_TIMEOUT_MS = 8000;

export type DomainFetchResult = {
  reachable: boolean;
  status: number;
  page_title?: string;
  meta_description?: string;
  og_description?: string;
  headings: string[];
  body_excerpt: string;
  industry_hints: string[];
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, name: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return undefined;
}

function extractHeadings(html: string, limit = 6) {
  const headings: string[] = [];
  const pattern = /<(h1|h2)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null && headings.length < limit) {
    const text = stripHtml(match[2] ?? "");
    if (text.length > 2) headings.push(text);
  }
  return headings;
}

function inferIndustryHints(text: string) {
  const lower = text.toLowerCase();
  const hints: string[] = [];
  const rules: [string, RegExp][] = [
    ["field service", /field service|technician|dispatch|work order|cmms/i],
    ["fleet tracking", /fleet|gps|truck|vehicle|intellishift/i],
    ["compliance", /compliance|violation|fdny|inspection|regulatory/i],
    ["facility management", /facility|building|maintenance|hvac|property/i],
    ["rail / transit", /rail|transit|track|locomotive|station/i],
    ["construction", /construction|contractor|job site|survey/i],
    ["healthcare", /healthcare|hospital|clinical|medical/i],
    ["saas / software", /software|saas|platform|cloud|api/i],
  ];
  for (const [label, pattern] of rules) {
    if (pattern.test(lower)) hints.push(label);
  }
  return hints;
}

export async function fetchDomainContent(domain: string): Promise<DomainFetchResult> {
  const url = `https://${domain}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Facility19-Research/1.0" },
      redirect: "follow",
    });
    clearTimeout(timeout);

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const page_title = titleMatch?.[1]?.trim();
    const meta_description = metaContent(html, "description");
    const og_description = metaContent(html, "og:description");
    const headings = extractHeadings(html);
    const bodyText = stripHtml(html).slice(0, MAX_BODY_CHARS);
    const combined = [page_title, meta_description, og_description, ...headings, bodyText]
      .filter(Boolean)
      .join(" ");

    return {
      reachable: res.ok || res.status < 500,
      status: res.status,
      page_title,
      meta_description,
      og_description,
      headings,
      body_excerpt: bodyText,
      industry_hints: inferIndustryHints(combined),
    };
  } catch {
    return {
      reachable: false,
      status: 0,
      headings: [],
      body_excerpt: "",
      industry_hints: [],
    };
  }
}

export function domainContentForPrompt(fetch: DomainFetchResult, domain: string) {
  const parts = [
    `Domain: ${domain}`,
    fetch.page_title ? `Title: ${fetch.page_title}` : null,
    fetch.meta_description ? `Meta description: ${fetch.meta_description}` : null,
    fetch.og_description ? `OG description: ${fetch.og_description}` : null,
    fetch.headings.length ? `Headings: ${fetch.headings.join(" | ")}` : null,
    fetch.industry_hints.length
      ? `Industry hints: ${fetch.industry_hints.join(", ")}`
      : null,
    fetch.body_excerpt ? `Page excerpt:\n${fetch.body_excerpt}` : null,
  ].filter(Boolean);

  return parts.join("\n");
}
