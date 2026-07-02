import type { ReactNode } from "react";
import { AnimatedNumber } from "./AnimatedNumber";
import { ExplainTip } from "./ExplainTip";

type Props = {
  label: string;
  value: number;
  format?: (n: number) => string;
  sub?: string;
  accent?: "default" | "primary" | "dark";
  icon?: ReactNode;
  explain?: ReactNode;
  onClick?: () => void;
};

export function StatCard({ label, value, format, sub, accent = "default", icon, explain, onClick }: Props) {
  const styles =
    accent === "dark"
      ? "bg-foreground text-background border-foreground"
      : accent === "primary"
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-foreground border-border";

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${onClick ? "cursor-pointer hover:shadow-lg" : ""} ${styles}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-60">
          {label}
          {explain ? <ExplainTip title={label}>{explain}</ExplainTip> : null}
        </span>
        {icon ? <span className="opacity-50">{icon}</span> : null}
      </div>
      <div className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
        <AnimatedNumber value={value} format={format} />
      </div>
      {sub ? <div className="mt-1 text-xs opacity-60 font-mono">{sub}</div> : null}
    </Wrapper>
  );
}
