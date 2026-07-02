import {
  getAgentsByCategory,
  PRIMARY_GOAL_OPTIONS,
} from "@/lib/agent-catalog";
import type { BusinessProfile } from "@/lib/workspaces";

const PRIMARY_GOAL_CLUSTER_MAP: Record<string, string[]> = {
  "Improve field technician productivity and dispatch efficiency": ["Field Operations"],
  "Monitor fleet, jobs, and technicians in one place": [
    "Field Operations",
    "Fleet & Violations",
    "Oversight & Intelligence",
  ],
  "Reduce compliance risk, violations, and missed deadlines": [
    "Field Compliance & Inspections",
    "Contracts, Renewals & NTE",
    "Fleet & Violations",
    "Oversight & Intelligence",
  ],
  "Automate payroll verification, overtime, and timekeeping": ["Payroll & Timekeeping"],
  "Streamline vendor onboarding, COI, and subcontractor performance": [
    "Vendor Management",
    "Contracts, Renewals & NTE",
  ],
  "Improve billing accuracy, AR collections, and invoice reconciliation": [
    "Finance & Billing",
  ],
  "Strengthen customer service, retention, and post-job follow-up": [
    "Customer Service & Retention",
  ],
  "Optimize inventory, parts, and asset lifecycle management": [
    "Inventory, Parts & Assets",
    "Field Compliance & Inspections",
  ],
};

export type UserGoalSignals = {
  sixtyDayGoal: string;
  primaryGoals: string[];
  customGoal: string;
  allGoalText: string;
  indicatesFacilityOps: boolean;
  matchedPrimaryGoals: string[];
  clusterHints: string[];
  agentHints: string[];
  outcomeThemes: string[];
  wantsMonitoring: boolean;
};

export { PRIMARY_GOAL_CLUSTER_MAP };

const FACILITY_OPS_GOAL_PATTERNS = [
  /\btechnician/i,
  /\bdispatch/i,
  /\bfleet\b/i,
  /\bfield\b/i,
  /\bcmms\b/i,
  /\bwork order/i,
  /\bcompliance\b/i,
  /\bviolation/i,
  /\bpayroll\b/i,
  /\bovertime\b/i,
  /\bvendor\b/i,
  /\bsubcontractor/i,
  /\bcoi\b/i,
  /\bbilling\b/i,
  /\binvoice/i,
  /\bar\b/i,
  /\bcollections\b/i,
  /\bcustomer service\b/i,
  /\bretention\b/i,
  /\binventory\b/i,
  /\bparts\b/i,
  /\basset/i,
  /\binspection/i,
  /\bmaintenance\b/i,
  /\bhvac\b/i,
  /\bplumb/i,
  /\bproperty management\b/i,
  /\bfacility\b/i,
];

const OUTCOME_THEME_PATTERNS: Array<{ theme: string; pattern: RegExp; clusters: string[] }> =
  [
    {
      theme: "profitability and margin",
      pattern: /\b(profit|margin|revenue|cash flow|cost control|reduce cost|save money)\b/i,
      clusters: ["Finance & Billing", "Expense & Spend", "Field Operations"],
    },
    {
      theme: "efficiency and productivity",
      pattern: /\b(efficien|productiv|faster|throughput|utilization|waste)\b/i,
      clusters: ["Field Operations", "Fleet & Violations", "Payroll & Timekeeping"],
    },
    {
      theme: "visibility and monitoring",
      pattern: /\b(monitor|visibility|dashboard|scorecard|one place|real.?time|track)\b/i,
      clusters: ["Oversight & Intelligence", "Field Operations", "Fleet & Violations"],
    },
    {
      theme: "risk and compliance",
      pattern: /\b(compliance|risk|violation|audit|deadline|penalt|fine)\b/i,
      clusters: [
        "Field Compliance & Inspections",
        "Contracts, Renewals & NTE",
        "Oversight & Intelligence",
      ],
    },
    {
      theme: "hiring and workforce",
      pattern: /\b(hiring|recruit|workforce|staffing|overtime|labor)\b/i,
      clusters: ["HR & Workforce", "Payroll & Timekeeping"],
    },
  ];

