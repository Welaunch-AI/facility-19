import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/roi-dashboard/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { MarketingFooter } from "@/components/marketing-footer";
import { BlogPostNav } from "../blog-post-nav";
import { BlogToc } from "./blog-toc";
import {
  getAllBlogSlugs,
  getBlogPost,
  getBlogPosts,
} from "@/lib/blog-posts";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";
import { absoluteUrl, defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

type FaqItem = {
  question: string;
  answer: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function textFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => textFromNode(child)).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const candidate = node as { props?: { children?: React.ReactNode } };
    return textFromNode(candidate.props?.children ?? "");
  }
  return "";
}

function extractTocFromMarkdown(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const headingPattern = /^(##|###)\s+(.+)$/gm;
  let isInsideFaqSection = false;
  let match = headingPattern.exec(markdown);

  while (match) {
    const depth = match[1] === "##" ? 2 : 3;
    const title = stripInlineMarkdown(match[2]);
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (depth === 2) {
      isInsideFaqSection = normalizedTitle === "faq" || normalizedTitle === "faqs";
    }

    if (isInsideFaqSection && depth === 3) {
      match = headingPattern.exec(markdown);
      continue;
    }

    const id = slugify(title);
    if (id) {
      items.push({ id, title, depth });
    }
    match = headingPattern.exec(markdown);
  }

  return items;
}

function parseFaqFromMarkdown(markdown: string): {
  articleMarkdown: string;
  faqHeading: string | null;
  faqItems: FaqItem[];
} {
  const lines = markdown.split("\n");
  const faqHeadingRegex = /^##\s+(.+)$/i;
  const faqStartIndex = lines.findIndex((line) => {
    const match = faqHeadingRegex.exec(line.trim());
    if (!match) return false;
    const normalized = stripInlineMarkdown(match[1])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return normalized === "faq" || normalized === "faqs";
  });

  if (faqStartIndex === -1) {
    return { articleMarkdown: markdown, faqHeading: null, faqItems: [] };
  }

  let faqEndIndex = lines.length;
  for (let i = faqStartIndex + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i].trim())) {
      faqEndIndex = i;
      break;
    }
  }

  const faqHeadingMatch = faqHeadingRegex.exec(lines[faqStartIndex].trim());
  const faqHeading = faqHeadingMatch ? stripInlineMarkdown(faqHeadingMatch[1]) : "FAQ";

  const faqBodyLines = lines.slice(faqStartIndex + 1, faqEndIndex);
  const faqItems: FaqItem[] = [];
  const headingQuestionRegex = /^###\s+(.+)$/;
  const boldQuestionRegex = /^\*\*(.+?)\*\*$/;

  let currentQuestion = "";
  let currentAnswerLines: string[] = [];

  const pushCurrent = () => {
    const question = stripInlineMarkdown(currentQuestion);
    const answer = currentAnswerLines.join("\n").trim();
    if (question && answer) {
      faqItems.push({ question, answer });
    }
  };

  for (const line of faqBodyLines) {
    const trimmedLine = line.trim();
    const headingQuestionMatch = headingQuestionRegex.exec(trimmedLine);
    const boldQuestionMatch = boldQuestionRegex.exec(trimmedLine);
    const questionMatch = headingQuestionMatch?.[1] ?? boldQuestionMatch?.[1];
    if (questionMatch) {
      pushCurrent();
      currentQuestion = questionMatch;
      currentAnswerLines = [];
      continue;
    }
    if (currentQuestion) {
      currentAnswerLines.push(line);
    }
  }
  pushCurrent();

  const articleMarkdown = [...lines.slice(0, faqStartIndex), ...lines.slice(faqEndIndex)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { articleMarkdown, faqHeading, faqItems };
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const title = `${post.title} — Facility19 Blog`;
  const path = `/blog/${post.slug}`;

  return {
    title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultOpenGraph,
      title: post.title,
      description: post.description,
      url: path,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [defaultOpenGraph.images[0].url],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { articleMarkdown, faqHeading, faqItems } = parseFaqFromMarkdown(post.body);
  const tocItems = extractTocFromMarkdown(post.body);

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
        datePublished: post.publishedAt,
        author: {
          "@type": "Organization",
          name: "Facility19",
        },
        publisher: {
          "@type": "Organization",
          name: "Facility19",
        },
        mainEntityOfPage: absoluteUrl(path),
      },
    ],
  };

  const allPosts = getBlogPosts();
  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

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
                  {post.category}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-ink-muted">
                {post.description}
              </p>
              <div className="prose-blog mt-12 max-w-none">
                <Markdown
                  components={{
                    h2: ({ children }) => {
                      const id = slugify(textFromNode(children)) || "section";
                      return (
                        <h2
                          id={id}
                          className="mt-12 mb-4 scroll-mt-28 text-2xl font-semibold tracking-tight text-ink"
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = slugify(textFromNode(children)) || "section";
                      return (
                        <h3
                          id={id}
                          className="mt-8 mb-3 scroll-mt-28 text-xl font-semibold tracking-tight text-ink"
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mt-4 text-[17px] leading-[1.7] text-ink-2">
                        {children}
                      </p>
                    ),
                    ol: ({ children }) => (
                      <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-2">
                        {children}
                      </ol>
                    ),
                    ul: ({ children }) => (
                      <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-2">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-ink">{children}</strong>
                    ),
                    a: ({ href, children }) => (
                      <Link
                        href={href ?? "#"}
                        className="font-medium text-brand underline-offset-2 hover:underline"
                      >
                        {children}
                      </Link>
                    ),
                  }}
                >
                  {articleMarkdown}
                </Markdown>
              </div>

              {faqItems.length > 0 && (
                <section id={slugify(faqHeading ?? "faq")} className="mt-14">
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {faqHeading ?? "FAQ"}
                  </h2>
                  <div className="card-soft mt-5 px-6 py-2">
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item, index) => (
                        <AccordionItem
                          key={`${item.question}-${index}`}
                          value={`faq-item-${index + 1}`}
                          className="border-line"
                        >
                          <AccordionTrigger className="py-5 text-left text-[17px] font-medium text-ink hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 pt-0">
                            <div className="prose-blog max-w-none">
                              <Markdown
                                components={{
                                  p: ({ children }) => (
                                    <p className="mt-3 text-[16px] leading-[1.75] text-ink-2">
                                      {children}
                                    </p>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px] leading-[1.75] text-ink-2">
                                      {children}
                                    </ol>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="mt-3 list-disc space-y-2 pl-6 text-[16px] leading-[1.75] text-ink-2">
                                      {children}
                                    </ul>
                                  ),
                                  li: ({ children }) => <li>{children}</li>,
                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-ink">{children}</strong>
                                  ),
                                  a: ({ href, children }) => (
                                    <Link
                                      href={href ?? "#"}
                                      className="font-medium text-brand underline-offset-2 hover:underline"
                                    >
                                      {children}
                                    </Link>
                                  ),
                                }}
                              >
                                {item.answer}
                              </Markdown>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
              )}
            </article>
            <aside className="hidden lg:block">
              <div
                className="lg:fixed lg:top-24 lg:w-[290px]"
                style={{ right: "max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))" }}
              >
                <BlogToc
                  items={tocItems}
                  stopAtId={faqItems.length > 0 ? slugify(faqHeading ?? "faq") : undefined}
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
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="card-soft hover-lift block p-6"
                  >
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                      {related.category}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-ink">
                      {related.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      {related.description}
                    </p>
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
                See how Facility19 replaces manual dispatch, field accountability,
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
