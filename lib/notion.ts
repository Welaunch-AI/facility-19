import {
  Client,
  collectPaginatedAPI,
  isFullBlock,
  isFullDatabase,
  isFullPage,
  type BlockObjectResponse,
  type PageObjectResponse,
  type RichTextItemResponse,
} from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

/** Must stay a numeric literal in `export const revalidate` on blog routes. */
export const BLOG_REVALIDATE_SECONDS = 60;
export const BLOG_CACHE_TAG = "blog";

export type BlogPostMeta = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string | null;
  tags: string[];
  coverUrl: string | null;
};

export type BlogBlock = BlockObjectResponse & {
  children?: BlogBlock[];
};

export type BlogPost = BlogPostMeta & {
  blocks: BlogBlock[];
};

let cachedDataSourceId: string | null = null;
let cachedClient: Client | null = null;

function getEnv() {
  const token = process.env.NOTION_TOKEN?.trim();
  const databaseId = process.env.NOTION_DATABASE_ID?.trim();
  return { token, databaseId };
}

export function isNotionConfigured() {
  const { token, databaseId } = getEnv();
  return Boolean(token && databaseId);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNetworkError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const cause =
    "cause" in error && error.cause instanceof Error
      ? error.cause
      : error;
  const code =
    "code" in cause && typeof cause.code === "string" ? cause.code : "";

  return (
    error.name === "AbortError" ||
    error.message.includes("fetch failed") ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_SOCKET"
  );
}

/** Notion's SDK only retries HTTP 429/5xx, not TCP timeouts from `fetch`. */
async function fetchWithRetry(url: string, init?: RequestInit) {
  const maxAttempts = 4;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts - 1 || !isRetryableNetworkError(error)) {
        throw error;
      }
      await sleep(750 * 2 ** attempt);
    }
  }

  throw lastError;
}

function getClient() {
  const { token } = getEnv();
  if (!token) {
    throw new Error("NOTION_TOKEN is not set");
  }
  if (!cachedClient) {
    cachedClient = new Client({
      auth: token,
      timeoutMs: 60_000,
      fetch: fetchWithRetry,
      retry: { maxRetries: 4, initialRetryDelayMs: 1000 },
    });
  }
  return cachedClient;
}

async function getDataSourceId(notion: Client) {
  if (cachedDataSourceId) return cachedDataSourceId;

  const { databaseId } = getEnv();
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  const database = await notion.databases.retrieve({ database_id: databaseId });
  if (!isFullDatabase(database) || !database.data_sources[0]?.id) {
    throw new Error("No data source found on Notion database");
  }

  const dataSourceId = database.data_sources[0].id;

  cachedDataSourceId = dataSourceId;
  return dataSourceId;
}

function plainText(richText: RichTextItemResponse[] | undefined) {
  if (!richText?.length) return "";
  return richText.map((item) => item.plain_text).join("");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProperty(page: PageObjectResponse, names: string[]) {
  for (const name of names) {
    const property = page.properties[name];
    if (property) return property;
  }
  return undefined;
}

function getTitle(page: PageObjectResponse) {
  const property = getProperty(page, ["Name", "Title", "title"]);
  if (property?.type === "title") {
    return plainText(property.title);
  }

  for (const value of Object.values(page.properties)) {
    if (value.type === "title") {
      return plainText(value.title);
    }
  }

  return "Untitled";
}

function getSlug(page: PageObjectResponse, title: string) {
  const property = getProperty(page, ["Slug", "slug"]);

  if (property?.type === "rich_text") {
    const value = plainText(property.rich_text).trim();
    if (value) return slugify(value);
  }

  if (property?.type === "url" && property.url) {
    return slugify(property.url);
  }

  if (property?.type === "formula" && property.formula.type === "string" && property.formula.string) {
    return slugify(property.formula.string);
  }

  return slugify(title);
}

function getDescription(page: PageObjectResponse) {
  const property = getProperty(page, ["Description", "description", "Summary", "summary"]);
  if (property?.type === "rich_text") {
    return plainText(property.rich_text).trim();
  }
  return "";
}

function getDate(page: PageObjectResponse) {
  const property = getProperty(page, ["Date", "date", "Published", "Published Date"]);
  if (property?.type === "date") {
    return property.date?.start ?? null;
  }
  return page.created_time.slice(0, 10);
}

function getTags(page: PageObjectResponse) {
  const tags: string[] = [];

  for (const name of ["Tags", "tags", "Track", "Vertical"]) {
    const property = getProperty(page, [name]);
    if (property?.type === "multi_select") {
      tags.push(...property.multi_select.map((tag) => tag.name));
    } else if (property?.type === "select" && property.select?.name) {
      tags.push(property.select.name);
    }
  }

  return [...new Set(tags)];
}

const PUBLISHED_STATUS_NAMES = new Set(["Published", "Publish", "published", "publish"]);

function getStatusName(page: PageObjectResponse) {
  const property = getProperty(page, ["Status", "status"]);
  if (property?.type === "status") return property.status?.name ?? null;
  if (property?.type === "select") return property.select?.name ?? null;
  return null;
}

function filePropertyUrl(page: PageObjectResponse) {
  for (const name of ["Files & media", "Cover", "cover", "Image", "image", "Thumbnail", "thumbnail"]) {
    const property = getProperty(page, [name]);
    if (property?.type !== "files" || !property.files.length) continue;

    const file = property.files[0];
    if (file.type === "external") return file.external.url;
    if (file.type === "file") return file.file.url;
  }
  return null;
}

function getCoverUrl(page: PageObjectResponse) {
  if (page.cover?.type === "external") return page.cover.external.url;
  if (page.cover?.type === "file") return page.cover.file.url;

  // Covers are often stored as a files property (e.g. "Files & media") rather than page cover
  return filePropertyUrl(page);
}

/** Stable cover URL that never expires — proxied through /api/notion-asset. */
export function getCoverProxyUrl(pageId: string) {
  return `/api/notion-asset?pageId=${encodeURIComponent(pageId)}`;
}

/** Stable block file URL that never expires — proxied through /api/notion-asset. */
export function getBlockProxyUrl(blockId: string) {
  return `/api/notion-asset?blockId=${encodeURIComponent(blockId)}`;
}

const NOTION_ID_RE = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

export function isNotionId(value: string) {
  return NOTION_ID_RE.test(value);
}

export async function resolveNotionCoverUrl(pageId: string): Promise<string | null> {
  if (!isNotionConfigured() || !isNotionId(pageId)) return null;

  const notion = getClient();
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) return null;
  return getCoverUrl(page);
}

