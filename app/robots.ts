import type { MetadataRoute } from "next";
import { getServerSiteUrl } from "@/lib/site-url";

const DISALLOW = ["/api/", "/auth/", "/onboarding", "/workspaces/", "/start"];

const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google
  "Google-Extended",
  // Apple
  "Applebot-Extended",
  // Amazon
  "Amazonbot",
  "Amzn-SearchBot",
  // Common Crawl
  "CCBot",
  // ByteDance
  "Bytespider",
  // Cohere
  "cohere-ai",
  // Meta
  "FacebookBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  // Other AI crawlers
  "Diffbot",
  "YouBot",
  "Omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "DuckAssistBot",
  "Ai2Bot",
] as const;

type RobotsRule = {
  userAgent: string;
  allow: string;
  disallow: string[];
};

function crawlerRule(userAgent: string): RobotsRule {
  return {
    userAgent,
    allow: "/",
    disallow: DISALLOW,
  };
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSiteUrl();

  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => crawlerRule(userAgent)),
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
