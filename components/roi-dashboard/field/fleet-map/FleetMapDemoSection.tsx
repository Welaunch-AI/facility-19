import { useEffect, useMemo, useState } from "react";
import { DUMMY_LIVE_VEHICLES, DUMMY_WORK_ORDERS, type LiveVehicle } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { useVehicleMotion } from "./useVehicleMotion";
import { FleetMapCanvas, type Basemap, type Scope } from "./FleetMapCanvas";
import { FleetDock } from "./FleetDock";
import { WorkOrdersDock } from "./WorkOrdersDock";
import { VehicleDetailPanel } from "./VehicleDetailPanel";
import { JobDetailSlideOver } from "./JobDetailSlideOver";
import { MapToolbar } from "./MapToolbar";
import "./styles.css";

export function FleetMapDemoSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [vehicles, setVehicles] = useState<LiveVehicle[]>(DUMMY_LIVE_VEHICLES);
  const [workOrders] = useState(DUMMY_WORK_ORDERS);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedWoId, setSelectedWoId] = useState<number | null>(null);
  const [fleetOpen, setFleetOpen] = useState(true);
  const [woOpen, setWoOpen] = useState(true);
  const [basemap, setBasemap] = useState<Basemap>("dark");
  const [scope, setScope] = useState<Scope>("both");
  const [labels, setLabels] = useState(true);
  const [fitSignal, setFitSignal] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [mobileTab, setMobileTab] = useState<"map" | "fleet" | "jobs" | "detail">("map");

  useVehicleMotion(vehicles, setVehicles);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.is_asset_id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId],
  );
  const selectedWo = useMemo(
    () => workOrders.find((w) => w.id === selectedWoId) ?? null,
    [workOrders, selectedWoId],
  );

  const handleSelectVehicle = (id: number | null) => {
    setSelectedVehicleId(id);
    setSelectedWoId(null);
    if (id) setMobileTab("detail");
  };
  const handleSelectWo = (id: number | null) => {
    setSelectedWoId(id);
    setSelectedVehicleId(null);
    if (id) setMobileTab("detail");
  };

  const fakeRefresh = () => {
    setSpinning(true);
    setVehicles((prev) => prev.map((v) => ({ ...v, last_update: v.is_stale ? v.last_update : new Date().toISOString() })));
    window.setTimeout(() => setSpinning(false), 700);
  };

  return (
    <section id="live-fleet-map" aria-labelledby="live-fleet-map-title">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            See live operations
          </div>
          <h2 id="live-fleet-map-title" className="mt-1 font-display text-xl font-bold tracking-tight">
            Fleet Command — supervisor map
          </h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:block">
          Demo · static data, local animation
        </span>
      </div>

      <div className="fleet-map-page fleet-map-vignette relative h-[640px] w-full overflow-hidden rounded-xl border border-border shadow-2xl">
        {/* Map base */}
        <div className="absolute inset-0">
          {mounted ? (
            <FleetMapCanvas
              vehicles={vehicles}
              workOrders={workOrders}
              selectedVehicleId={selectedVehicleId}
              selectedWoId={selectedWoId}
              onSelectVehicle={handleSelectVehicle}
              onSelectWo={handleSelectWo}
              basemap={basemap}
              scope={scope}
              fitSignal={fitSignal}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-slate-500">Loading map…</div>
          )}
        </div>

        {/* Toolbar */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-[500] -translate-x-1/2">
          <MapToolbar
            basemap={basemap} setBasemap={setBasemap}
            scope={scope} setScope={setScope}
            onRefresh={fakeRefresh}
            onFit={() => setFitSignal((n) => n + 1)}
            labels={labels} setLabels={setLabels}
            spinning={spinning}
          />
        </div>

        {/* Desktop: left docks */}
        <div className="pointer-events-none absolute bottom-14 left-3 top-3 z-[500] hidden w-[17rem] flex-col gap-3 lg:flex xl:w-[19rem]">
          <div className="pointer-events-auto h-1/2">
            <FleetDock
              vehicles={vehicles}
              selectedId={selectedVehicleId}
              onSelect={handleSelectVehicle}
              open={fleetOpen}
              onToggle={() => setFleetOpen((o) => !o)}
              onRefresh={fakeRefresh}
            />
          </div>
          <div className="pointer-events-auto flex-1">
            <WorkOrdersDock
              workOrders={workOrders}
              selectedId={selectedWoId}
              onSelect={handleSelectWo}
              open={woOpen}
              onToggle={() => setWoOpen((o) => !o)}
            />
          </div>
        </div>

        {/* Job detail slide-over (left side, after docks) */}
        {selectedWo && (
          <div
            className="pointer-events-none absolute bottom-14 top-3 z-[600] hidden lg:block"
            style={{ left: `calc(${(fleetOpen || woOpen) ? "17rem" : "1.5rem"} + 1.25rem)` }}
          >
            <JobDetailSlideOver
              wo={selectedWo}
              onClose={() => setSelectedWoId(null)}
              onCollapse={() => { setFleetOpen(false); setWoOpen(false); }}
            />
          </div>
        )}

        {/* Vehicle detail (right) */}
        {selectedVehicle && (
          <div className="pointer-events-none absolute right-3 top-3 z-[600] hidden w-[19rem] lg:block xl:w-[21rem]"
               style={{ maxHeight: "calc(100% - 4rem)" }}>
            <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicleId(null)} />
          </div>
        )}

        {/* Bottom strip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex items-center justify-between border-t border-white/10 bg-[rgba(7,13,26,0.95)] px-3 py-2 backdrop-blur-md">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE</span>
            <span>{vehicles.length} units</span>
            <span className="hidden sm:inline">{vehicles.filter((v) => v.engine_on).length} engines on</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            <span className="hidden md:inline">Sync · {new Date().toLocaleTimeString()}</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> En route</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On site</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-100" /> Returning</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Idle</span>
            </span>
          </div>
        </div>

        {/* Mobile bottom-sheet tabs */}
        <div className="pointer-events-auto absolute inset-x-2 bottom-12 z-[700] lg:hidden">
          <div className="mb-2 flex gap-1 rounded-full border border-white/10 bg-[rgba(7,13,26,0.95)] p-1 backdrop-blur-md">
            {(["map", "fleet", "jobs", "detail"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMobileTab(t)}
                className={`flex-1 rounded-full px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  mobileTab === t ? "bg-cyan-500 text-slate-950" : "text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {mobileTab !== "map" && (
            <div className="max-h-[55vh] overflow-y-auto rounded-lg">
              {mobileTab === "fleet" && (
                <FleetDock
                  vehicles={vehicles}
                  selectedId={selectedVehicleId}
                  onSelect={handleSelectVehicle}
                  open
                  onToggle={() => setMobileTab("map")}
                  onRefresh={fakeRefresh}
                />
              )}
              {mobileTab === "jobs" && (
                <WorkOrdersDock
                  workOrders={workOrders}
                  selectedId={selectedWoId}
                  onSelect={handleSelectWo}
                  open
                  onToggle={() => setMobileTab("map")}
                />
              )}
              {mobileTab === "detail" && selectedVehicle && (
                <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicleId(null)} />
              )}
              {mobileTab === "detail" && selectedWo && (
                <JobDetailSlideOver
                  wo={selectedWo}
                  onClose={() => setSelectedWoId(null)}
                  onCollapse={() => setMobileTab("map")}
                />
              )}
              {mobileTab === "detail" && !selectedVehicle && !selectedWo && (
                <div className="rounded-lg border border-white/10 bg-[rgba(7,13,26,0.95)] p-6 text-center text-xs text-slate-400">
                  Select a truck or job to view details.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
