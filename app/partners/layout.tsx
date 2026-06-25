import type { Metadata } from "next";
import { PartnersBodyUnlock } from "./partners-body-unlock";
import "./partners.css";

export const metadata: Metadata = {
  title: "facility 19 Partners - Get paid for the introductions you already make",
  description:
    "Earn 25% of month one and 10% residual for a year. Introduce FM and home service operators to Facility19. No selling. Just introductions.",
  openGraph: {
    title: "facility 19 Partner Program",
    description:
      "If you know facility management or home services, your network is worth something. Apply to partner.",
  },
};

export default function PartnersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PartnersBodyUnlock />
      {children}
    </>
  );
}
