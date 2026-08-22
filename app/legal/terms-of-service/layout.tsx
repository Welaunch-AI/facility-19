import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { TermsBodyUnlock } from "./terms-body-unlock";

const title = "Terms of Service";
const description =
  "Terms of Service and End-User License Agreement for the WeLaunch platform.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/legal/terms-of-service" },
  openGraph: {
    ...defaultOpenGraph,
    title: `${title} | WeLaunch`,
    description,
    url: "/legal/terms-of-service",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | WeLaunch`,
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const termsJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/legal/terms-of-service",
});

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={termsJsonLd} />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.add('terms-page');document.body.classList.add('terms-page');",
        }}
      />
      <TermsBodyUnlock />
      {children}
    </>
  );
}
