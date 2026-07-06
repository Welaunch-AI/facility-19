import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getBlogPosts } from "@/lib/blog-posts";
import { absoluteUrl, defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { PartnersBodyUnlock } from "../partners/partners-body-unlock";
import "../partners/partners.css";

const title = "Blog — Facility management operations & AI";
const description =
  "Insights on facility management, field operations, and deploying AI agents for dispatch, compliance, and vendor coordination.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Facility19 Blog",
    description,
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facility19 Blog",
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const blogJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/blog",
});

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getBlogPosts();

  const blogListingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(blogJsonLd["@graph"] as object[]),
      {
        "@type": "Blog",
        "@id": `${absoluteUrl("/blog")}#blog`,
        name: "Facility19 Blog",
        description,
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          url: absoluteUrl(`/blog/${post.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogListingJsonLd} />
      <PartnersBodyUnlock />
      {children}
    </>
  );
}
