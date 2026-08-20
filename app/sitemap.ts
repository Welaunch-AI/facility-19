import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/notion";
import { getServerSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/partners", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/talk-to-aria", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerSiteUrl();
  const blogPosts = await getPublishedPosts().catch((error) => {
    console.error("[sitemap] failed to load blog posts", error);
    return [];
  });

  const staticEntries = publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
