"use client";

import { useEffect } from "react";

const HEAD_SCRIPTS = [
  { id: "zoominfo-embed", src: "/analytics/zoominfo.js" },
  { id: "reb2b-embed", src: "/analytics/reb2b.js" },
] as const;

const BODY_SCRIPTS = [
  { id: "meta-pixel", src: "/analytics/meta-pixel.js", defer: true },
] as const;

function injectScript(
  parent: HTMLElement,
  { id, src, defer }: { id: string; src: string; defer?: boolean },
) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  if (defer) script.defer = true;
  parent.appendChild(script);
}

export function AnalyticsScripts() {
  useEffect(() => {
    for (const entry of HEAD_SCRIPTS) {
      injectScript(document.head, entry);
    }
    for (const entry of BODY_SCRIPTS) {
      injectScript(document.body, entry);
    }
  }, []);

  return null;
}
