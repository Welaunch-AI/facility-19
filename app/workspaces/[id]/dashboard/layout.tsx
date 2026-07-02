import type { ReactNode } from "react";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "../../../app-shell.css";
import "leaflet/dist/leaflet.css";
import { AppShellBodyUnlock } from "@/components/app-shell-body-unlock";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShellBodyUnlock />
      <div className={`${interTight.variable} ${jetbrainsMono.variable}`}>
        {children}
      </div>
    </>
  );
}
