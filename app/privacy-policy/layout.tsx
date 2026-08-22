import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { PrivacyBodyUnlock } from "./privacy-body-unlock";

const title = "Privacy Policy";
const description =
  "How WeLaunch (WeLaunch Inc.) collects, uses, and protects your information.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    ...defaultOpenGraph,
    title: `${title} | WeLaunch`,
    description,
    url: "/privacy-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | WeLaunch`,
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const privacyJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/privacy-policy",
});

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={privacyJsonLd} />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.add('privacy-page');document.body.classList.add('privacy-page');",
        }}
      />
      <PrivacyBodyUnlock />
      {children}
    </>
  );
}
