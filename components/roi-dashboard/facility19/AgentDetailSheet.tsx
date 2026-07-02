import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useFacility19, formatMetric, formatRelative } from "@/lib/roi-dashboard/facility19/store";
import { Sparkline } from "./Sparkline";
import { CheckCircle2 } from "lucide-react";

export function AgentDetailSheet() {
  const { selectedAgent, setSelectedAgent, agents, events, zones } = useFacility19();
  const agent = agents.find((a) => a.id === selectedAgent);
  const open = !!agent;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedAgent(null)}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {agent && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${agent.color}1A`, color: agent.color }}>
                  <span className="font-display text-sm font-bold">{agent.name[0]}</span>
                </div>
                <div>
                  <SheetTitle className="font-display tracking-tight">{agent.name}</SheetTitle>
                  <SheetDescription className="uppercase tracking-wider text-[11px]">{agent.domain} · {agent.status}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{agent.metricLabel}</span>
                  <span className="font-mono text-xs text-success">{agent.deltaText}</span>
                </div>
                <div className="mt-1 font-display text-3xl font-bold tracking-tight">
                  {formatMetric(agent.metricValue, agent.metricFormat)}
                </div>
                <div className="mt-3 h-16" style={{ color: agent.color }}>
                  <Sparkline data={agent.sparkline} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">last ~1 min telemetry</div>
              </div>

              <div>
                <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider">Zones managed</div>
                <div className="flex flex-wrap gap-1.5">
                  {zones.filter((z) => z.agentId === agent.id).map((z) => (
                    <span key={z.id} className="rounded-full border border-border px-2.5 py-1 text-[11px]">{z.label}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider">Recent actions</div>
                <ul className="space-y-2 text-sm">
                  {agent.recentActions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /><span>{a}</span></li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider">Live event log</div>
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {events.filter((e) => e.agentId === agent.id).slice(0, 6).map((e) => (
                    <li key={e.id} className="px-3 py-2.5">
                      <div className="text-xs font-semibold">{e.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{e.detail} · {formatRelative(e.ts)}</div>
                    </li>
                  ))}
                  {events.filter((e) => e.agentId === agent.id).length === 0 && (
                    <li className="px-3 py-3 text-xs text-muted-foreground">Standing by — no recent events.</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
