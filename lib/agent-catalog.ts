import { AGENT_CLUSTERS, RAW_AGENT_CATALOG } from "@/lib/agent-catalog-data";

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

const CLUSTER_META: Record<
  string,
  Pick<CatalogAgent, "idealFor" | "notIdealFor" | "useCases">
> = {
  "Field Operations": {
    idealFor: [
      "Dispatched field technicians and CMMS work orders",
      "Multi-tech routing with GPS and check-in workflows",
      "Operations needing dispatch, ETA, and after-hours coverage",
    ],
    notIdealFor: [
      "Remote-only software companies with no field crews",
      "Businesses without physical job sites or service trucks",
    ],
    useCases: ["dispatch", "productivity", "monitoring", "compliance"],
  },
  "Fleet & Violations": {
    idealFor: [
      "GPS-tracked service fleets",
      "Operations with parking, traffic, or vehicle compliance exposure",
      "Dispatch teams optimizing routes across multiple trucks",
    ],
    notIdealFor: ["No company vehicles", "Office-only teams without fleet assets"],
    useCases: ["fleet", "monitoring", "compliance", "dispatch"],
  },
  "Payroll & Timekeeping": {
    idealFor: [
      "Field teams with overtime disputes or time-card reconciliation",
      "Operations comparing GPS time to logged hours",
      "Supervisors reviewing end-of-day checkout compliance",
    ],
    notIdealFor: [
      "Salaried office teams with no field time tracking",
      "No payroll or labor-cost visibility requirements",
    ],
    useCases: ["compliance", "productivity", "automation"],
  },
  "Expense & Spend": {
    idealFor: [
      "Field ops with fuel cards, Amex, or parts purchasing",
      "Finance teams needing spend controls tied to jobs",
      "Operations with PO approval thresholds",
    ],
    notIdealFor: ["No corporate cards or parts purchasing", "Pre-revenue startups with minimal spend"],
    useCases: ["automation", "compliance", "finance"],
  },
  "Contracts, Renewals & NTE": {
    idealFor: [
      "Property and facility management with vendor COI requirements",
      "Client contracts with NTE or approval gates",
      "Regulatory filing obligations (EPA, OSHA, FDNY, local)",
    ],
    notIdealFor: ["No vendor contracts or insurance compliance", "Simple B2C with no NTE workflows"],
    useCases: ["compliance", "contracts", "risk"],
  },
  "Field Compliance & Inspections": {
    idealFor: [
      "Recurring inspections and PM programs",
      "Asset tagging and deficiency-to-proposal workflows",
      "Post-job documentation and lien waiver collection",
    ],
    notIdealFor: ["No inspection or asset compliance programs", "Ad-hoc-only work with no schedules"],
    useCases: ["compliance", "inspections", "scheduling"],
  },
  "Inventory, Parts & Assets": {
    idealFor: [
      "CMMS asset records and parts-heavy trades",
      "Stockrooms needing reorder triggers",
      "Work orders requiring full lifecycle tracking to billing",
    ],
    notIdealFor: ["No parts inventory or asset registry", "Digital-only services without equipment"],
    useCases: ["inventory", "assets", "automation"],
  },
  "Vendor Management": {
    idealFor: [
      "Subcontractor-heavy field operations",
      "Vendor onboarding with COI, licence, and W-9 collection",
      "Multi-vendor dispatch with performance scoring",
    ],
    notIdealFor: ["Fully in-house crews with no subcontractors", "No vendor invoice disputes"],
    useCases: ["vendors", "compliance", "operations"],
  },
  "Finance & Billing": {
    idealFor: [
      "Operations reconciling vendor invoices to completed jobs",
      "AR teams chasing client payments on service contracts",
      "Billing accuracy and rate validation by trade/region",
    ],
    notIdealFor: ["No vendor payables or client invoicing", "Pre-billing SaaS subscription models only"],
    useCases: ["finance", "billing", "collections"],
  },
  "Customer Service & Retention": {
    idealFor: [
      "High-volume inbound customer status inquiries",
      "Account managers focused on retention and upsell",
      "Operations wanting daily scorecards without building dashboards",
    ],
    notIdealFor: ["Low-touch B2B with no end-customer contact", "No post-service follow-up process"],
    useCases: ["customer-service", "retention", "analytics"],
  },
  "HR & Workforce": {
    idealFor: [
      "Growing field teams with technician hiring needs",
      "Operations with seasonal demand and overtime spikes",
      "Workforce planning across multiple sites or trades",
    ],
    notIdealFor: ["Stable headcount with no field hiring", "Fully outsourced labor with no internal roster"],
    useCases: ["hr", "workforce", "planning"],
  },
  "Oversight & Intelligence": {
    idealFor: [
      "Deployments running multiple operational agents",
      "Enterprises needing audit trails and SLA governance",
      "Teams building a Combat Room knowledge base before scaling agents",
    ],
    notIdealFor: [
      "Single narrow use case with one agent only",
      "No operational data to aggregate or audit",
    ],
    useCases: ["oversight", "audit", "orchestration"],
  },
};

function buildCatalogAgent(raw: (typeof RAW_AGENT_CATALOG)[number]): CatalogAgent {
  const meta = CLUSTER_META[raw.category] ?? {
    idealFor: ["Facility and field operations"],
    notIdealFor: ["Non-operational digital-only businesses"],
    useCases: ["operations"],
  };
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    category: raw.category,
    description: raw.description,
    automates: raw.description,
    logicSummary: raw.description,
    idealFor: meta.idealFor,
    notIdealFor: meta.notIdealFor,
    useCases: meta.useCases,
  };
}

export const PRIMARY_GOAL_OPTIONS = [
  "Improve field technician productivity and dispatch efficiency",
  "Monitor fleet, jobs, and technicians in one place",
  "Reduce compliance risk, violations, and missed deadlines",
  "Automate payroll verification, overtime, and timekeeping",
  "Streamline vendor onboarding, COI, and subcontractor performance",
  "Improve billing accuracy, AR collections, and invoice reconciliation",
  "Strengthen customer service, retention, and post-job follow-up",
  "Optimize inventory, parts, and asset lifecycle management",
] as const;

export const AGENT_CATALOG: CatalogAgent[] = RAW_AGENT_CATALOG.map(buildCatalogAgent);

export const MIN_USE_CASE_THRESHOLD = 0.35;
export const RELEVANCE_THRESHOLD = MIN_USE_CASE_THRESHOLD;
export const AUTO_SELECT_THRESHOLD = 0.8;
export const MAX_RECOMMENDATIONS = 49;

export function getCatalogAgent(id: string) {
  return AGENT_CATALOG.find((a) => a.id === id);
}

export function getAgentsByCategory(category: string) {
  return AGENT_CATALOG.filter((a) => a.category === category);
}

export function catalogForPrompt() {
  return AGENT_CATALOG.map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    category: a.category,
    description: a.description,
    idealFor: a.idealFor,
    notIdealFor: a.notIdealFor,
    useCases: a.useCases,
  }));
}

export function catalogClusterSummary() {
  return AGENT_CLUSTERS.map((cluster) => ({
    cluster,
    agentCount: getAgentsByCategory(cluster).length,
    agents: getAgentsByCategory(cluster).map((a) => `${a.id} (${a.name})`),
  }));
}
