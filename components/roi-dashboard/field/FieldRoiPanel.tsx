import { useField } from "@/lib/roi-dashboard/field/store";
import { AnimatedNumber } from "@/components/roi-dashboard/facility19/AnimatedNumber";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

export function FieldRoiPanel() {
  const { kpis, trucks, events } = useField();
  const upsellRev = events.filter((e) => e.type === "upsell").length * 3400 + 18_400;
  const invoiceTimeSaved = Math.round(kpis.jobsMonth * 14); // 14 min saved per invoice
  const callbackAvoided = Math.round(kpis.jobsMonth * (kpis.firstVisitFix - 76) / 100);
  const fleet = trucks.length;

  const revenueInputs: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "Revenue / truck / day", value: kpis.revenuePerTruckDay, format: money, weight: "↑ 22% vs last yr" },
    { label: "Jobs completed / mo",   value: kpis.jobsMonth, format: int,  weight: `across ${fleet} trucks` },
    { label: "Revenue per job (avg)", value: Math.round(kpis.revenueMonth / Math.max(kpis.jobsMonth, 1)), format: money, weight: "blended" },
    { label: "Drive time reduction",  value: -kpis.driveTimeReduction, format: pct, weight: "ROUTE optimization" },
    { label: "Tech idle time eliminated", value: 38, format: pct, weight: "vs paper schedule" },
  ];

  const qualityInputs: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "First-visit fix rate", value: kpis.firstVisitFix, format: pct1, weight: "↑ from 76%" },
    { label: "Callbacks avoided / mo", value: callbackAvoided, format: int, weight: "@ ~$220 each" },
    { label: "Customer rating",      value: kpis.customerRating, format: rating, weight: "last 90 days" },
    { label: "Repeat customer rate", value: 47, format: pct, weight: "↑ 13 pts" },
    { label: "Upsell revenue / mo",  value: upsellRev, format: money, weight: "TECH-flagged · 34% conv" },
    { label: "Invoice time saved",   value: invoiceTimeSaved, format: (n) => `${Math.round(n)} min`, weight: "auto-billed · QB synced" },
    { label: "Customer acquisition cost", value: -31, format: pct, weight: "via review velocity" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-background/50">
            ROI calculus · revenue-forward
            <ExplainTip title="Field ROI">
              For a trade business this isn't about cost savings — it's about more jobs per truck per day and bigger tickets per job. Both grow live as ROUTE optimizes and TECH spots upsells.
            </ExplainTip>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">Revenue generated this month</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-[11px] uppercase tracking-wider text-background/50">Running total</div>
          <div className="mt-1 font-display text-2xl font-bold tracking-tight">
            <AnimatedNumber value={kpis.revenueMonth} format={(n) => `$${Math.round(n).toLocaleString()}`} />
          </div>
        </div>
      </div>

      <div className="border-b border-background/10 px-6 pt-4 text-[11px] font-semibold uppercase tracking-wider text-background/60">Revenue engine</div>
      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-5">
        {revenueInputs.map((i) => <Cell key={i.label} {...i} />)}
      </div>

      <div className="border-y border-background/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-background/60">
        Quality &amp; retention — the compounding flywheel
      </div>
      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {qualityInputs.map((i) => <Cell key={i.label} {...i} />)}
      </div>

      <div className="space-y-2 border-t border-background/10 px-6 py-5 text-sm leading-relaxed text-background/70">
        <div>
          <span className="font-semibold text-background">Core formula —</span>{" "}
          <span className="font-mono text-xs text-background/80">
            (jobs/truck/day × revenue/job × {fleet} trucks) + (upsell conversion × ticket lift) − (callback cost + invoice overhead)
          </span>
        </div>
        <div>
          <span className="font-semibold text-background">Right now —</span>{" "}
          ROUTE has {kpis.trucksOnRoute} trucks live, the fleet is averaging{" "}
          <span className="font-mono text-background">${Math.round(kpis.revenuePerTruckDay).toLocaleString()}</span>/truck/day and INVOICE has billed{" "}
          <span className="font-mono text-background">{kpis.jobsMonth}</span> jobs this month — every one synced to QuickBooks before the tech leaves the driveway.
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, format, weight }: { label: string; value: number; format: (n: number) => string; weight: string }) {
  return (
    <div className="bg-foreground p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-background/50">{label}</div>
      <div className="mt-2 font-display text-xl font-bold tracking-tight">
        <AnimatedNumber value={value} format={format} />
      </div>
      <div className="mt-0.5 font-mono text-[11px] text-background/40">{weight}</div>
    </div>
  );
}

function money(n: number) { return `$${Math.round(n).toLocaleString()}`; }
function pct(n: number) { return `${Math.round(n)}%`; }
function pct1(n: number) { return `${n.toFixed(0)}%`; }
function int(n: number) { return `${Math.round(n).toLocaleString()}`; }
function rating(n: number) { return `${n.toFixed(2)} / 5`; }
