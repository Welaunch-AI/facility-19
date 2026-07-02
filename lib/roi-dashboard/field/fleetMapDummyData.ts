// Demo only — data is static except local animation. No network calls.

export interface VehicleDiagnostics {
  is_asset_id: number;
  engine_hours: number | null;
  odometer: number | null;
  fuel_level: number | null;
  mil_lamp_on: boolean | null;
  recorded_at: string;
}

export interface LiveVehicle {
  is_asset_id: number;
  driver_id: number | null;
  driver_name: string | null;
  lat: number;
  lng: number;
  heading_deg: number;
  speed_mph: number;
  engine_on: boolean;
  vehicle_status_id: 10 | 60 | 70 | 80 | 81 | null;
  status_label: string;
  is_speeding: boolean | null;
  speed_limit_mph: number | null;
  address: string | null;
  last_update: string;
  is_stale: boolean;
  stop_duration_sec: number | null;
  stop_duration_human: string | null;
  idle_duration_sec: number | null;
  idle_duration_human: string | null;
  is_main_power_on: boolean | null;
  diagnostics: VehicleDiagnostics | null;
  // When set, overrides derived status. Used to mirror the paired TruckMap truck.
  paired_status?: "enroute" | "onsite" | "returning" | "idle";
}

export type FleetMapWorkOrder = {
  id: number;
  createdAt: string;
  updatedAt: string;
  ageInDays: number;
  problemType: string | null;
  instructions: string | null;
  tradeNames: string | null;
  priority: string | null;
  callType: string | null;
  workOrderType: string | null;
  extendedStatus: string | null;
  extendedStatusText?: string | null;
  extendedStatusColor?: string | null;
  internalStatus: string | null;
  automatedStatusName?: string | null;
  automatedStatusText?: string | null;
  clientInvoiceAmount?: string | null;
  expirationDate: string | null;
  closeDate: string | null;
  serviceDate: string | null;
  unreadNotesCount?: number;
  attachmentsCount?: number;
  companyName: string | null;
  vendorName?: string | null;
  vendorPhone?: string | null;
  vendorEmail?: string | null;
  locationSiteName: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationZip: string | null;
  locationFullAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  locationResolutionStatus?: "resolved" | "unresolved";
  locationResolutionReason?: string | null;
  locationResolutionQuery?: string | null;
  locationResolutionSource?: string | null;
  requiredActionMessage: string | null;
  ucAssignedTradesmanId?: number | null;
  ucWoId?: string | null;
  originSource?: string;
  originRefId?: string | null;
};

