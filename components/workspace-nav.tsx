"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { downloadRoadmapPdf } from "@/lib/download-roadmap-pdf";
import type { JourneyStage } from "@/lib/workspaces";

type WorkspaceNavProps = {
  workspaceId: string;
  showPdf?: boolean;
  onPdfError?: (message: string | null) => void;
};

const NAV_LINKS = (base: string) =>
  [
    { href: base, label: "Agent package" },
    { href: `${base}/roadmap`, label: "Vision roadmap" },
    {
      href: `${base}/dashboard`,
      label: "ROI dashboard",
      stage: "dashboard" as const,
    },
  ] as const;

function isNavActive(pathname: string, href: string, base: string) {
  if (href === base) return pathname === base;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navClassName(active: boolean) {
  return `app-shell-nav-pill ${active ? "is-active" : "text-[#5E6472]"}`;
}

export function WorkspaceNav({
  workspaceId,
  showPdf = true,
  onPdfError,
}: WorkspaceNavProps) {
  const pathname = usePathname();
  const [pdfLoading, setPdfLoading] = useState(false);
  const base = `/workspaces/${workspaceId}`;
  const links = NAV_LINKS(base);

  function markJourneyStage(stage: JourneyStage) {
    void fetch(`/api/workspaces/${workspaceId}/journey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }

  async function downloadPdf() {
    onPdfError?.(null);
    setPdfLoading(true);
    try {
      await downloadRoadmapPdf(workspaceId);
    } catch (err) {
      onPdfError?.(err instanceof Error ? err.message : "Could not download PDF.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <nav className="border-b border-[#E5E4DE] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-6 py-3 md:px-10">
        {links.map((link) => {
          const active = isNavActive(pathname, link.href, base);
          const className = navClassName(active);

          if ("stage" in link && link.stage) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markJourneyStage(link.stage)}
                className={className}
              >
                {link.label}
              </a>
            );
          }

          return (
            <Link key={link.href} href={link.href} className={className}>
              {link.label}
            </Link>
          );
        })}
        {showPdf ? (
          <button
            type="button"
            onClick={() => void downloadPdf()}
            disabled={pdfLoading}
            className="app-shell-nav-action"
          >
            {pdfLoading ? "Preparing PDF…" : "Download PDF"}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
