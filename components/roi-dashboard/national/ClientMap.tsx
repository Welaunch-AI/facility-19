import { MapPin } from "lucide-react";
import { useNational, type ClientStatus } from "@/lib/roi-dashboard/national/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

const dot: Record<ClientStatus, string> = {
  healthy: "map-dot--success",
  watch: "map-dot--warning",
  atrisk: "map-dot--destructive",
};

export function ClientMap() {
  const { clients, setSelectedClient } = useNational();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Client Network — {clients.length} accounts</h3>
          <ExplainTip title="Client Network">
            Each dot is one client account (a portfolio of sites we manage under contract). Color = SLA health right now. Click to drill into contract value, sites, sub coverage, and live ticket pressure.
          </ExplainTip>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--success" /> healthy</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--warning" /> watch</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--destructive" /> at-risk</span>
        </div>
      </div>
      <div className="p-5">
        <div className="relative aspect-[16/9] w-full grid-bg overflow-hidden rounded-xl border border-border">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="map-landmass-blob absolute left-[5%] top-[20%] h-[60%] w-[20%] blur-2xl" />
            <div className="map-landmass-blob absolute left-[35%] top-[15%] h-[70%] w-[35%] blur-3xl" />
            <div className="map-landmass-blob absolute right-[5%] top-[18%] h-[60%] w-[25%] blur-2xl" />
          </div>
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClient(c.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 bg-transparent"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span
                className={`map-dot map-dot--md ${dot[c.status]} ${c.status !== "healthy" ? "map-dot--ping" : ""} transition-transform group-hover:scale-150`}
              />
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono group-hover:block">
                {c.name} · {c.state} · {c.sites} sites · ${(c.contractValue / 1000).toFixed(0)}K/yr
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
