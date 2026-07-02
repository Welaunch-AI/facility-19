import type { Metadata } from "next";
import "../app-shell.css";
import { StartRoutePrefetch } from "@/components/start-route-prefetch";
import { ROBOT_SCENE_URL, SPLINE_ORIGIN } from "@/lib/spline-sign-in";
import { StartBodyUnlock } from "./start-body-unlock";

export const metadata: Metadata = {
  title: "Sign in | Facility19",
  description:
    "Create your workspace or sign in to Facility 19 to start the multi-turn business interview.",
};

export default function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <link rel="preconnect" href={SPLINE_ORIGIN} crossOrigin="anonymous" />
      <link
        rel="preload"
        href={ROBOT_SCENE_URL}
        as="fetch"
        crossOrigin="anonymous"
      />
      <StartRoutePrefetch />
      <StartBodyUnlock />
      {children}
    </>
  );
}
