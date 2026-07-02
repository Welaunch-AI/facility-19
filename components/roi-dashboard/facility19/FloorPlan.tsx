import { Building2 } from "lucide-react";
import { useFacility19, type ZoneStatus } from "@/lib/roi-dashboard/facility19/store";
import { ExplainTip } from "./ExplainTip";

const statusFill: Record<ZoneStatus, string> = {
  ok: "floor-zone--ok",
  watch: "floor-zone--watch",
  alert: "floor-zone--alert",
};

export function FloorPlan() {
  const { zones, agents, setSelectedZone } = useFacility19();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Live Floor Plan — Tower A</h3>
          <ExplainTip title="Live Floor Plan">
            Each tile is a real zone in the building. Color = current health. Numbers update every couple of seconds from sensor data — click any zone to see live temp, humidity, load and which AI is responsible.
          </ExplainTip>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-success" /> ok</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-warning" /> watch</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-destructive" /> alert</span>
        </div>
      </div>
      <div className="p-5">
        <div className="relative aspect-[16/10] w-full grid-bg rounded-xl border border-border">
          <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {zones.map((z) => (
              <rect
                key={z.id}
                x={z.x} y={z.y} width={z.w} height={z.h} rx={1.2}
                className={`${statusFill[z.status]} transition-all`}
                strokeWidth={0.4}
              />
            ))}
          </svg>
          {zones.map((z) => {
            const agent = agents.find((a) => a.id === z.agentId);
            return (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className="absolute flex flex-col justify-between rounded-md bg-transparent p-2 text-left transition-all hover:bg-foreground/5 hover:ring-1 hover:ring-foreground/30"
                style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
              >
                <div>
                  <div className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-foreground/80">{z.label}</div>
                  <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                    {z.temp}°F · {z.humidity}% · {z.load}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{agent?.name}</span>
                  {z.status !== "ok" && (
                    <span className={`h-1.5 w-1.5 rounded-full live-dot ${z.status === "alert" ? "bg-destructive" : "bg-warning"}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
