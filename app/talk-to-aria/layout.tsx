import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { defaultOpenGraph, pageJsonLdGraph } from "@/lib/seo";
import { TalkBodyUnlock } from "./talk-body-unlock";

const title = "Talk to Aria — Voice Conversation";
const description =
  "Talk to Aria: real-time voice conversation with WeLaunch's AI guide. Learn how AI agents handle dispatch, scheduling, and field operations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/talk-to-aria" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Talk to Aria | WeLaunch",
    description,
    url: "/talk-to-aria",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talk to Aria | WeLaunch",
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const talkJsonLd = pageJsonLdGraph({
  name: title,
  description,
  path: "/talk-to-aria",
});

export default function TalkToAriaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={talkJsonLd} />
      <TalkBodyUnlock />
      {/* Fraunces serif display font for Aria console */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
