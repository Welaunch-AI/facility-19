import type { BlogBlock, BlogPostMeta } from "@/lib/notion";

export function formatBlogDate(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function postCategory(post: Pick<BlogPostMeta, "tags">) {
  return post.tags[0] ?? "Insights";
}

function blockPlainText(block: BlogBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text.map((item) => item.plain_text).join("");
    case "heading_1":
      return block.heading_1.rich_text.map((item) => item.plain_text).join("");
    case "heading_2":
      return block.heading_2.rich_text.map((item) => item.plain_text).join("");
    case "heading_3":
      return block.heading_3.rich_text.map((item) => item.plain_text).join("");
    case "quote":
      return block.quote.rich_text.map((item) => item.plain_text).join("");
    case "callout":
      return block.callout.rich_text.map((item) => item.plain_text).join("");
    case "toggle":
      return block.toggle.rich_text.map((item) => item.plain_text).join("");
    case "bulleted_list_item":
      return block.bulleted_list_item.rich_text
        .map((item) => item.plain_text)
        .join("");
    case "numbered_list_item":
      return block.numbered_list_item.rich_text
        .map((item) => item.plain_text)
        .join("");
    case "to_do":
      return block.to_do.rich_text.map((item) => item.plain_text).join("");
    case "code":
      return block.code.rich_text.map((item) => item.plain_text).join("");
    default:
      return "";
  }
}

export function readingTimeFromBlocks(blocks: BlogBlock[]) {
  const words = blocks
    .flatMap((block) => [block, ...(block.children ?? [])])
    .map((block) => blockPlainText(block))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
