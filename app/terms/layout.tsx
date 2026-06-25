import type { Metadata } from "next";
import { TermsBodyUnlock } from "./terms-body-unlock";

export const metadata: Metadata = {
  title: "Terms of Service | Facility19",
  description:
    "Terms of Service and End-User License Agreement for the Facility 19 platform.",
  openGraph: {
    title: "Terms of Service | Facility19",
    description:
      "Terms of Service and End-User License Agreement for the Facility 19 platform.",
  },
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
