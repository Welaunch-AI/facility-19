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
        <Script id="zoominfo-embed" strategy="beforeInteractive">
          {zoominfoEmbed}
        </Script>
        <Script id="reb2b-embed" strategy="beforeInteractive">
          {reb2bEmbed}
        </Script>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M3SYHBZ20X"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M3SYHBZ20X');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xc6pea3fjg");
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
