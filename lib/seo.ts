import { getServerSiteUrl } from "@/lib/site-url";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";
import { WELAUNCH_WORDMARK_BLACK } from "@/lib/welaunch-brand";

export const SITE_NAME = "WeLaunch";
export const SITE_LEGAL_NAME = "ARB Global LLC";
export const SITE_PARENT_ORG = "WeLaunch Inc.";
export const SITE_TAGLINE = "AI employees for facility management";

export const SITE_DESCRIPTION =
  "WeLaunch deploys AI agents for dispatch, scheduling, compliance, vendor management, and field operations. Live at RAEL Fire Safety and ProForce Pest Control. Integrates with your existing CMMS, GPS, and work order stack.";

export const SITE_DEFINITION =
  "WeLaunch is an AI operating system for facility management and field service operations. The platform deploys AI agents that handle dispatch, scheduling, compliance, vendor management, inventory, and customer communications around the clock. WeLaunch integrates with existing tech stacks—work order systems, CMMS platforms, GPS, accounting, and telephony—rather than replacing them. Live deployments include RAEL Fire Safety (40 field technicians with GPS-verified job site visibility) and ProForce Pest Control. Operators typically go live in under five weeks from contract signing. Each AI agent runs a specific process such as dispatch coordination, after-hours intake, procurement, or documentation.";

export const OG_IMAGE_PATH = "/og-image.png";
export const SITE_LOGO_PATH = WELAUNCH_WORDMARK_BLACK;

export const SITE_SAME_AS = [CAL_DEMO_URL] as const;

export const SITE_CONTACT = {
  url: "https://www.welaunch.ai",
  email: "Support@welaunch.ai",
} as const;

type JsonLd = Record<string, unknown>;

export function absoluteUrl(path = "") {
  const base = getServerSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(): JsonLd {
  const url = absoluteUrl();
  return {
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url,
    logo: absoluteUrl(SITE_LOGO_PATH),
    description: SITE_DEFINITION,
    foundingDate: "2024",
    areaServed: "US",
    knowsAbout: [
      "facility management",
      "field service operations",
      "AI agents",
      "dispatch automation",
      "CMMS integration",
      "pest control operations",
      "fire safety services",
    ],
    sameAs: [...SITE_SAME_AS],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE_CONTACT.email,
      url: CAL_DEMO_URL,
      availableLanguage: "English",
    },
  };
}

export function webSiteJsonLd(): JsonLd {
  const url = absoluteUrl();
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${url}/#organization` },
    inLanguage: "en-US",
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  const url = absoluteUrl();
  return {
    "@type": "SoftwareApplication",
    "@id": `${url}/#software`,
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Facility Management Software",
    operatingSystem: "Web",
    url,
    description: SITE_DEFINITION,
    featureList: [
      "AI dispatch and scheduling",
      "After-hours intake and triage",
      "Vendor procurement and PO management",
      "Compliance and documentation",
      "CMMS and GPS integration",
      "24/7 field operations coverage",
    ],
    provider: { "@id": `${url}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Contact for enterprise pricing",
      url: CAL_DEMO_URL,
    },
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  const url = absoluteUrl(path);
  const siteUrl = absoluteUrl();
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  const url = absoluteUrl(path);
  const siteUrl = absoluteUrl();
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: "US",
    serviceType: name,
  };
}

export function buildJsonLdGraph(...nodes: JsonLd[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function siteJsonLdGraph() {
  return buildJsonLdGraph(
    organizationJsonLd(),
    webSiteJsonLd(),
    softwareApplicationJsonLd(),
  );
}

export function pageJsonLdGraph(
  page: { name: string; description: string; path: string },
  extra: JsonLd[] = [],
) {
  return buildJsonLdGraph(
    organizationJsonLd(),
    webSiteJsonLd(),
    webPageJsonLd(page),
    ...extra,
  );
}

export const defaultOpenGraph = {
  siteName: SITE_NAME,
  type: "website" as const,
  locale: "en_US",
  images: [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
    },
  ],
};
