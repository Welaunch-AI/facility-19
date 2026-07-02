import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/roi-dashboard/ui/popover";
import { useExplainMode } from "@/lib/roi-dashboard/explain-mode";
import type { ReactNode } from "react";

type Props = { title: string; children: ReactNode; className?: string };

export function ExplainTip({ title, children, className }: Props) {
  const explainMode = useExplainMode();
  if (!explainMode) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-colors hover:bg-primary/20 ${className ?? ""}`}
          aria-label={`Explain ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-72 text-xs leading-relaxed">
        <div className="font-display text-sm font-bold tracking-tight">{title}</div>
        <div className="mt-1.5 text-muted-foreground">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
