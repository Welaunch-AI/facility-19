import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LiveVehicle, FleetMapWorkOrder } from "@/lib/roi-dashboard/field/fleetMapDummyData";
import { buildTruckIcon } from "./TruckMarker";
import { buildWoIcon } from "./WorkOrderMarker";

export type Basemap = "dark" | "satellite";
export type Scope = "fleet" | "jobs" | "both";

interface Props {
  vehicles: LiveVehicle[];
  workOrders: FleetMapWorkOrder[];
  selectedVehicleId: number | null;
  selectedWoId: number | null;
  onSelectVehicle: (id: number | null) => void;
  onSelectWo: (id: number | null) => void;
  basemap: Basemap;
  scope: Scope;
  fitSignal: number;
}

function FitBoundsController({
  vehicles, workOrders, scope, fitSignal,
}: { vehicles: LiveVehicle[]; workOrders: FleetMapWorkOrder[]; scope: Scope; fitSignal: number }) {
  const map = useMap();
  useEffect(() => {
    if (fitSignal === 0) return;
    const pts: [number, number][] = [];
    if (scope !== "jobs") vehicles.forEach((v) => pts.push([v.lat, v.lng]));
    if (scope !== "fleet")
      workOrders.forEach((w) => {
        if (w.locationLat && w.locationLng) pts.push([w.locationLat, w.locationLng]);
      });
    if (pts.length === 0) return;
    map.fitBounds(L.latLngBounds(pts), { padding: [80, 80] });
  }, [fitSignal, map, scope, vehicles, workOrders]);
  return null;
}

function FlyToSelected({ vehicle }: { vehicle: LiveVehicle | null }) {
  const map = useMap();
  useEffect(() => {
    if (!vehicle) return;
    map.flyTo([vehicle.lat, vehicle.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
  }, [vehicle, map]);
  return null;
}

export function FleetMapCanvas({
  vehicles, workOrders, selectedVehicleId, selectedWoId,
  onSelectVehicle, onSelectWo, basemap, scope, fitSignal,
}: Props) {
  const tile = useMemo(() => {
    if (basemap === "satellite") {
      return {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      };
    }
    return {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "© OpenStreetMap contributors, © CARTO",
    };
  }, [basemap]);

  const selectedVehicle = vehicles.find((v) => v.is_asset_id === selectedVehicleId) ?? null;

  return (
    <MapContainer
      center={[40.74, -73.95]}
      zoom={11}
      scrollWheelZoom
      className="fleet-map-leaflet fleet-map-tiles-dark"
      zoomControl={false}
    >
      <TileLayer key={basemap} url={tile.url} attribution={tile.attribution} />
      {(scope !== "jobs") && vehicles.map((v) => (
        <Marker
          key={`v-${v.is_asset_id}`}
          position={[v.lat, v.lng]}
          icon={buildTruckIcon(v, v.is_asset_id === selectedVehicleId)}
          eventHandlers={{ click: () => onSelectVehicle(v.is_asset_id) }}
        />
      ))}
      {(scope !== "fleet") && workOrders.map((w) =>
        w.locationLat && w.locationLng ? (
          <Marker
            key={`w-${w.id}`}
            position={[w.locationLat, w.locationLng]}
            icon={buildWoIcon(w, w.id === selectedWoId)}
            eventHandlers={{ click: () => onSelectWo(w.id) }}
          />
        ) : null,
      )}
      <FitBoundsController vehicles={vehicles} workOrders={workOrders} scope={scope} fitSignal={fitSignal} />
      <FlyToSelected vehicle={selectedVehicle} />
    </MapContainer>
  );
}
