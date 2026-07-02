export type CatalogAgent = {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  automates: string;
  logicSummary: string;
  idealFor: string[];
  notIdealFor: string[];
  useCases: string[];
};

export const PRIMARY_GOAL_OPTIONS = [
  "Improve field technician productivity and dispatch efficiency",
  "Monitor fleet, jobs, and technicians in one place",
  "Reduce compliance risk, violations, and missed deadlines",
  "Automate data quality checks and work order validation",
  "Verify technician time, overtime, and site attendance",
] as const;

export const AGENT_CATALOG: CatalogAgent[] = [
  {
    id: "dawn",
    name: "Dawn",
    role: "Daily Data Check",
    category: "Data Quality",
    description:
      "Runs every morning before work hours, scanning open work orders for bad or incomplete data before scheduling or dispatch.",
    automates:
      "Work order validation, missing-field detection, daily error reports to managers",
    logicSummary:
      "Pulls open work orders from CMMS (e.g. Rail Redi), flags missing call type, assignee, location, or status mismatches, logs each issue with WO # and client name, emails a daily summary.",
    idealFor: [
      "Field service with CMMS/work order sync",
      "Operations with recurring data entry errors",
      "Teams that dispatch from incomplete records",
    ],
    notIdealFor: [
      "Pure software/SaaS with no work orders",
      "Companies without field operations or CMMS",
    ],
    useCases: ["data-quality", "automation", "monitoring"],
  },
  {
    id: "iris",
    name: "Iris",
    role: "Idle Monitoring",
    category: "Fleet",
    description:
      "Monitors technician trucks via GPS, alerting when vehicles idle too long with engine on during active hours.",
    automates:
      "Idle detection, automated technician callbacks via n8n, live fleet status dashboard",
    logicSummary:
      "Tracks ~41 linked IntelliShift trucks, checks every ~2 min during 8am–1am ET. Alerts when engine on, speed ≤2 mph, idle ≥8 min, GPS fresh. Calls tech work cell for pending alerts. Statuses: alert threshold, idling, moving, parked, stale GPS, not trackable.",
    idealFor: [
      "Fleet of field technicians with GPS tracking",
      "Operations concerned about idle time and fuel waste",
      "Supervisors needing live truck visibility",
    ],
    notIdealFor: [
      "Remote-only teams with no vehicles",
      "Office-based businesses without fleet",
    ],
    useCases: ["monitoring", "productivity", "fleet"],
  },
  {
    id: "molly",
    name: "Molly",
    role: "Checkout Compliance",
    category: "Compliance",
    description:
      "Verifies technicians stay on site after check-in by geofencing truck GPS against job site boundaries.",
    automates:
      "Geofence monitoring, tiered off-site alerts, automated technician calls",
    logicSummary:
      "Triggers on Rail Redi check-in + IntelliShift truck link. Requires truck within ~0.5 mi to confirm arrival. Saves parking spot, monitors ~0.2 mi zone. Alert tiers at 0.3/0.5/0.7 mi past boundary. n8n calls tech if they leave without checkout. Labels: off-site check-in, left site, not trackable.",
    idealFor: [
      "Field service with check-in/check-out workflows",
      "Companies losing billable time to drive-offs",
      "GPS-tracked technician fleets",
    ],
    notIdealFor: [
      "No physical job sites or truck tracking",
      "Fully remote service models",
    ],
    useCases: ["compliance", "monitoring", "productivity"],
  },
  {
    id: "dex",
    name: "Dex",
    role: "Emergency Dispatch",
    category: "Dispatch",
    description:
      "Helps managers dispatch the nearest available maintenance technician to emergencies without switching apps.",
    automates:
      "Real-time tech map, availability ranking, one-click emergency assignment",
    logicSummary:
      "Receives emergency notifications from CMMS. Ranks nearby techs by drive time and availability (Available/Busy/Blocked). Manager assigns best match in one click. Blocked = no GPS or wrong county cert.",
    idealFor: [
      "Emergency maintenance or break-fix operations",
      "Multi-tech field teams needing fast response",
      "Dispatchers juggling multiple systems",
    ],
    notIdealFor: [
      "Scheduled-only work with no emergencies",
      "Single-tech operations",
    ],
    useCases: ["dispatch", "productivity", "monitoring"],
  },
  {
    id: "vera",
    name: "Vera",
    role: "Violations Manager",
    category: "Compliance",
    description:
      "Tracks building violations (e.g. FDNY) to ensure repairs complete before court dates and fines hit.",
    automates:
      "Violation tracking, hearing deadlines, work order linking, status updates until closed",
    logicSummary:
      "Logs site, issue, compliance deadline, hearing date. Flags urgent: hearing within 14 days, compliance overdue. Status flow: need proposal → in progress → work completed → closed.",
    idealFor: [
      "Property/facility management with regulatory violations",
      "Building maintenance with court hearing deadlines",
      "Compliance-heavy physical operations",
    ],
    notIdealFor: [
      "SaaS or digital-only businesses",
      "No regulatory or violation tracking needs",
    ],
    useCases: ["compliance", "monitoring"],
  },
  {
    id: "ava",
    name: "Ava",
    role: "Overtime Checks",
    category: "Payroll Verification",
    description:
      "Verifies overtime claims by comparing scheduled trips, check-ins, and truck GPS movement.",
    automates:
      "Trip classification, GPS vs on-site time comparison, supported/unsupported/inconclusive verdicts",
    logicSummary:
      "User enters tech name + date. Pulls Rail Redi trips and IntelliShift GPS. Classifies trips: complete, no check-in, no check-out, never arrived. Compares on-site time vs GPS in disputed window. Returns supported, unsupported, or inconclusive.",
    idealFor: [
      "Field teams with overtime disputes",
      "Operations needing GPS proof for payroll",
      "Supervisors reviewing time claims",
    ],
    notIdealFor: [
      "Salaried office teams with no field GPS",
      "No overtime or time-tracking concerns",
    ],
    useCases: ["compliance", "productivity", "automation"],
  },
  {
    id: "harvey",
    name: "Harvey",
    role: "Schedule Survey",
    category: "Scheduling",
    description:
      "Finds open site survey jobs and matches them to trucks with available time after their last stop.",
    automates:
      "Survey-to-truck matching by drive time from last job, dispatcher approval workflow",
    logicSummary:
      "Includes SITE SURVEY call types in Pending/In Progress/Return Trip Needed/Review Needed. Loads truck schedules, finds last job + free time, ranks surveys by nearest drive from last stop, dispatcher approves to book.",
    idealFor: [
      "Field ops with site survey workflows",
      "Dispatchers minimizing wasted miles",
      "Route-fit job assignment",
    ],
    notIdealFor: [
      "No survey or assessment jobs",
      "Centralized depot-only routing",
    ],
    useCases: ["dispatch", "productivity", "automation"],
  },
  {
    id: "cora",
    name: "Cora",
    role: "Inspections & Scheduling",
    category: "Scheduling",
    description:
      "Manages open inspections, due dates, and scheduling across sites and technicians.",
    automates:
      "Inspection tracking, due date alerts, scheduling coordination",
    logicSummary:
      "Covers open inspections, due dates, and scheduling. Part of the operational agent suite for supervisors managing recurring inspection workloads.",
    idealFor: [
      "Facilities with recurring inspections",
      "Multi-site inspection scheduling",
      "Due-date-driven maintenance programs",
    ],
    notIdealFor: [
      "No inspection or audit programs",
      "Ad-hoc-only work with no schedules",
    ],
    useCases: ["monitoring", "compliance", "scheduling"],
  },
  {
    id: "jarvis",
    name: "Jarvis",
    role: "Insights Manager",
    category: "Orchestration",
    description:
      "Central AI manager that answers supervisor questions in plain English by aggregating live data from all operational agents.",
    automates:
      "Unified Q&A across jobs, techs, trucks, schedules, violations, and alerts",
    logicSummary:
      "Head of the AI team. Knows Cora (inspections), Dex (emergencies), Harvey (surveys), Vera (violations), Molly (compliance), Iris (idle), Dawn (data gaps), Ava (tech activity). Pulls live facts from CMMS and field data. Only valuable when multiple operational domains need one interface.",
    idealFor: [
      "Supervisors asking cross-system questions",
      "Operations running 2+ specialized agents",
      "Centralize monitoring in one place",
    ],
    notIdealFor: [
      "Single narrow use case with one agent",
      "No field operations data to aggregate",
    ],
    useCases: ["monitoring", "centralization"],
  },
];

export const RELEVANCE_THRESHOLD = 0.65;
export const AUTO_SELECT_THRESHOLD = 0.8;

export function getCatalogAgent(id: string) {
  return AGENT_CATALOG.find((a) => a.id === id);
}

export function catalogForPrompt() {
  return AGENT_CATALOG.map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    description: a.description,
    automates: a.automates,
    logicSummary: a.logicSummary,
    idealFor: a.idealFor,
    notIdealFor: a.notIdealFor,
    useCases: a.useCases,
  }));
}
