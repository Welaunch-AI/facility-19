import type { LiveVehicle } from "./fleetMapDummyData";

// Unified vocabulary — matches the TruckMap legend.
export type DerivedStatus = "enroute" | "onsite" | "returning" | "idle";

export function computeVehicleStatus(v: LiveVehicle): DerivedStatus {
  // If paired with a TruckMap truck, mirror its status verbatim.
  if (v.paired_status) return v.paired_status;
  const ageMin = (Date.now() - new Date(v.last_update).getTime()) / 60_000;
  if (ageMin > 60) return "idle";
  if (v.engine_on === false) return "idle";
  if (v.speed_mph > 2) return "enroute";
  return "idle";
}

// Colors mirror the TruckMap dots:
// enroute → primary blue, onsite → success green,
// returning → foreground (light on dark map for visibility), idle → muted.
export function statusColor(s: DerivedStatus): string {
  switch (s) {
    case "enroute":   return "#3b82f6";
    case "onsite":    return "#10b981";
    case "returning": return "#e2e8f0";
    case "idle":      return "#94a3b8";
  }
}

export function statusLabel(s: DerivedStatus): string {
  switch (s) {
    case "enroute":   return "EN ROUTE";
    case "onsite":    return "ON SITE";
    case "returning": return "RETURNING";
    case "idle":      return "IDLE";
  }
}

export function woRingColor(extendedStatus: string | null | undefined): string {
  switch (extendedStatus) {
    case "open_unassigned":
    case "open_unassigned_warning":
      return "#ef4444";
    case "open_unassigned_dispatched":
      return "#f97316";
    case "open_assigned":
      return "#3b82f6";
    case "in_progress":
      return "#10b981";
    case "completed":
    case "pending_closed":
      return "#64748b";
    default:
      return "#64748b";
  }
}

export function timeAgo(iso: string): string {
  const sec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
