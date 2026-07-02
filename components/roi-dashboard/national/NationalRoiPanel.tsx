import { useNational } from "@/lib/roi-dashboard/national/store";
import { AnimatedNumber } from "@/components/roi-dashboard/facility19/AnimatedNumber";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

export function NationalRoiPanel() {
  const { kpis, clients } = useNational();
  const totalContractValue = clients.reduce((a, c) => a + c.contractValue, 0);
  const ltvLift = totalContractValue * 0.18;
  const slaPenaltyAvoided = (3.1 - kpis.slaBreachRate) / 100 * totalContractValue * 0.05;

  const operational: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "Contract value retained", value: totalContractValue, format: money, weight: "all clients · annualized" },
    { label: "SLA penalty avoidance", value: slaPenaltyAvoided, format: money, weight: `breach rate ${kpis.slaBreachRate.toFixed(1)}%` },
    { label: "Subcontractor utilization", value: kpis.subUtilization, format: pct1, weight: "↑ from 61%" },
    { label: "Dispatch overhead reduced", value: -54, format: pct, weight: "vs manual coordination" },
    { label: "Client reporting time saved", value: 92, format: pct, weight: "QBRs auto-generated" },
  ];

  const commercial: Array<{ label: string; value: number; format: (n: number) => string; weight: string }> = [
    { label: "Client retention", value: kpis.clientRetention, format: pct1, weight: "↑ 4 pts YoY" },
    { label: "New contract win rate", value: 38, format: pct, weight: "AI reporting cited in pitch" },
    { label: "Client LTV increase", value: ltvLift, format: money, weight: "modeled · 18% lift" },
    { label: "Cost of acquisition", value: -27, format: pct, weight: "reduced via referrals" },
    { label: "Churn reduction", value: -62, format: pct, weight: "vs prior 12 mo" },
    { label: "Escalation cost avoidance", value: 184_000, format: money, weight: "L2 + L3 tickets / qtr" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-background/50">
            ROI calculus · operational + commercial
            <ExplainTip title="Provider ROI">
              Two dimensions matter: operational savings (subs, dispatch, SLA penalties) AND commercial growth (retention, LTV, new contracts driven by AI-generated client reporting).
            </ExplainTip>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">Revenue protected, live</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-[11px] uppercase tracking-wider text-background/50">Running total</div>
          <div className="mt-1 font-display text-2xl font-bold tracking-tight">
            <AnimatedNumber value={kpis.revenueProtected} format={(n) => `$${Math.round(n).toLocaleString()}`} />
          </div>
        </div>
      </div>

      <div className="border-b border-background/10 px-6 pt-4 text-[11px] font-semibold uppercase tracking-wider text-background/60">Operational</div>
      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-5">
        {operational.map((i) => <Cell key={i.label} {...i} />)}
      </div>

      <div className="border-y border-background/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-background/60">
        Commercial — the ROI you sell to your clients
      </div>
      <div className="grid grid-cols-1 gap-px bg-background/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {commercial.map((i) => <Cell key={i.label} {...i} />)}
      </div>

      <div className="space-y-2 border-t border-background/10 px-6 py-5 text-sm leading-relaxed text-background/70">
        <div>
          <span className="font-semibold text-background">Core formula —</span>{" "}
          <span className="font-mono text-xs text-background/80">
            (sub efficiency + dispatch savings + SLA penalties avoided) + (retention × LTV × win-rate lift)
          </span>
        </div>
        <div>
          <span className="font-semibold text-background">Commercial layer —</span>{" "}
          REPORT turns every resolved ticket into client-facing proof. {kpis.newContracts} new contracts won this quarter cite the AI dashboard as a deciding factor.
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
function pct1(n: number) { return `${n.toFixed(1)}%`; }