export async function resolveNotionBlockFileUrl(blockId: string): Promise<string | null> {
  if (!isNotionConfigured() || !isNotionId(blockId)) return null;

  const notion = getClient();
  const block = await notion.blocks.retrieve({ block_id: blockId });
  if (!isFullBlock(block)) return null;

  if (block.type === "image") {
    if (block.image.type === "external") return block.image.external.url;
    if (block.image.type === "file") return block.image.file.url;
  }

  if (block.type === "video") {
    if (block.video.type === "external") return block.video.external.url;
    if (block.video.type === "file") return block.video.file.url;
  }

  if (block.type === "file") {
    if (block.file.type === "external") return block.file.external.url;
    if (block.file.type === "file") return block.file.file.url;
  }

  if (block.type === "pdf") {
    if (block.pdf.type === "external") return block.pdf.external.url;
    if (block.pdf.type === "file") return block.pdf.file.url;
  }

  return null;
}

function mapPageToMeta(page: PageObjectResponse): BlogPostMeta {
  const title = getTitle(page);
  const hasCover = Boolean(getCoverUrl(page));
  return {
    id: page.id,
    title,
    slug: getSlug(page, title),
    description: getDescription(page),
    date: getDate(page),
    tags: getTags(page),
    // Use a stable proxy path so soft navigations never hit expired Notion signed URLs
    coverUrl: hasCover ? getCoverProxyUrl(page.id) : null,
  };
}

async function queryPublishedPages() {
  const notion = getClient();
  const dataSourceId = await getDataSourceId(notion);

  // Fetch all rows, then filter client-side so "Publish" / "Published" both work
  // and missing Date sorts don't break the query.
  const rows = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
  });

  return rows
    .filter(isFullPage)
    .filter(isPublishedPage)
    .map(mapPageToMeta)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

function isPublishedPage(page: PageObjectResponse) {
  const statusName = getStatusName(page);
  if (statusName) {
    return PUBLISHED_STATUS_NAMES.has(statusName);
  }

  const published = getProperty(page, ["Published"]);
  if (published?.type === "checkbox") {
    return published.checkbox;
  }

  // If neither property exists, treat as published so drafts don't block setup mistakes
  return true;
}

const loadPublishedPosts = unstable_cache(
  async () => queryPublishedPages(),
  ["notion-published-posts"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] },
);

export const getPublishedPosts = cache(async (): Promise<BlogPostMeta[]> => {
  if (!isNotionConfigured()) return [];
  return loadPublishedPosts();
});

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug);
}

async function queryPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadPublishedPosts();
  const meta = posts.find((post) => post.slug === slug);
  if (!meta) return null;

  const notion = getClient();
  const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
    block_id: meta.id,
  });

  const fullBlocks = blocks.filter(isFullBlock);

  // Resolve one level of nested children for lists/toggles
  const withChildren: BlogBlock[] = [];
  for (const block of fullBlocks) {
    if (block.has_children && shouldExpandChildren(block.type)) {
      const children = await collectPaginatedAPI(notion.blocks.children.list, {
        block_id: block.id,
      });
      withChildren.push({
        ...block,
        children: children.filter(isFullBlock),
      });
    } else {
      withChildren.push(block);
    }
  }

  return { ...meta, blocks: withChildren };
}

const loadPostBySlug = unstable_cache(
  async (slug: string) => queryPostBySlug(slug),
  ["notion-post-by-slug"],
  { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] },
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!isNotionConfigured()) return null;
  return loadPostBySlug(slug);
});

function shouldExpandChildren(type: BlockObjectResponse["type"]) {
  return (
    type === "bulleted_list_item" ||
    type === "numbered_list_item" ||
    type === "to_do" ||
    type === "toggle" ||
    type === "quote" ||
    type === "callout"
  );
}

export type { BlockObjectResponse, RichTextItemResponse };
