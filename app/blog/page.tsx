import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import {
  DefaultMarketingCtas,
  MarketingNav,
} from "@/components/marketing-nav";
import { formatBlogDate, postCategory } from "@/lib/blog";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const navCta = <DefaultMarketingCtas />;

  return (
    <div className="partners-page-root min-h-screen">
      <MarketingNav currentPath="/blog" cta={navCta} mobileCta={navCta} />
      <main>
        <section className="grid-bg relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-16 md:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow eyebrow-dot">WeLaunch Blog</span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
                Operations insights for{" "}
                <span className="text-brand">facility leaders</span>
              </h1>
              <p
                data-speakable="true"
                className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted"
              >
                Practical writing on field operations, AI agents, and how FM
                teams deploy automation without disrupting the work.
              </p>
            </div>
          </div>
        </section>

        <section className="section-fade-top bg-surface-2">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.length === 0 ? (
                <p className="col-span-full text-center text-ink-muted">
                  New articles will appear here soon.
                </p>
              ) : (
                posts.map((post) => {
                  const dateLabel = formatBlogDate(post.date);

                  return (
                    <article
                      key={post.id}
                      className="card-soft hover-lift flex flex-col overflow-hidden"
                    >
                      {post.coverUrl ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="relative block aspect-[16/9] overflow-hidden bg-surface-2"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            key={post.coverUrl}
                            src={post.coverUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </Link>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
                          <span className="font-mono text-xs uppercase tracking-wider">
                            {postCategory(post)}
                          </span>
                          {dateLabel ? <span>{dateLabel}</span> : null}
                        </div>
                        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-colors hover:text-brand"
                          >
                            {post.title}
                          </Link>
                        </h2>
                        {post.description ? (
                          <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-muted">
                            {post.description}
                          </p>
                        ) : (
                          <div className="flex-1" />
                        )}
                        <div className="mt-6 flex items-center justify-end border-t border-line pt-5">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-ink"
                          >
                            Read article
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
