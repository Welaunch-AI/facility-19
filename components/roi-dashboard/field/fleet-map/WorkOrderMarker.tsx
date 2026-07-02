import L from "leaflet";
import { woRingColor } from "@/lib/roi-dashboard/field/computeVehicleStatus";
import type { FleetMapWorkOrder } from "@/lib/roi-dashboard/field/fleetMapDummyData";

export function buildWoIcon(wo: FleetMapWorkOrder, selected: boolean): L.DivIcon {
  const color = woRingColor(wo.extendedStatus);
  const emergency = wo.priority?.toLowerCase() === "emergency" ? "emergency" : "";
  const sel = selected
    ? `box-shadow: 0 0 0 2px #22d3ee, 0 0 14px rgba(34,211,238,0.6);`
    : "";
  const html = `<div class="wo-marker ${emergency}" style="color:${color};${sel}"></div>`;
  return L.divIcon({
    html,
    className: "fleet-wo-divicon",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