const MONITORING_PATTERNS =
  /\bmonitor|one place|central|scorecard|dashboard|analytics|visibility|real.?time\b/i;

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function agentsForClusters(clusters: string[]): string[] {
  return unique(clusters.flatMap((cluster) => getAgentsByCategory(cluster).map((a) => a.id)));
}

export function extractUserGoalSignals(
  bp: Pick<BusinessProfile, "sixty_day_goal" | "primary_goals" | "custom_goal">,
): UserGoalSignals {
  const sixtyDayGoal = bp.sixty_day_goal?.trim() ?? "";
  const primaryGoals = bp.primary_goals ?? [];
  const customGoal = bp.custom_goal?.trim() ?? "";
  const allGoalText = [sixtyDayGoal, ...primaryGoals, customGoal].filter(Boolean).join("\n");

  const matchedPrimaryGoals = primaryGoals.filter((goal) =>
    (PRIMARY_GOAL_OPTIONS as readonly string[]).includes(goal),
  );

  const clusterHints: string[] = [];
  for (const goal of matchedPrimaryGoals) {
    const clusters = PRIMARY_GOAL_CLUSTER_MAP[goal];
    if (clusters) clusterHints.push(...clusters);
  }

  const outcomeThemes: string[] = [];
  for (const { theme, pattern, clusters } of OUTCOME_THEME_PATTERNS) {
    if (pattern.test(allGoalText)) {
      outcomeThemes.push(theme);
      clusterHints.push(...clusters);
    }
  }

  const uniqueClusters = unique(clusterHints);
  const agentHints = agentsForClusters(uniqueClusters);

  const freeTextFacilityOps = FACILITY_OPS_GOAL_PATTERNS.some((p) => p.test(allGoalText));
  const indicatesFacilityOps =
    matchedPrimaryGoals.length > 0 || freeTextFacilityOps;

  const wantsMonitoring =
    MONITORING_PATTERNS.test(allGoalText) ||
    matchedPrimaryGoals.some((g) =>
      PRIMARY_GOAL_CLUSTER_MAP[g]?.includes("Oversight & Intelligence"),
    );

  return {
    sixtyDayGoal,
    primaryGoals,
    customGoal,
    allGoalText,
    indicatesFacilityOps,
    matchedPrimaryGoals,
    clusterHints: uniqueClusters,
    agentHints,
    outcomeThemes: unique(outcomeThemes),
    wantsMonitoring,
  };
}

export function userGoalsContextForPrompt(signals: UserGoalSignals): string {
  const lines = [
    "=== USER-STATED GOALS (PRIMARY INPUT — do not ignore) ===",
    `60-day goal: ${signals.sixtyDayGoal || "not provided"}`,
    `Primary goals selected: ${signals.primaryGoals.length ? signals.primaryGoals.join(" | ") : "none"}`,
    `Custom goal: ${signals.customGoal || "none"}`,
  ];

  if (signals.matchedPrimaryGoals.length) {
    lines.push(
      `Mapped primary goals → clusters: ${signals.matchedPrimaryGoals
        .map((goal) => {
          const clusters = PRIMARY_GOAL_CLUSTER_MAP[goal]?.join(", ") ?? "";
          return `"${goal}" → ${clusters}`;
        })
        .join("; ")}`,
    );
  }

  if (signals.outcomeThemes.length) {
    lines.push(`Outcome themes in free text: ${signals.outcomeThemes.join(", ")}`);
  }

  if (signals.clusterHints.length) {
    lines.push(`Priority clusters from user input: ${signals.clusterHints.join(", ")}`);
  }

  if (signals.agentHints.length) {
    lines.push(
      `All catalog agents in priority clusters (include each with any use case — do not skip): ${signals.agentHints.join(", ")}`,
    );
  }

  lines.push(
    "Weighting: User goals outweigh ambiguous website data. Return every agent with any plausible use case (score 0.35+). Omit only when notIdealFor clearly blocks the company.",
  );

  return lines.join("\n");
}
