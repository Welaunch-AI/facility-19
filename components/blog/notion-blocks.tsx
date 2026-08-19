import type { ReactNode } from "react";
import type {
  BlogBlock,
  BlockObjectResponse,
  RichTextItemResponse,
} from "@/lib/notion";

function plainText(richText: RichTextItemResponse[]) {
  return richText.map((item) => item.plain_text).join("");
}

const INTERNAL_HOSTS = new Set([
  "welaunch.ai",
  "www.welaunch.ai",
  "localhost",
  "127.0.0.1",
]);

function isBacklink(url: string) {
  if (url.startsWith("/") || url.startsWith("#")) return true;

  try {
    const parsed = new URL(url);
    return INTERNAL_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function blockPlainText(block: BlogBlock) {
  switch (block.type) {
    case "paragraph":
      return plainText(block.paragraph.rich_text);
    case "heading_1":
      return plainText(block.heading_1.rich_text);
    case "heading_2":
      return plainText(block.heading_2.rich_text);
    case "heading_3":
      return plainText(block.heading_3.rich_text);
    case "quote":
      return plainText(block.quote.rich_text);
    case "callout":
      return plainText(block.callout.rich_text);
    case "toggle":
      return plainText(block.toggle.rich_text);
    default:
      return "";
  }
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function headingAnchorId(block: BlogBlock) {
  const text = blockPlainText(block).trim();
  const slug = slugifyHeading(text);
  const shortId = block.id.replace(/-/g, "").slice(0, 8);
  return slug ? `${slug}-${shortId}` : shortId;
}

export type BlogTocItem = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
};

export function getBlogTableOfContents(blocks: BlogBlock[]): BlogTocItem[] {
  const items: BlogTocItem[] = [];

  for (const block of blocks) {
    if (
      block.type !== "heading_1" &&
      block.type !== "heading_2" &&
      block.type !== "heading_3"
    ) {
      continue;
    }

    const title = blockPlainText(block).trim();
    if (!title) continue;

    items.push({
      id: headingAnchorId(block),
      title,
      level: block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3,
    });
  }

  return items;
}

function isFaqHeading(block: BlogBlock) {
  if (block.type !== "heading_1" && block.type !== "heading_2") return false;
  const text = blockPlainText(block).trim();
  return /^(frequently asked questions|faqs?)\b/i.test(text);
}

function isSectionBreak(block: BlogBlock) {
  return block.type === "heading_1" || block.type === "heading_2";
}

export type FaqItem = {
  question: BlogBlock;
  answer: BlogBlock[];
};

export function splitBlogFaq(blocks: BlogBlock[]): {
  articleBlocks: BlogBlock[];
  faqHeading: BlogBlock | null;
  faqItems: FaqItem[];
} {
  const faqIndex = blocks.findIndex(isFaqHeading);
  if (faqIndex === -1) {
    return { articleBlocks: blocks, faqHeading: null, faqItems: [] };
  }

  let faqEnd = blocks.length;
  for (let i = faqIndex + 1; i < blocks.length; i += 1) {
    if (isSectionBreak(blocks[i]) && !isFaqHeading(blocks[i])) {
      faqEnd = i;
      break;
    }
  }

  const faqHeading = blocks[faqIndex];
  const faqBody = blocks.slice(faqIndex + 1, faqEnd);
  const faqItems = extractFaqItems(faqBody);
  const articleBlocks = [...blocks.slice(0, faqIndex), ...blocks.slice(faqEnd)];

  return { articleBlocks, faqHeading, faqItems };
}

function extractFaqItems(blocks: BlogBlock[]): FaqItem[] {
  const items: FaqItem[] = [];
  let current: FaqItem | null = null;

  for (const block of blocks) {
    if (block.type === "heading_3") {
      if (current) items.push(current);
      current = { question: block, answer: [] };
      continue;
    }

    if (!current) continue;

    if (block.type === "paragraph" && !block.paragraph.rich_text.length) {
      continue;
    }

    current.answer.push(block);
  }

  if (current) items.push(current);
  return items.filter(
    (item) => item.answer.length > 0 || blockPlainText(item.question),
  );
}

function RichText({ richText }: { richText: RichTextItemResponse[] }) {
  return (
    <>
      {richText.map((item, index) => {
        const content = item.plain_text;
        if (!content) return null;

        let node: ReactNode = content;
        const { annotations, href } = item;

        if (annotations.code) {
          node = (
            <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
              {node}
            </code>
          );
        }
        if (annotations.bold)
          node = <strong className="font-semibold text-ink">{node}</strong>;
        if (annotations.italic) node = <em>{node}</em>;
        if (annotations.strikethrough) node = <s>{node}</s>;
        if (annotations.underline)
          node = <span className="underline underline-offset-2">{node}</span>;

        const link = href || (item.type === "text" ? item.text.link?.url : null);
        if (link) {
          const backlink = isBacklink(link);
          const internal =
            backlink && (link.startsWith("/") || link.startsWith("#"));

          node = (
            <a
              href={link}
              className="font-medium text-brand underline-offset-2 hover:underline"
              target={internal ? undefined : "_blank"}
              rel={internal ? undefined : "noreferrer"}
            >
              {node}
            </a>
          );
        }

        return <span key={`${index}-${content.slice(0, 12)}`}>{node}</span>;
      })}
    </>
  );
}

function getFileUrl(
  block: Extract<BlockObjectResponse, { type: "image" | "video" | "file" | "pdf" }>,
) {
  const media =
    block.type === "image"
      ? block.image
      : block.type === "video"
        ? block.video
        : block.type === "file"
          ? block.file
          : block.pdf;

  if (media.type === "file") {
    return `/api/notion-asset?blockId=${encodeURIComponent(block.id)}`;
  }
  if (media.type === "external") return media.external.url;
  return null;
}

function getCaption(
  block: Extract<BlockObjectResponse, { type: "image" | "video" | "file" | "pdf" }>,
) {
  const media =
    block.type === "image"
      ? block.image
      : block.type === "video"
        ? block.video
        : block.type === "file"
          ? block.file
          : block.pdf;
  return plainText(media.caption);
}

type RenderGroup =
  | { kind: "single"; block: BlogBlock }
  | { kind: "bulleted_list"; blocks: BlogBlock[] }
  | { kind: "numbered_list"; blocks: BlogBlock[] };

function groupBlocks(blocks: BlogBlock[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const listBlocks: BlogBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        listBlocks.push(blocks[i]);
        i += 1;
      }
      groups.push({ kind: "bulleted_list", blocks: listBlocks });
      continue;
    }

    if (block.type === "numbered_list_item") {
      const listBlocks: BlogBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        listBlocks.push(blocks[i]);
        i += 1;
      }
      groups.push({ kind: "numbered_list", blocks: listBlocks });
      continue;
    }

    groups.push({ kind: "single", block });
    i += 1;
  }

  return groups;
}

