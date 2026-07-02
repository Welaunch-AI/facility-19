import L from "leaflet";
import { computeVehicleStatus, statusColor } from "@/lib/roi-dashboard/field/computeVehicleStatus";
import type { LiveVehicle } from "@/lib/roi-dashboard/field/fleetMapDummyData";

export function buildTruckIcon(v: LiveVehicle, selected: boolean): L.DivIcon {
  const status = computeVehicleStatus(v);
  const color = statusColor(status);
  const heading = v.heading_deg ?? 0;
  const fuel = v.diagnostics?.fuel_level;
  const ring = status === "enroute" ? `<span class="ring"></span>` : "";
  const sel = selected ? `<span class="ring-sel"></span>` : "";
  const fuelArc =
    typeof fuel === "number"
      ? `<svg width="36" height="36" viewBox="0 0 36 36" style="position:absolute; inset:-4px; transform: rotate(-90deg);">
           <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
           <circle cx="18" cy="18" r="15" fill="none" stroke="${color}" stroke-width="2"
             stroke-dasharray="${(fuel / 100) * 94.2} 94.2" stroke-linecap="round"/>
         </svg>`
      : "";
  const html = `
    <div class="truck-marker ${selected ? "selected" : ""}" style="color:${color}">
      ${ring}${sel}${fuelArc}
      <div class="chevron" style="transform: rotate(${heading}deg)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 15 12 9 18 15"/>
        </svg>
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: "fleet-truck-divicon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
