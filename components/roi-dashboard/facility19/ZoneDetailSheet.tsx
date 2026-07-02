import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useFacility19, formatRelative } from "@/lib/roi-dashboard/facility19/store";
import { Progress } from "@/components/roi-dashboard/ui/progress";

const statusLabel = { ok: "Healthy", watch: "Watching", alert: "Alert" } as const;
const statusClass = {
  ok: "bg-success/15 text-success border-success/30",
  watch: "bg-warning/15 text-warning-foreground border-warning/40",
  alert: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

export function ZoneDetailSheet() {
  const { selectedZone, setSelectedZone, zones, agents, events, setSelectedAgent } = useFacility19();
  const zone = zones.find((z) => z.id === selectedZone);
  const open = !!zone;
  const agent = zone ? agents.find((a) => a.id === zone.agentId) : null;
  const zoneEvents = zone ? events.filter((e) => e.zoneId === zone.id) : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedZone(null)}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {zone && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display tracking-tight">{zone.label}</SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusClass[zone.status]}`}>
                  {statusLabel[zone.status]}
                </span>
                <span className="text-xs">{zone.note}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Metric label="Temp" value={`${zone.temp}°F`} />
                <Metric label="Humidity" value={`${zone.humidity}%`} />
                <Metric label="Load" value={`${zone.load}%`} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <span>Load utilization</span><span>{zone.load}%</span>
                </div>
                <Progress value={zone.load} />
              </div>

              {agent && (
                <button
                  onClick={() => { setSelectedZone(null); setTimeout(() => setSelectedAgent(agent.id), 150); }}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${agent.color}1A`, color: agent.color }}>
                      <span className="font-display text-xs font-bold">{agent.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Responsible AI</div>
                      <div className="text-sm font-semibold">{agent.name} · {agent.domain}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-primary">view →</span>
                </button>
              )}

              <div>
                <div className="mb-2 font-display text-xs font-bold uppercase tracking-wider">Recent activity in this zone</div>
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {zoneEvents.slice(0, 6).map((e) => (
                    <li key={e.id} className="px-3 py-2.5">
                      <div className="text-xs font-semibold">{e.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{e.detail} · {formatRelative(e.ts)}</div>
                    </li>
                  ))}
                  {zoneEvents.length === 0 && (
                    <li className="px-3 py-3 text-xs text-muted-foreground">Quiet zone — nothing to report.</li>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}
