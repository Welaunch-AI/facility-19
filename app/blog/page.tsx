"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import {
  DefaultMarketingCtas,
  MarketingNav,
} from "@/components/marketing-nav";
import { getBlogPosts } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const posts = getBlogPosts();

export default function BlogPage() {
  const navCta = <DefaultMarketingCtas />;

  return (
    <div className="partners-page-root min-h-screen">
      <MarketingNav currentPath="/blog" cta={navCta} mobileCta={navCta} />
      <main>
        <section className="grid-bg relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-16 md:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow eyebrow-dot">Facility19 Blog</span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
                Operations insights for{" "}
                <span className="text-brand">facility leaders</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted">
                Practical writing on field operations, AI agents, and how FM
                teams deploy automation without disrupting the work.
              </p>
            </div>
          </div>
        </section>

        <section className="section-fade-top bg-surface-2">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="card-soft hover-lift flex flex-col p-6 md:p-7"
                >
                  <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-brand"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-muted">
                    {post.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
                    <time
                      dateTime={post.publishedAt}
                      className="text-sm text-ink-muted"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-ink"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
