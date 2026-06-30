import type { Metadata, Viewport } from "next";
import fs from "node:fs";
import path from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  title: "Facility19, AI employees for facility management",
  description:
    "Facility19, AI employees for facility management. Enterprise-grade automation for your operations.",
  icons: {
    icon: "/favicon.png",
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
    >
      <body className="min-h-full facility-shell">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1020950010475993&ev=PageView&noscript=1"
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