const now = () => new Date().toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const DUMMY_LIVE_VEHICLES: LiveVehicle[] = [
  // 3 moving — fresh updates, status_id 10
  {
    is_asset_id: 247201, driver_id: 5101, driver_name: "Marcus Reyes",
    lat: 40.7589, lng: -73.9851, heading_deg: 72, speed_mph: 34, engine_on: true,
    vehicle_status_id: 10, status_label: "Moving", is_speeding: false, speed_limit_mph: 35,
    address: "W 50th St, Manhattan, NY 10019", last_update: now(), is_stale: false,
    stop_duration_sec: null, stop_duration_human: null, idle_duration_sec: null, idle_duration_human: null,
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247201, engine_hours: 1842.5, odometer: 87421, fuel_level: 64, mil_lamp_on: false, recorded_at: now() },
  },
  {
    is_asset_id: 247202, driver_id: 5102, driver_name: "Janelle Park",
    lat: 40.7282, lng: -73.7949, heading_deg: 215, speed_mph: 41, engine_on: true,
    vehicle_status_id: 10, status_label: "Moving", is_speeding: false, speed_limit_mph: 45,
    address: "Queens Blvd, Forest Hills, NY 11375", last_update: now(), is_stale: false,
    stop_duration_sec: null, stop_duration_human: null, idle_duration_sec: null, idle_duration_human: null,
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247202, engine_hours: 2104.2, odometer: 102338, fuel_level: 38, mil_lamp_on: false, recorded_at: now() },
  },
  {
    is_asset_id: 247203, driver_id: 5103, driver_name: "Devon Brooks",
    lat: 40.6782, lng: -73.9442, heading_deg: 305, speed_mph: 28, engine_on: true,
    vehicle_status_id: 10, status_label: "Moving", is_speeding: false, speed_limit_mph: 30,
    address: "Atlantic Ave, Brooklyn, NY 11216", last_update: now(), is_stale: false,
    stop_duration_sec: null, stop_duration_human: null, idle_duration_sec: null, idle_duration_human: null,
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247203, engine_hours: 1503.9, odometer: 71204, fuel_level: 81, mil_lamp_on: false, recorded_at: now() },
  },
  // 2 idle — engine on, low speed
  {
    is_asset_id: 247204, driver_id: 5104, driver_name: "Aisha Thompson",
    lat: 40.8448, lng: -73.8648, heading_deg: 0, speed_mph: 0, engine_on: true,
    vehicle_status_id: 10, status_label: "Idle", is_speeding: false, speed_limit_mph: 30,
    address: "E Fordham Rd, Bronx, NY 10458", last_update: minsAgo(2), is_stale: false,
    stop_duration_sec: 540, stop_duration_human: "9m", idle_duration_sec: 540, idle_duration_human: "9m",
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247204, engine_hours: 1990.1, odometer: 94221, fuel_level: 52, mil_lamp_on: false, recorded_at: minsAgo(2) },
  },
  {
    is_asset_id: 247205, driver_id: 5105, driver_name: "Liam O'Connor",
    lat: 40.5795, lng: -74.1502, heading_deg: 180, speed_mph: 0, engine_on: false,
    vehicle_status_id: 60, status_label: "Stopped", is_speeding: false, speed_limit_mph: 25,
    address: "Hylan Blvd, Staten Island, NY 10305", last_update: minsAgo(8), is_stale: false,
    stop_duration_sec: 1320, stop_duration_human: "22m", idle_duration_sec: 0, idle_duration_human: "0m",
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247205, engine_hours: 1678.4, odometer: 65987, fuel_level: 71, mil_lamp_on: false, recorded_at: minsAgo(8) },
  },
  // long idle (status 81)
  {
    is_asset_id: 247206, driver_id: 5106, driver_name: "Priya Shah",
    lat: 40.7061, lng: -74.0087, heading_deg: 90, speed_mph: 0, engine_on: false,
    vehicle_status_id: 81, status_label: "Long Idle", is_speeding: null, speed_limit_mph: null,
    address: "Wall St, Manhattan, NY 10005", last_update: minsAgo(15), is_stale: false,
    stop_duration_sec: 7200, stop_duration_human: "2h", idle_duration_sec: 7200, idle_duration_human: "2h",
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247206, engine_hours: 2245.0, odometer: 110402, fuel_level: 22, mil_lamp_on: false, recorded_at: minsAgo(15) },
  },
  // MIL lamp on
  {
    is_asset_id: 247207, driver_id: 5107, driver_name: "Carlos Mendez",
    lat: 40.7505, lng: -73.8782, heading_deg: 135, speed_mph: 0, engine_on: false,
    vehicle_status_id: 60, status_label: "Stopped", is_speeding: false, speed_limit_mph: 30,
    address: "Roosevelt Ave, Jackson Heights, NY 11372", last_update: minsAgo(12), is_stale: false,
    stop_duration_sec: 2400, stop_duration_human: "40m", idle_duration_sec: 0, idle_duration_human: "0m",
    is_main_power_on: true,
    diagnostics: { is_asset_id: 247207, engine_hours: 3104.7, odometer: 148229, fuel_level: 14, mil_lamp_on: true, recorded_at: minsAgo(12) },
  },
  // stale / offline
  {
    is_asset_id: 247208, driver_id: 5108, driver_name: "Nelson Alvarado",
    lat: 40.8421, lng: -73.8884, heading_deg: 0, speed_mph: 0, engine_on: false,
    vehicle_status_id: 70, status_label: "Comms Lost", is_speeding: null, speed_limit_mph: null,
    address: "1480 Sheridan Blvd, Bronx, NY 10459", last_update: minsAgo(180), is_stale: true,
    stop_duration_sec: 10800, stop_duration_human: "3h", idle_duration_sec: 0, idle_duration_human: "0m",
    is_main_power_on: false,
    diagnostics: { is_asset_id: 247208, engine_hours: 2094.3, odometer: 131237, fuel_level: 0, mil_lamp_on: false, recorded_at: minsAgo(180) },
  },
];

