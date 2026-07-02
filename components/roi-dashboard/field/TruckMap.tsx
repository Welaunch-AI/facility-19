import { Truck as TruckIcon } from "lucide-react";
import { useField, type TruckStatus } from "@/lib/roi-dashboard/field/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

const dot: Record<TruckStatus, string> = {
  enroute: "map-dot--primary",
  onsite: "map-dot--success",
  returning: "map-dot--foreground",
  idle: "map-dot--muted",
};

const label: Record<TruckStatus, string> = {
  enroute: "en route",
  onsite: "on site",
  returning: "returning",
  idle: "idle",
};

export function TruckMap() {
  const { trucks, setSelectedTruck } = useField();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <TruckIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Fleet — {trucks.length} trucks</h3>
          <ExplainTip title="Live Fleet">
            Each dot is a real truck. Position drifts as ROUTE re-sequences the day. Click any truck to see the tech, current job, ETA and revenue today.
          </ExplainTip>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--primary" /> en route</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--success" /> on site</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--foreground" /> returning</span>
          <span className="flex items-center gap-1.5"><span className="map-dot map-dot--legend map-dot--muted" /> idle</span>
        </div>
      </div>
      <div className="p-5">
        <div className="relative aspect-[16/9] w-full grid-bg overflow-hidden rounded-xl border border-border">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="map-road-line absolute left-[10%] right-[10%] top-1/2 h-px" />
            <div className="map-road-line absolute top-[15%] bottom-[15%] left-1/2 w-px" />
            <div className="map-road-line absolute left-[25%] right-[25%] top-1/3 h-px" />
            <div className="map-road-line absolute left-[15%] right-[15%] bottom-1/3 h-px" />
          </div>
          {trucks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTruck(t.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 bg-transparent transition-[left,top] duration-1000 ease-linear"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              <span
                className={`map-dot map-dot--md ${dot[t.status]} ${t.status === "enroute" ? "map-dot--ping" : ""} transition-transform group-hover:scale-150`}
              />
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono group-hover:block">
                {t.unit} · {t.tech} · {label[t.status]} · {t.currentJob}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
