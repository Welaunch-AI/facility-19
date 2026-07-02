import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useMultiSite, formatChainMetric } from "@/lib/roi-dashboard/multisite/store";
import { Sparkline } from "@/components/roi-dashboard/facility19/Sparkline";

export function FleetAgentDetailSheet() {
  const { agents, selectedAgent, setSelectedAgent, events } = useMultiSite();
  const agent = agents.find((a) => a.id === selectedAgent) ?? null;
  const open = !!agent;
  const agentEvents = agent ? events.filter((e) => e.agentId === agent.id).slice(0, 6) : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedAgent(null)}>
      <SheetContent className="w-full sm:max-w-md">
        {agent && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl" style={{ color: agent.color }}>{agent.name}</SheetTitle>
              <SheetDescription>{agent.domain} · {agent.status}</SheetDescription>
            </SheetHeader>
            <p className="mt-4 text-sm text-muted-foreground">{agent.description}</p>
            <div className="mt-5 rounded-xl border border-border p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{agent.metricLabel}</div>
              <div className="mt-1 font-display text-3xl font-bold tracking-tight">{formatChainMetric(agent.metricValue, agent.metricFormat)}</div>
              <div className="mt-3 h-12 w-full" style={{ color: agent.color }}>
                <Sparkline data={agent.sparkline} />
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent actions</div>
              <ul className="space-y-2">
                {agent.recentActions.map((a, i) => (
                  <li key={i} className="rounded-lg border border-border p-3 text-sm">{a}</li>
                ))}
              </ul>
            </div>
            {agentEvents.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live events</div>
                <ul className="space-y-2">
                  {agentEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-border p-3">
                      <div className="text-sm font-semibold">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.detail}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
