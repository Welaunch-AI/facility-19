import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/json-ld";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  defaultOpenGraph,
  siteJsonLdGraph,
} from "@/lib/seo";
import "./globals.css";

const GTM_ID = "GTM-TJF5GCZ4";

const zoominfoEmbed = fs
  .readFileSync(
    path.join(process.cwd(), "scripts", "zoominfo-embed.txt"),
    "utf8",
  )
  .trim();

const reb2bEmbed = fs
  .readFileSync(
    path.join(process.cwd(), "scripts", "reb2b-embed.txt"),
    "utf8",
  )
  .trim();

const metaPixelEmbed = fs
  .readFileSync(
    path.join(process.cwd(), "scripts", "meta-pixel-embed.txt"),
    "utf8",
  )
  .trim();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: `${SITE_NAME}, ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    ...defaultOpenGraph,
    title: `${SITE_NAME}, ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}, ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [defaultOpenGraph.images[0].url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`facility-html ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="gtm-head" strategy="beforeInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
      </head>
      <body className="min-h-full facility-shell" suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <JsonLd data={siteJsonLdGraph()} />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1079999468317439&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Script id="zoominfo-embed" strategy="beforeInteractive">
          {zoominfoEmbed}
        </Script>
        <Script id="reb2b-embed" strategy="beforeInteractive">
          {reb2bEmbed}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {metaPixelEmbed}
        </Script>
        {children}
      </body>
    </html>
  );
}