export const DUMMY_WORK_ORDERS: FleetMapWorkOrder[] = [
  {
    id: 294272, createdAt: minsAgo(720), updatedAt: minsAgo(60), ageInDays: 1,
    problemType: "Sprinkler inspection", instructions: "Weekly and monthly inspections of wet sprinkler system and fire pump.",
    tradeNames: "Building Inspection", priority: "Non-Emergency", callType: "Inspection",
    workOrderType: "Scheduled", extendedStatus: "open_unassigned", internalStatus: "new",
    expirationDate: minsAgo(-7 * 1440), closeDate: null, serviceDate: minsAgo(-1440),
    companyName: "NYU Langone Medical Center", vendorName: "RAEL Maintenance Corp",
    vendorPhone: "+1 212-555-0144", vendorEmail: "dispatch@rael-maint.example",
    locationSiteName: "NYU Langone Medical Center", locationCity: "New York", locationState: "NY",
    locationZip: "10016", locationFullAddress: "377 East 33rd Street, New York, NY 10016",
    locationLat: 40.7434, locationLng: -73.9743, locationResolutionStatus: "resolved",
    requiredActionMessage: "Awaiting assignment", ucWoId: "MM2522", originSource: "utilizecore",
  },
  {
    id: 294275, createdAt: minsAgo(420), updatedAt: minsAgo(45), ageInDays: 0,
    problemType: "HVAC — no cooling", instructions: "RTU-3 not maintaining setpoint. Check refrigerant and compressor.",
    tradeNames: "HVAC", priority: "Emergency", callType: "Service",
    workOrderType: "Reactive", extendedStatus: "open_unassigned_dispatched", internalStatus: "dispatched",
    expirationDate: minsAgo(-1440), closeDate: null, serviceDate: now(),
    companyName: "Brookfield Properties", vendorName: "Apex HVAC",
    locationSiteName: "Brookfield Place", locationCity: "New York", locationState: "NY",
    locationZip: "10281", locationFullAddress: "230 Vesey Street, New York, NY 10281",
    locationLat: 40.7128, locationLng: -74.0150, locationResolutionStatus: "resolved",
    requiredActionMessage: "Tech en route", ucWoId: "MM2531", originSource: "utilizecore",
  },
  {
    id: 294268, createdAt: minsAgo(1800), updatedAt: minsAgo(120), ageInDays: 2,
    problemType: "Plumbing — leak", instructions: "Leak under prep sink, tenant reports water on floor.",
    tradeNames: "Plumbing", priority: "Non-Emergency", callType: "Service",
    workOrderType: "Reactive", extendedStatus: "open_assigned", internalStatus: "assigned",
    expirationDate: minsAgo(-2880), closeDate: null, serviceDate: minsAgo(-720),
    companyName: "Shake Shack", vendorName: "Liberty Plumbing Co",
    locationSiteName: "Shake Shack — Madison Sq", locationCity: "New York", locationState: "NY",
    locationZip: "10010", locationFullAddress: "Madison Square Park, New York, NY 10010",
    locationLat: 40.7414, locationLng: -73.9881, locationResolutionStatus: "resolved",
    requiredActionMessage: "Assigned to Marcus Reyes", ucWoId: "MM2540", originSource: "utilizecore",
  },
  {
    id: 294270, createdAt: minsAgo(2400), updatedAt: minsAgo(15), ageInDays: 2,
    problemType: "Electrical — breaker tripping", instructions: "Main panel breaker tripping intermittently — diagnose load.",
    tradeNames: "Electrical", priority: "Non-Emergency", callType: "Service",
    workOrderType: "Reactive", extendedStatus: "in_progress", internalStatus: "in_progress",
    expirationDate: minsAgo(-1440), closeDate: null, serviceDate: minsAgo(-180),
    companyName: "Equinox", vendorName: "Volt Bros Electric",
    locationSiteName: "Equinox Bryant Park", locationCity: "New York", locationState: "NY",
    locationZip: "10018", locationFullAddress: "54 W 40th St, New York, NY 10018",
    locationLat: 40.7536, locationLng: -73.9832, locationResolutionStatus: "resolved",
    requiredActionMessage: "Tech on site", ucWoId: "MM2548", originSource: "utilizecore",
  },
  {
    id: 294260, createdAt: minsAgo(4320), updatedAt: minsAgo(360), ageInDays: 3,
    problemType: "Refrigeration — walk-in", instructions: "Walk-in cooler not holding temp. Replaced fan motor — verify performance.",
    tradeNames: "Refrigeration", priority: "Non-Emergency", callType: "Service",
    workOrderType: "Reactive", extendedStatus: "completed", internalStatus: "completed",
    expirationDate: minsAgo(-720), closeDate: minsAgo(120), serviceDate: minsAgo(360),
    clientInvoiceAmount: "842.50",
    companyName: "Whole Foods Market", vendorName: "ColdChain Services",
    locationSiteName: "Whole Foods — Tribeca", locationCity: "New York", locationState: "NY",
    locationZip: "10013", locationFullAddress: "270 Greenwich St, New York, NY 10013",
    locationLat: 40.7170, locationLng: -74.0107, locationResolutionStatus: "resolved",
    requiredActionMessage: "Awaiting invoice approval", ucWoId: "MM2511", originSource: "utilizecore",
  },
  {
    id: 294255, createdAt: minsAgo(5760), updatedAt: minsAgo(720), ageInDays: 4,
    problemType: "Door — auto slider", instructions: "Front auto-slider sensor sticking. Recalibrate and test 50 cycles.",
    tradeNames: "General Maintenance", priority: "Non-Emergency", callType: "Service",
    workOrderType: "Reactive", extendedStatus: "pending_closed", internalStatus: "pending_close",
    expirationDate: minsAgo(-1440), closeDate: minsAgo(720), serviceDate: minsAgo(1440),
    clientInvoiceAmount: "315.00",
    companyName: "Duane Reade", vendorName: "MetroDoor Services",
    locationSiteName: "Duane Reade — Astor Pl", locationCity: "New York", locationState: "NY",
    locationZip: "10003", locationFullAddress: "4 Astor Pl, New York, NY 10003",
    locationLat: 40.7295, locationLng: -73.9913, locationResolutionStatus: "resolved",
    requiredActionMessage: "Pending client sign-off", ucWoId: "MM2502", originSource: "utilizecore",
  },
];
