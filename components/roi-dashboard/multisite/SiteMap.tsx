import { MapPin } from "lucide-react";
import { useMultiSite, type SiteStatus } from "@/lib/roi-dashboard/multisite/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

const dot: Record<SiteStatus, string> = {
  ok: "map-dot--success",
  watch: "map-dot--warning",
  alert: "map-dot--destructive",
};

export function SiteMap() {
  const { sites, setSelectedSite } = useMultiSite();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Live Site Network — 847 stores</h3>
          <ExplainTip title="Live Site Network">
            Each dot is a real store. Color = current health. Click any site to see live SLA, savings, energy delta and what STORE/ARIA/VOLT are doing there right now.
          </ExplainTip>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--success" /> ok</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--warning" /> watch</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--destructive" /> alert</span>
        </div>
      </div>
      <div className="p-5">
        <div className="relative aspect-[16/9] w-full grid-bg overflow-hidden rounded-xl border border-border">
          {/* fake background US shape via gradient blobs */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="map-landmass-blob absolute left-[5%] top-[20%] h-[60%] w-[20%] blur-2xl" />
            <div className="map-landmass-blob absolute left-[35%] top-[15%] h-[70%] w-[35%] blur-3xl" />
            <div className="map-landmass-blob absolute right-[5%] top-[18%] h-[60%] w-[25%] blur-2xl" />
          </div>
          {sites.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSite(s.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 bg-transparent"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span
                className={`map-dot map-dot--sm ${dot[s.status]} ${s.status !== "ok" ? "map-dot--ping" : ""} transition-transform group-hover:scale-150`}
              />
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono group-hover:block">
                #{s.id} {s.city} · ${s.savings.toLocaleString()}/mo · {s.sla.toFixed(1)}% SLA
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
