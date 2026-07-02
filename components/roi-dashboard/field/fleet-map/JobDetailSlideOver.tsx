import { ChevronLeft, X } from "lucide-react";
import type { FleetMapWorkOrder } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { woRingColor } from "@/lib/roi-dashboard/field/computeVehicleStatus";

interface Props {
  wo: FleetMapWorkOrder;
  onClose: () => void;
  onCollapse: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px,1fr] gap-2 border-b border-white/5 py-1.5 text-xs">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-slate-100">{value ?? "—"}</span>
    </div>
  );
}

export function JobDetailSlideOver({ wo, onClose, onCollapse }: Props) {
  const color = woRingColor(wo.extendedStatus);
  const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="pointer-events-auto flex h-full w-[20rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-[rgba(7,13,26,0.96)] backdrop-blur-md text-slate-200 shadow-2xl">
      <div className="relative border-b border-white/10">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: "#f59e0b" }} />
        <div className="flex items-center justify-between px-3 py-2.5 pt-3">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">Job Detail</div>
            <div className="font-mono text-[11px] text-slate-100">#{wo.ucWoId ?? wo.id}</div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onCollapse} className="rounded p-1 text-slate-400 hover:bg-white/5" aria-label="Collapse">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/5" aria-label="Close">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="rounded border border-white/10 bg-black/20 p-2">
          <div className="text-sm font-semibold text-slate-50">{wo.locationSiteName}</div>
          <div className="mt-0.5 text-[11px] text-slate-400">{wo.locationFullAddress}</div>
        </div>

        <div className="mt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Work order</div>
          <div className="mt-1">
            <Row label="Type" value={wo.workOrderType} />
            <Row label="Problem" value={wo.problemType} />
            <Row label="Priority" value={
              <span style={{ color: wo.priority?.toLowerCase() === "emergency" ? "#ef4444" : undefined }}>
                {wo.priority}
              </span>
            } />
            <Row label="Trade" value={wo.tradeNames} />
            <Row label="Status" value={
              <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: `${color}22`, color }}>
                {(wo.extendedStatus ?? "").replace(/_/g, " ")}
              </span>
            } />
            <Row label="Origin" value={wo.originSource} />
          </div>
        </div>

        {wo.instructions && (
          <div className="mt-3 rounded border border-white/10 bg-black/20 p-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Instructions</div>
            <p className="mt-1 text-[11px] leading-snug text-slate-200">{wo.instructions}</p>
          </div>
        )}

        <div className="mt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Parties</div>
          <Row label="Client" value={wo.companyName} />
          <Row label="Vendor" value={wo.vendorName} />
          <Row label="Vendor phone" value={wo.vendorPhone} />
          <Row label="Invoice" value={wo.clientInvoiceAmount ? `$${wo.clientInvoiceAmount}` : "$0.00"} />
        </div>

        <div className="mt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Timeline</div>
          <Row label="Created" value={fmtDate(wo.createdAt)} />
          <Row label="Service" value={fmtDate(wo.serviceDate)} />
          <Row label="Due" value={fmtDate(wo.expirationDate)} />
          <Row label="Closed" value={fmtDate(wo.closeDate)} />
          <Row label="Automation" value={wo.internalStatus} />
        </div>
      </div>
    </div>
  );
}
