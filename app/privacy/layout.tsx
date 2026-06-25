import type { Metadata } from "next";
import { PrivacyBodyUnlock } from "./privacy-body-unlock";

export const metadata: Metadata = {
  title: "Privacy Policy | Facility19",
  description:
    "How Facility 19 (WeLaunch Inc.) collects, uses, and protects your information.",
  openGraph: {
    title: "Privacy Policy | Facility19",
    description:
      "How Facility 19 (WeLaunch Inc.) collects, uses, and protects your information.",
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
