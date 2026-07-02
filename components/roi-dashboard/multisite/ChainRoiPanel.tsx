import { useMultiSite } from "@/lib/roi-dashboard/multisite/store";
import { AnimatedNumber } from "@/components/roi-dashboard/facility19/AnimatedNumber";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

export function ChainRoiPanel() {
  const { kpis, sites } = useMultiSite();
  const reactiveRatio = 18; // %
  const inputs: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "Savings per site / mo", value: kpis.avgSavingsPerSite, format: (n) => `$${Math.round(n).toLocaleString()}`, weight: "primary input" },
    { label: "Sites on AI", value: kpis.sitesOnAi, format: (n) => `${Math.round(n)}`, weight: `of ${kpis.totalSites}` },
    { label: "Chain-wide labor avoided", value: kpis.avgSavingsPerSite * kpis.sitesOnAi * 0.42, format: (n) => `$${Math.round(n).toLocaleString()}`, weight: "× sites" },
    { label: "Centralized vs per-site staff", value: -38, format: (n) => `${n}%`, weight: "headcount delta" },
    { label: "Reactive vs preventive", value: reactiveRatio, format: (n) => `${n} / ${100 - n}`, weight: "shifted +31%" },
    { label: "Energy cost / sq ft", value: -kpis.energyReduction, format: (n) => `${n.toFixed(1)}%`, weight: "vs prior year" },
    { label: "CX score impact", value: 4.6, format: (n) => `${n.toFixed(1)} / 5`, weight: "+0.3 vs LY" },
    { label: "Same-store sales lift", value: 1.8, format: (n) => `+${n.toFixed(1)}%`, weight: "no-fault stores" },
    { label: "Compliance incidents", value: -64, format: (n) => `${n}%`, weight: "vs prior 90d" },
    { label: "Asset replacement deferral", value: 2.1, format: (n) => `+${n.toFixed(1)} yrs`, weight: "modeled" },
  ];

  const formula = `(${formatMoney(kpis.avgSavingsPerSite * 0.42)} labor + ${formatMoney(kpis.avgSavingsPerSite * 0.38)} energy + ${formatMoney(kpis.avgSavingsPerSite * 0.20)} repair-avoidance) × ${kpis.sitesOnAi} sites`;

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-background/50">
            ROI calculus · scales by site count
            <ExplainTip title="Portfolio ROI">
              ROI for a chain scales linearly with how many sites are on AI. Hard savings × sites + soft brand metrics (CX, same-store sales) = total portfolio impact.
            </ExplainTip>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">Portfolio savings, live</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-[11px] uppercase tracking-wider text-background/50">Total / since deploy</div>
          <div className="mt-1 font-display text-2xl font-bold tracking-tight">
            <AnimatedNumber value={kpis.portfolioSavings} format={(n) => `$${Math.round(n).toLocaleString()}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {inputs.map((i) => (
          <div key={i.label} className="bg-foreground p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-background/50">{i.label}</div>
            <div className="mt-2 font-display text-xl font-bold tracking-tight">
              <AnimatedNumber value={i.value} format={i.format} />
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-background/40">{i.weight}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-background/10 px-6 py-5 text-sm leading-relaxed text-background/70">
        <div>
          <span className="font-semibold text-background">Core formula —</span>{" "}
          <span className="font-mono text-xs text-background/80">{formula}</span>
        </div>
        <div>
          <span className="font-semibold text-background">Brand layer —</span>{" "}
          {sites.filter((s) => s.status === "ok").length} of {sites.length} stores running clean right now.
          Reduced customer-facing failures correlate with <span className="font-mono text-background">+1.8%</span> same-store sales on no-fault stores.
        </div>
      </div>
    </div>
  );
}

function formatMoney(n: number) { return `$${Math.round(n).toLocaleString()}`; }
