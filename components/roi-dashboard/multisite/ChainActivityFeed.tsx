import { CheckCircle2, Truck, FileText, AlertTriangle, Wrench } from "lucide-react";
import { useMultiSite, formatRelative, type ChainEventType } from "@/lib/roi-dashboard/multisite/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

const iconMap: Record<ChainEventType, { Icon: typeof CheckCircle2; color: string }> = {
  resolved:    { Icon: CheckCircle2, color: "text-success" },
  dispatched:  { Icon: Truck,        color: "text-primary" },
  report:      { Icon: FileText,     color: "text-foreground" },
  alert:       { Icon: AlertTriangle, color: "text-warning" },
  maintenance: { Icon: Wrench,       color: "text-muted-foreground" },
};

export function ChainActivityFeed() {
  const { events, setSelectedSite, setSelectedAgent } = useMultiSite();
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Chain-Wide Activity</h3>
          <ExplainTip title="Chain-Wide Activity">
            Every action across all 847 sites streams here in real time — auto-resolved tickets, batched truck rolls, weekly reports, predictive alerts.
          </ExplainTip>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">streaming</span>
      </div>
      <ul className="max-h-[420px] divide-y divide-border overflow-auto">
        {events.map((e) => {
          const { Icon, color } = iconMap[e.type];
          return (
            <li key={e.id}
              className="group flex animate-fade-in cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              onClick={() => {
                if (e.siteId) setSelectedSite(e.siteId);
                else if (e.agentId) setSelectedAgent(e.agentId);
              }}
            >
              <div className={`mt-0.5 ${color}`}><Icon className="h-4 w-4" strokeWidth={2.25} /></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold tracking-tight">{e.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{e.detail}</div>
              </div>
              <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {formatRelative(e.ts)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
