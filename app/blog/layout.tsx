import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getPublishedPosts } from "@/lib/notion";
import { absoluteUrl, defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { PartnersBodyUnlock } from "../partners/partners-body-unlock";
import "../partners/partners.css";

const title = "Blog — Facility management operations & AI";
const description =
  "Insights on facility management, field operations, and deploying AI agents for dispatch, compliance, and vendor coordination.";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    ...defaultOpenGraph,
    title: "WeLaunch Blog",
    description,
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeLaunch Blog",
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const blogJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/blog",
});

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPublishedPosts();

  const blogListingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(blogJsonLd["@graph"] as object[]),
      {
        "@type": "Blog",
        "@id": `${absoluteUrl("/blog")}#blog`,
        name: "WeLaunch Blog",
        description,
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date ?? undefined,
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
