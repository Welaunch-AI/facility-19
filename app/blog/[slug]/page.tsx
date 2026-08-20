import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFaq } from "@/components/blog/blog-faq";
import {
  getBlogTableOfContents,
  headingAnchorId,
  NotionBlocks,
  splitBlogFaq,
} from "@/components/blog/notion-blocks";
import { JsonLd } from "@/components/json-ld";
import { MarketingFooter } from "@/components/marketing-footer";
import { BlogPostNav } from "../blog-post-nav";
import { BlogToc } from "./blog-toc";
import { formatBlogDate, postCategory, readingTimeFromBlocks } from "@/lib/blog";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";
import {
  getPostBySlug,
  getPublishedPosts,
  isNotionConfigured,
} from "@/lib/notion";
import { absoluteUrl, defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("[blog] generateStaticParams failed", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isNotionConfigured()) return {};

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} — WeLaunch Blog`;
  const path = `/blog/${post.slug}`;
  const coverAbsolute = post.coverUrl
    ? post.coverUrl.startsWith("http")
      ? post.coverUrl
      : absoluteUrl(post.coverUrl)
    : defaultOpenGraph.images[0].url;

  return {
    title,
    description: post.description || undefined,
    alternates: { canonical: path },
    openGraph: {
      ...defaultOpenGraph,
      title: post.title,
      description: post.description,
      url: path,
      type: "article",
      publishedTime: post.date ?? undefined,
      images: [{ url: coverAbsolute }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [coverAbsolute],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isNotionConfigured()) notFound();

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { articleBlocks, faqHeading, faqItems } = splitBlogFaq(post.blocks);
  const tocItems = getBlogTableOfContents([
    ...articleBlocks,
    ...(faqHeading ? [faqHeading] : []),
  ])
    .filter((item) => item.level <= 2)
    .map((item) => ({
      id: item.id,
      title: item.title,
      depth: (item.level === 3 ? 3 : 2) as 2 | 3,
    }));

  const dateLabel = formatBlogDate(post.date);
  const readingTime = readingTimeFromBlocks(post.blocks);
  const path = `/blog/${post.slug}`;
  const postJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(pageJsonLdGraph({
        name: post.title,
        description: post.description,
        path,
      })["@graph"] as object[]),
      {
        "@type": "BlogPosting",
        "@id": `${absoluteUrl(path)}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date ?? undefined,
        image: post.coverUrl
          ? post.coverUrl.startsWith("http")
            ? post.coverUrl
            : absoluteUrl(post.coverUrl)
          : undefined,
        author: {
          "@type": "Organization",
          name: "WeLaunch",
        },
        publisher: {
          "@type": "Organization",
          name: "WeLaunch",
        },
        mainEntityOfPage: absoluteUrl(path),
      },
    ],
  };

  const allPosts = await getPublishedPosts();
  const morePosts = allPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <div className="partners-page-root min-h-screen">
      <JsonLd data={postJsonLd} />
      <BlogPostNav />
      <main>
        <section className="mx-auto w-full max-w-7xl px-6 pt-6 pb-12 md:pt-8 md:pb-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
            <article className="min-w-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-brand transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                <span>All articles</span>
              </Link>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                <span className="font-mono text-xs uppercase tracking-wider">
                  {postCategory(post)}
                </span>
                {dateLabel ? (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={post.date ?? undefined}>{dateLabel}</time>
                  </>
                ) : null}
                <span aria-hidden>·</span>
                <span>{readingTime}</span>
              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
                {post.title}
              </h1>
              {post.description ? (
                <p className="mt-5 max-w-4xl text-lg leading-relaxed text-ink-muted">
                  {post.description}
                </p>
              ) : null}
              {post.coverUrl ? (
                <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={post.coverUrl}
                    src={post.coverUrl}
                    alt=""
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="prose-blog mt-12 max-w-none">
                <NotionBlocks blocks={articleBlocks} />
              </div>

              {faqHeading && faqItems.length > 0 ? (
                <BlogFaq heading={faqHeading} items={faqItems} />
              ) : null}
            </article>
            <aside className="hidden lg:block">
              <div
                className="lg:fixed lg:top-24 lg:w-[290px]"
                style={{
                  right: "max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))",
                }}
              >
                <BlogToc
                  items={tocItems}
                  stopAtId={
                    faqHeading ? headingAnchorId(faqHeading) : undefined
                  }
                />
              </div>
            </aside>
          </div>
        </section>

        {morePosts.length > 0 && (
          <section className="border-t border-line bg-surface-2">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                More articles
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {morePosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="card-soft hover-lift block p-6"
                  >
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                      {postCategory(related)}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-ink">
                      {related.title}
                    </h3>
                    {related.description ? (
                      <p className="mt-2 text-sm text-ink-muted">
                        {related.description}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="rounded-3xl border border-[#1f263a] bg-[#0a0a0b] px-8 py-10 text-center md:px-12 md:py-14">
              <p className="font-mono text-xs uppercase tracking-wider text-[#8fa2ff]">
                Next step
              </p>
              <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Put your coordination workflows on autopilot.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                See how WeLaunch replaces manual dispatch, field accountability,
                and vendor onboarding with autonomous AI agents.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/start"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6b7bff] px-5 text-sm font-semibold text-white transition hover:bg-[#5a6cff]"
                >
                  Create your workspace
                </Link>
                <a
                  href={CAL_DEMO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#6b7bff] px-5 text-sm font-semibold text-[#8fa2ff] transition hover:bg-[#101426] hover:text-white"
                >
                  Book a call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
