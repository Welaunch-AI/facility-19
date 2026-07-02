import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import type { LiveVehicle } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { computeVehicleStatus, statusColor, statusLabel, timeAgo, type DerivedStatus } from "@/lib/roi-dashboard/field/computeVehicleStatus";
import { useMemo, useState } from "react";

type Filter = "ALL" | "EN ROUTE" | "ON SITE" | "RETURNING" | "IDLE";
const filterToStatus: Record<Exclude<Filter, "ALL">, DerivedStatus> = {
  "EN ROUTE": "enroute",
  "ON SITE": "onsite",
  "RETURNING": "returning",
  "IDLE": "idle",
};

interface Props {
  vehicles: LiveVehicle[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  open: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}

export function FleetDock({ vehicles, selectedId, onSelect, open, onToggle, onRefresh }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [q, setQ] = useState("");
  const [spinning, setSpinning] = useState(false);

  const counts = useMemo(() => {
    const c = { enroute: 0, onsite: 0, returning: 0, idle: 0 };
    vehicles.forEach((v) => { c[computeVehicleStatus(v)]++; });
    return c;
  }, [vehicles]);

  const filtered = vehicles.filter((v) => {
    const s = computeVehicleStatus(v);
    if (filter !== "ALL" && filterToStatus[filter] !== s) return false;
    if (q) {
      const hay = `${v.driver_name ?? ""} ${v.address ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh();
    window.setTimeout(() => setSpinning(false), 700);
  };

  return (
    <div
      className="pointer-events-auto relative rounded-lg border border-white/10 bg-[rgba(7,13,26,0.95)] backdrop-blur-md text-slate-200 shadow-2xl transition-all"
      style={{ width: open ? undefined : 0, opacity: open ? 1 : 0 }}
    >
      <button
        onClick={onToggle}
        className="fleet-dock-tab focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-expanded={open}
        aria-label="Toggle fleet dock"
      >
        {open ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded bg-cyan-500/15 text-[10px] font-bold uppercase tracking-wider text-cyan-300">F</span>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">Fleet<br/>Command</div>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-blue-300" title="En route">{counts.enroute}</span>
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300" title="On site">{counts.onsite}</span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-slate-100" title="Returning">{counts.returning}</span>
              <span className="rounded-full bg-slate-500/15 px-1.5 py-0.5 text-slate-300" title="Idle">{counts.idle}</span>
              <button onClick={handleRefresh} className="ml-1 rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Refresh">
                <RefreshCw className={`h-3 w-3 ${spinning ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="px-3 pt-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search driver or unit..."
                className="w-full rounded border border-white/10 bg-black/30 py-1.5 pl-7 pr-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="mt-2 flex gap-1">
              {(["ALL", "EN ROUTE", "ON SITE", "RETURNING", "IDLE"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 rounded-full px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    filter === f
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex-1 space-y-1.5 overflow-y-auto px-3 pb-3">
            {filtered.map((v) => {
              const status = computeVehicleStatus(v);
              const initials = (v.driver_name ?? "??")
                .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
              const selected = v.is_asset_id === selectedId;
              return (
                <button
                  key={v.is_asset_id}
                  onClick={() => onSelect(v.is_asset_id)}
                  className={`w-full rounded-md border p-2 text-left transition-all ${
                    selected
                      ? "border-cyan-400/60 bg-gradient-to-r from-cyan-500/15 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-200">{initials}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="truncate text-xs font-semibold text-slate-100">{v.driver_name ?? "—"}</div>
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${statusColor(status)}22`, color: statusColor(status) }}
                        >
                          {statusLabel(status)}
                        </span>
                      </div>
                      <div className="truncate text-[10px] text-slate-400">{v.address ?? "—"}</div>
                      <div className="mt-0.5 flex items-center justify-between font-mono text-[9px] text-slate-500">
                        <span>{status === "enroute" ? `${Math.round(v.speed_mph)} mph` : v.stop_duration_human ? `Parked ${v.stop_duration_human}` : ""}</span>
                        <span>{timeAgo(v.last_update)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">No vehicles match.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
