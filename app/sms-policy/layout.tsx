import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { SmsBodyUnlock } from "./sms-body-unlock";

const title = "SMS Policy";
const description =
  "SMS Policy explaining how WeLaunch uses text messaging, consent, opt out, and compliance for SMS and MMS communications.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sms-policy" },
  openGraph: {
    ...defaultOpenGraph,
    title: `${title} | WeLaunch`,
    description,
    url: "/sms-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | WeLaunch`,
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const smsJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/sms-policy",
});

export default function SmsPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={smsJsonLd} />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.add('sms-page');document.body.classList.add('sms-page');",
        }}
      />
      <SmsBodyUnlock />
      {children}
    </>
  );
}
