import { ChevronLeft, ChevronRight, Search, Tag } from "lucide-react";
import { useState } from "react";
import type { FleetMapWorkOrder } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { woRingColor } from "@/lib/roi-dashboard/field/computeVehicleStatus";

interface Props {
  workOrders: FleetMapWorkOrder[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function WorkOrdersDock({ workOrders, selectedId, onSelect, open, onToggle }: Props) {
  const [q, setQ] = useState("");
  const filtered = workOrders.filter((w) => {
    if (!q) return true;
    const hay = `${w.locationSiteName ?? ""} ${w.locationCity ?? ""} ${w.problemType ?? ""} ${w.ucWoId ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div
      className="pointer-events-auto relative rounded-lg border border-white/10 bg-[rgba(7,13,26,0.95)] backdrop-blur-md text-slate-200 shadow-2xl"
      style={{ opacity: open ? 1 : 0 }}
    >
      <button
        onClick={onToggle}
        className="fleet-dock-tab amber focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-expanded={open}
        aria-label="Toggle work orders dock"
      >
        {open ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-amber-400" />
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Work Orders</div>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
              {workOrders.length}
            </span>
          </div>
          <div className="px-3 pt-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search work orders..."
                className="w-full rounded border border-white/10 bg-black/30 py-1.5 pl-7 pr-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
            {filtered.map((w) => {
              const color = woRingColor(w.extendedStatus);
              const selected = w.id === selectedId;
              return (
                <button
                  key={w.id}
                  onClick={() => onSelect(w.id)}
                  className={`w-full rounded border p-2 text-left transition-all ${
                    selected
                      ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_14px_rgba(245,158,11,0.2)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-slate-100">
                          #{w.ucWoId ?? w.id}
                        </span>
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${color}22`, color }}
                        >
                          {(w.extendedStatus ?? "").replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="truncate text-[11px] text-slate-300">{w.locationSiteName}</div>
                      <div className="truncate text-[10px] text-slate-500">{w.locationCity}, {w.locationState} · {w.tradeNames}</div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">No work orders match.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
