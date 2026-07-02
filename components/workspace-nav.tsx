"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JourneyStage } from "@/lib/workspaces";

type WorkspaceNavProps = {
  workspaceId: string;
  showPdf?: boolean;
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

export function WorkspaceNav({ workspaceId, showPdf = true }: WorkspaceNavProps) {
  const pathname = usePathname();
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
    const res = await fetch(`/api/workspaces/${workspaceId}/roadmap/pdf`);
    if (!res.ok) return;

    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="([^"]+)"/);
    const filename = match?.[1] ?? "vision-roadmap.pdf";

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
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
            className="app-shell-nav-action"
          >
            Download PDF
          </button>
        ) : null}
      </div>
    </nav>
  );
}
