import { Store, Wind, Zap, Network, Sparkles } from "lucide-react";
import { type FleetAgent, formatChainMetric, useMultiSite } from "@/lib/roi-dashboard/multisite/store";
import { Sparkline } from "@/components/roi-dashboard/facility19/Sparkline";
import { AnimatedNumber } from "@/components/roi-dashboard/facility19/AnimatedNumber";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

const iconMap = {
  store: Store,
  aria: Wind,
  volt: Zap,
  apex: Network,
  nova: Sparkles,
};

export function FleetAgentCard({ agent }: { agent: FleetAgent }) {
  const Icon = iconMap[agent.id];
  const isActive = agent.status === "Active";
  const { setSelectedAgent } = useMultiSite();
  return (
    <button
      onClick={() => setSelectedAgent(agent.id)}
      className="group relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${agent.color}1A`, color: agent.color }}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold leading-none tracking-tight">{agent.name}</span>
              <ExplainTip title={`${agent.name} — ${agent.domain}`}>{agent.description}</ExplainTip>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{agent.domain}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success live-dot" : "bg-muted-foreground/40"}`} />
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{agent.status}</span>
        </div>
      </div>
      <div className="border-t border-dashed border-border pt-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{agent.metricLabel}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight">
                <AnimatedNumber value={agent.metricValue} format={(n) => formatChainMetric(n, agent.metricFormat)} />
              </span>
              <span className="font-mono text-xs text-success">{agent.deltaText}</span>
            </div>
          </div>
          <div className="h-10 w-24 shrink-0" style={{ color: agent.color }}>
            <Sparkline data={agent.sparkline} />
          </div>
        </div>
      </div>
    </button>
  );
}
