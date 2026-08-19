import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import {
  defaultOpenGraph,
  pageJsonLdGraph,
  serviceJsonLd,
} from "@/lib/seo";
import { PartnersBodyUnlock } from "./partners-body-unlock";
import "./partners.css";

const title = "Partner Program — Get paid for introductions";
const description =
  "Earn 25% of month one and 10% residual for a year. Introduce FM and home service operators to WeLaunch. No selling. Just introductions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/partners" },
  openGraph: {
    ...defaultOpenGraph,
    title: "WeLaunch Partner Program",
    description:
      "If you know facility management or home services, your network is worth something. Apply to partner.",
    url: "/partners",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeLaunch Partner Program",
    description,
    images: [defaultOpenGraph.images[0].url],
  },
};

const partnersJsonLd = pageJsonLdGraph(
  { name: title, description, path: "/partners" },
  [
    serviceJsonLd({
      name: "WeLaunch Partner Program",
      description,
      path: "/partners",
    }),
  ],
);

export default function PartnersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={partnersJsonLd} />
      <PartnersBodyUnlock />
      {children}
    </>
  );
}
