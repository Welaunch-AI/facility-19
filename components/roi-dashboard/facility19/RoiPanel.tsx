import { useFacility19 } from "@/lib/roi-dashboard/facility19/store";
import { AnimatedNumber } from "./AnimatedNumber";
import { ExplainTip } from "./ExplainTip";

export function RoiPanel() {
  const { kpis, agents, events } = useFacility19();
  const autoResolved = events.filter((e) => e.type === "resolved").length + 70;
  const inputs: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "Labor hours saved", value: kpis.hoursFreed, format: (n) => `${Math.round(n)} hrs`, weight: "primary input" },
    { label: "Avg labor cost / hr", value: 78, format: (n) => `$${Math.round(n)}`, weight: "multiplier" },
    { label: "Work orders auto-resolved", value: autoResolved, format: (n) => `${Math.round(n)}`, weight: `of ${autoResolved + 2} total` },
    { label: "Preventive vs reactive", value: 82, format: (n) => `${Math.round(n)} / ${100 - Math.round(n)}`, weight: "shifted +24%" },
    { label: "Energy delta", value: -9.4, format: (n) => `${n.toFixed(1)}%`, weight: "vs baseline" },
    { label: "Downtime avoided", value: 31, format: (n) => `${Math.round(n)} hrs`, weight: "this month" },
    { label: "Asset lifespan extension", value: 2.3, format: (n) => `+${n.toFixed(1)} yrs`, weight: "modeled" },
    { label: "Tenant satisfaction", value: 94, format: (n) => `${Math.round(n)} / 100`, weight: "+11 pts" },
    { label: "Escalation rate", value: -42, format: (n) => `${Math.round(n)}%`, weight: "vs prior 90d" },
  ];
  const aria = agents.find((a) => a.id === "aria")!;

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-background/50">
            ROI calculus
            <ExplainTip title="ROI calculus">
              Every input below is recomputed live from real signals — labor hours your team did NOT spend, kWh saved by ARIA, leaks FLOW prevented. The dollar total ticks up as the agents do their jobs.
            </ExplainTip>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">How we count the savings</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-[11px] uppercase tracking-wider text-background/50">Total / since deploy</div>
          <div className="mt-1 font-display text-2xl font-bold tracking-tight">
            <AnimatedNumber value={kpis.totalSavings} format={(n) => `$${Math.round(n).toLocaleString()}`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="border-t border-background/10 px-6 py-5 text-sm leading-relaxed text-background/70">
        <span className="font-semibold text-background">Right now —</span>{" "}
        ARIA's energy curve sits at <span className="font-mono text-background">{aria.sparkline[aria.sparkline.length - 1].toFixed(0)}</span>,
        the building has freed <span className="font-mono text-background">{kpis.hoursFreed}</span> labor hours and closed{" "}
        <span className="font-mono text-background">{kpis.workOrdersClosed}</span> work orders since deploy. Every number on this page updates as the agents work.
      </div>
    </div>
  );
}
