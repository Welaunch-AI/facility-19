import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { FacilityWordmark } from "@/components/facility-wordmark";
import { GlowCard } from "@/components/ui/spotlight-card";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="app-shell-eyebrow">
      <span className="app-shell-eyebrow-dot" />
      {children}
    </span>
  );
}

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`app-shell-step-dot ${i + 1 < current ? "done" : ""} ${i + 1 === current ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

export function AppHeader({
  title,
  subtitle,
  subtitleAlign = "left",
  backHref,
  headerAction,
}: {
  title: string;
  subtitle?: string;
  subtitleAlign?: "left" | "right";
  backHref?: string;
  headerAction?: { href: string; label: string };
}) {
  const subtitleEl = subtitle ? (
    <p className="text-[15px] text-[#5E6472]">{subtitle}</p>
  ) : null;

  return (
    <header className="border-b border-[#E5E4DE] bg-[#F3F3EF]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-flex hover:opacity-70"
              aria-label="Facility19"
            >
              <FacilityWordmark />
            </Link>
            <h1 className="mt-4 text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.03em]">
              {title}
            </h1>
            {subtitleAlign === "left" ? (
              <div className="mt-2">{subtitleEl}</div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            {headerAction ? (
              <Link
                href={headerAction.href}
                className="app-shell-btn app-shell-btn-ghost h-10 px-4 text-[14px]"
              >
                {headerAction.label}
              </Link>
            ) : null}
            {backHref ? (
              <Link
                href={backHref}
                className="text-[14px] text-[#5E6472] hover:text-[#0A0A0B]"
              >
                Back
              </Link>
            ) : null}
            {subtitleAlign === "right" ? (
              <div className={backHref ? "" : "mt-4"}>{subtitleEl}</div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`app-shell-btn app-shell-btn-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function BrandButton({
  children,
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`app-shell-btn app-shell-btn-brand ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`app-shell-btn app-shell-btn-ghost ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type ShellCardProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & Record<string, unknown>;

export function ShellCard({
  children,
  className = "",
  as = "div",
  ...props
}: ShellCardProps) {
  return (
    <GlowCard as={as} className={`app-shell-card ${className}`.trim()} {...props}>
      {children}
    </GlowCard>
  );
}
