"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoiDashboard } from "@/lib/roi-dashboard/context";
import { Logo } from "./Logo";
import { LiveBadge } from "./LiveBadge";

const personas = [
  { id: "single", label: "Single Facility Director", short: "Single", segment: "", active: true },
  { id: "retail", label: "Multi-Site Retail Chain", short: "Retail", segment: "/multi-site", active: true },
  { id: "national", label: "National Provider", short: "National", segment: "/national", active: true },
  { id: "field", label: "Field Service Provider", short: "Field", segment: "/field", active: true },
] as const;

export function DashboardHeader() {
  const pathname = usePathname();
  const { basePath } = useRoiDashboard();

  const current =
    personas.find((p) => p.active && pathname === `${basePath}${p.segment}`) ??
    personas[0];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href={basePath}>
            <Logo />
          </Link>
          <span className="hidden h-5 w-px bg-border md:block" />
          <div className="hidden items-center gap-1 md:flex">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Persona /
            </span>
            <span className="ml-1 text-sm font-semibold tracking-tight">{current.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 lg:flex">
            {personas.map((p) => {
              const href = `${basePath}${p.segment}`;
              const isCurrent = pathname === href;
              const base =
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors";
              if (!p.active) {
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled
                    className={`${base} text-muted-foreground opacity-50`}
                  >
                    {p.short}
                  </button>
                );
              }
              return (
                <Link
                  key={p.id}
                  href={href}
                  className={`${base} ${isCurrent ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {p.short}
                </Link>
              );
            })}
          </div>
          <LiveBadge />
        </div>
      </div>
    </header>
  );
}
