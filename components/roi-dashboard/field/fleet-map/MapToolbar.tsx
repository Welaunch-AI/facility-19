import { Layers, MapPinned, Maximize2, RefreshCw, Tag, Truck } from "lucide-react";
import type { Basemap, Scope } from "./FleetMapCanvas";

interface Props {
  basemap: Basemap;
  setBasemap: (b: Basemap) => void;
  scope: Scope;
  setScope: (s: Scope) => void;
  onRefresh: () => void;
  onFit: () => void;
  labels: boolean;
  setLabels: (b: boolean) => void;
  spinning: boolean;
}

export function MapToolbar({
  basemap, setBasemap, scope, setScope, onRefresh, onFit, labels, setLabels, spinning,
}: Props) {
  const btn = "flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors";
  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[rgba(7,13,26,0.92)] p-1 backdrop-blur-md shadow-2xl">
      <button onClick={onRefresh} className={`${btn} bg-white/5 text-slate-200 hover:bg-white/10`} aria-label="Refresh">
        <RefreshCw className={`h-3 w-3 ${spinning ? "animate-spin" : ""}`} /> Sync
      </button>
      <button onClick={() => setLabels(!labels)} className={`${btn} ${labels ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-200 hover:bg-white/10"}`}>
        <Tag className="h-3 w-3" /> Labels
      </button>
      <button onClick={onFit} className={`${btn} bg-white/5 text-slate-200 hover:bg-white/10`}>
        <Maximize2 className="h-3 w-3" /> Fit
      </button>
      <span className="mx-1 h-4 w-px bg-white/10" />
      <div className="flex rounded-full bg-black/30 p-0.5">
        {(["fleet", "jobs", "both"] as Scope[]).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`${btn} ${scope === s ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
            aria-pressed={scope === s}
          >
            {s === "fleet" ? <Truck className="h-3 w-3" /> : s === "jobs" ? <MapPinned className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
            {s}
          </button>
        ))}
      </div>
      <span className="mx-1 h-4 w-px bg-white/10" />
      <div className="flex rounded-full bg-black/30 p-0.5">
        {(["dark", "satellite"] as Basemap[]).map((b) => (
          <button
            key={b}
            onClick={() => setBasemap(b)}
            className={`${btn} ${basemap === b ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
            aria-pressed={basemap === b}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
