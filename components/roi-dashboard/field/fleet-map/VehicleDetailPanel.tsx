import { AlertTriangle, RefreshCw, X } from "lucide-react";
import type { LiveVehicle } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { computeVehicleStatus, statusColor, timeAgo } from "@/lib/roi-dashboard/field/computeVehicleStatus";

interface Props {
  vehicle: LiveVehicle;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 py-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-100">{value}</span>
    </div>
  );
}

export function VehicleDetailPanel({ vehicle, onClose }: Props) {
  const v = vehicle;
  const status = computeVehicleStatus(v);
  const color = statusColor(status);
  const initials = (v.driver_name ?? "??").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const fuel = v.diagnostics?.fuel_level;

  return (
    <div className="pointer-events-auto flex max-h-[calc(100%-3rem)] w-full flex-col rounded-lg border border-white/10 bg-[rgba(7,13,26,0.96)] backdrop-blur-md text-slate-200 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">Vehicle Detail</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-slate-400 hover:bg-white/5" aria-label="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/5" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-200">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-50">{v.driver_name ?? "—"}</div>
            <div className="truncate text-[10px] text-slate-500">#{v.is_asset_id}</div>
          </div>
          <span
            className="rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
            style={{ background: `${color}22`, color }}
          >
            {status.toUpperCase()}
          </span>
        </div>

        <div className="mt-3 rounded border border-white/10 bg-black/20 p-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Location</div>
          <div className="mt-0.5 text-xs text-slate-200">{v.address ?? "—"}</div>
          <div className="mt-0.5 font-mono text-[10px] text-slate-500">
            {v.lat.toFixed(4)}, {v.lng.toFixed(4)}
          </div>
          <div className="mt-1 font-mono text-[10px] text-slate-500">Updated {timeAgo(v.last_update)}</div>
          {v.is_stale && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400">
              <AlertTriangle className="h-3 w-3" /> Stale — last ping &gt; 30 min ago
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Telemetry</div>
          <div className="mt-1">
            <Row label="Speed" value={`${Math.round(v.speed_mph)} mph`} />
            <Row label="Heading" value={`${Math.round(v.heading_deg)}°`} />
            <Row label="Engine" value={v.engine_on ? "On" : "Off"} />
            {typeof fuel === "number" && <Row label="Fuel" value={`${fuel}%`} />}
            {v.diagnostics?.odometer != null && (
              <Row label="Odometer" value={`${v.diagnostics.odometer.toLocaleString()} mi`} />
            )}
            {v.diagnostics?.engine_hours != null && (
              <Row label="Eng. hours" value={`${v.diagnostics.engine_hours.toFixed(1)} h`} />
            )}
            <Row label="Power" value={v.is_main_power_on ? "Connected" : "Off"} />
            {v.idle_duration_human && <Row label="Idle" value={v.idle_duration_human} />}
            {v.stop_duration_human && <Row label="Stop" value={v.stop_duration_human} />}
          </div>
        </div>

        {v.diagnostics?.mil_lamp_on && (
          <div className="mt-3 flex items-center gap-2 rounded border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            MIL lamp on — engine diagnostic code present.
          </div>
        )}

        <div className="mt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Route history</div>
          <select disabled className="mt-1 w-full cursor-not-allowed rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-500">
            <option>Last 1h on map</option>
          </select>
        </div>
      </div>
    </div>
  );
}