function ListItemContent({ block }: { block: BlogBlock }) {
  const richText =
    block.type === "bulleted_list_item"
      ? block.bulleted_list_item.rich_text
      : block.type === "numbered_list_item"
        ? block.numbered_list_item.rich_text
        : [];

  return (
    <>
      <RichText richText={richText} />
      {block.children?.length ? (
        <div className="mt-2">
          <NotionBlocks blocks={block.children} />
        </div>
      ) : null}
    </>
  );
}

function BlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "paragraph":
      if (!block.paragraph.rich_text.length) {
        return <div className="h-3" aria-hidden />;
      }
      return (
        <p className="mt-4 text-[17px] leading-[1.7] text-ink-2">
          <RichText richText={block.paragraph.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h2
          id={headingAnchorId(block)}
          className="mt-12 mb-4 scroll-mt-28 text-2xl font-semibold tracking-tight text-ink first:mt-0"
        >
          <RichText richText={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h2
          id={headingAnchorId(block)}
          className="mt-12 mb-4 scroll-mt-28 text-2xl font-semibold tracking-tight text-ink first:mt-0"
        >
          <RichText richText={block.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3
          id={headingAnchorId(block)}
          className="mt-8 mb-3 scroll-mt-28 text-xl font-semibold tracking-tight text-ink first:mt-0"
        >
          <RichText richText={block.heading_3.rich_text} />
        </h3>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-brand pl-5 text-[17px] leading-[1.7] text-ink-2 italic">
          <RichText richText={block.quote.rich_text} />
        </blockquote>
      );
    case "callout":
      return (
        <aside className="card-soft mt-6 px-5 py-4 text-[16px] leading-[1.65] text-ink-2">
          <RichText richText={block.callout.rich_text} />
        </aside>
      );
    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-2xl bg-ink px-5 py-4 font-mono text-[13px] leading-[1.6] text-white/88">
          <code>{plainText(block.code.rich_text)}</code>
        </pre>
      );
    case "divider":
      return <hr className="my-8 border-line" />;
    case "image": {
      const url = getFileUrl(block);
      if (!url) return null;
      const caption = getCaption(block);
      return (
        <figure className="mt-8 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={url}
            src={url}
            alt={caption || ""}
            className="w-full rounded-2xl"
          />
          {caption ? (
            <figcaption className="text-sm text-ink-muted">{caption}</figcaption>
          ) : null}
        </figure>
      );
    }
    case "bookmark":
    case "embed":
    case "link_preview": {
      const url =
        block.type === "bookmark"
          ? block.bookmark.url
          : block.type === "embed"
            ? block.embed.url
            : block.link_preview.url;
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 block truncate rounded-xl border border-line px-4 py-3 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          {url}
        </a>
      );
    }
    case "to_do":
      return (
        <label className="mt-3 flex items-start gap-3 text-[17px] leading-[1.7] text-ink-2">
          <input
            type="checkbox"
            checked={block.to_do.checked}
            readOnly
            className="mt-1.5"
          />
          <span>
            <RichText richText={block.to_do.rich_text} />
          </span>
        </label>
      );
    case "toggle":
      return (
        <details className="card-soft mt-6 px-4 py-3">
          <summary className="cursor-pointer text-[16px] font-medium text-ink">
            <RichText richText={block.toggle.rich_text} />
          </summary>
          {block.children?.length ? (
            <div className="mt-3 border-t border-line pt-3">
              <NotionBlocks blocks={block.children} />
            </div>
          ) : null}
        </details>
      );
    case "video": {
      const url = getFileUrl(block);
      if (!url) return null;
      return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line">
          <video src={url} controls className="w-full" />
        </div>
      );
    }
    default:
      return null;
  }
}

type NotionBlocksProps = {
  blocks: BlogBlock[];
};

export function NotionBlocks({ blocks }: NotionBlocksProps) {
  const groups = groupBlocks(blocks);

  return (
    <div>
      {groups.map((group, index) => {
        if (group.kind === "bulleted_list") {
          return (
            <ul
              key={`ul-${index}`}
              className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-2"
            >
              {group.blocks.map((block) => (
                <li key={block.id}>
                  <ListItemContent block={block} />
                </li>
              ))}
            </ul>
          );
        }

        if (group.kind === "numbered_list") {
          return (
            <ol
              key={`ol-${index}`}
              className="mt-4 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-2"
            >
              {group.blocks.map((block) => (
                <li key={block.id}>
                  <ListItemContent block={block} />
                </li>
              ))}
            </ol>
          );
        }

        return <BlockView key={group.block.id} block={group.block} />;
      })}
    </div>
  );
}

export function faqQuestionText(item: FaqItem) {
  return blockPlainText(item.question).trim();
}

export function faqHeadingText(heading: BlogBlock | null) {
  if (!heading) return "FAQ";
  return blockPlainText(heading).trim() || "FAQ";
}
