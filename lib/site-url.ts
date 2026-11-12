const DEFAULT_SITE_URL = "https://www.facility19.com";

function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

// OAuth/magic-link redirects must always land back on the canonical domain,
// never on stale preview/legacy hosts a user might still have bookmarked.
// Set NEXT_PUBLIC_SITE_URL in production; falls back to the current origin
// so local dev keeps redirecting to localhost.
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}

export function getServerSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
  }

  return DEFAULT_SITE_URL;
}
