import { useEffect } from "react";
import type { LiveVehicle } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { useField } from "@/lib/roi-dashboard/field/store";

const TICK_MS = 2000;

// Sync leaflet vehicle motion with the field store's truck tick (every 2s)
// AND mirror each truck's status onto its paired leaflet vehicle, so both
// maps share one vocabulary (en route / on site / returning / idle).
export function useVehicleMotion(
  vehicles: LiveVehicle[],
  setVehicles: React.Dispatch<React.SetStateAction<LiveVehicle[]>>,
) {
  const { trucks, paused } = useField();

  useEffect(() => {
    if (paused) return;
    if (typeof document !== "undefined" && document.hidden) return;

    setVehicles((prev) =>
      prev.map((v, i) => {
        const truck = trucks[i % trucks.length];
        const status = truck?.status ?? v.paired_status ?? "idle";
        let { lat, lng, heading_deg } = v;

        if (status === "enroute") {
          const headingRad = (heading_deg * Math.PI) / 180;
          const milesPerTick = (Math.max(20, v.speed_mph || 30) * TICK_MS) / 3_600_000;
          const dLat = (Math.cos(headingRad) * milesPerTick) / 69;
          const dLng =
            (Math.sin(headingRad) * milesPerTick) /
            (69 * Math.max(0.1, Math.cos((lat * Math.PI) / 180)));
          lat += dLat;
          lng += dLng;
          heading_deg = (heading_deg + (Math.random() * 10 - 5) + 360) % 360;
        }

        return {
          ...v,
          lat,
          lng,
          heading_deg,
          paired_status: status,
          last_update: new Date().toISOString(),
        };
      }),
    );
  }, [trucks, paused, setVehicles]);

  void vehicles;
}
