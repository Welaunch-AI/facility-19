import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-posts";
import { getServerSiteUrl } from "@/lib/site-url";

const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/partners", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/talk-to-aria", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getServerSiteUrl();
  const blogPosts = getBlogPosts();
  const latestBlogDate = blogPosts[0]?.publishedAt;

  const staticEntries = publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified:
      path === "/blog" && latestBlogDate ? new Date(latestBlogDate) : new Date(),
    changeFrequency,
    priority,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
