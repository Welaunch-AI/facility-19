import { getCatalogAgent } from "@/lib/agent-catalog";
import type { BusinessProfile } from "@/lib/workspaces";

export const VISION_ROADMAP_VERSION = 2;

export type VisionRoadmapPainPoint = {
  title: string;
  description: string;
  impact?: string;
};

export type VisionRoadmapPriority = {
  title: string;
  rationale: string;
  initiatives: string[];
};

export type VisionRoadmapAgent = {
  id: string;
  name: string;
  role: string;
  painPoint: string;
  solution: string;
  outcome: string;
  deployPhase: "foundation" | "30" | "60" | "90";
};

export type VisionRoadmapPhase = {
  day: "30" | "60" | "90";
  title: string;
  focus: string;
  milestones: string[];
  successCriteria: string[];
  agentNames: string[];
};

export type VisionRoadmapReadinessItem = {
  category: string;
  title: string;
  detail: string;
};

export type VisionRoadmapMetric = {
  label: string;
  target: string;
  description: string;
};

export type VisionRoadmapDocument = {
  version: number;
  title: string;
  subtitle: string;
  companyName: string;
  domain?: string;
  narrative: string;
  baseline: {
    headline: string;
    summary: string;
    painPoints: VisionRoadmapPainPoint[];
  };
  northStar: {
    goal: string;
    summary: string;
    aims: string[];
  };
  strategicPriorities: VisionRoadmapPriority[];
  agents: VisionRoadmapAgent[];
  phases: VisionRoadmapPhase[];
  executionReadiness: {
    headline: string;
    summary: string;
    items: VisionRoadmapReadinessItem[];
  };
  outcomes: {
    headlineMetric: string;
    summary: string;
    metrics: VisionRoadmapMetric[];
  };
};

type RawRoadmap = Partial<VisionRoadmapDocument> & {
  strategicPriorities?: Partial<VisionRoadmapPriority>[];
  agents?: Partial<VisionRoadmapAgent>[];
  phases?: Partial<VisionRoadmapPhase>[];
  executionReadiness?: Partial<VisionRoadmapDocument["executionReadiness"]> & {
    items?: Partial<VisionRoadmapReadinessItem>[];
  };
};

function uniqueStrings(values: Array<string | undefined | null>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

function sentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function firstWords(values: string[], count: number) {
  return values.filter(Boolean).slice(0, count);
}

function fallbackPainPoints(
  bp: BusinessProfile,
  workspaceName: string,
  selectedIds: string[],
) {
  const recommended = (bp.recommended_details ?? [])
    .filter((detail) => selectedIds.includes(detail.id))
    .slice(0, 4)
    .map((detail) => ({
      title: detail.name.replace(/\s+Agent$/i, ""),
      description: sentence(detail.problemSolved || detail.description),
      impact: detail.goalMapping ? sentence(detail.goalMapping) : undefined,
    }));

  if (recommended.length) return recommended;

  const goals = firstWords(bp.primary_goals ?? [], 4);
  if (goals.length) {
    return goals.map((goal, index) => ({
      title: `Priority ${index + 1}`,
      description: sentence(goal),
      impact: sentence(`This directly affects ${workspaceName}'s 60-day operating target.`),
    }));
  }

  return [
    {
      title: "Operational visibility",
      description: `Leadership needs a clearer picture of the workflows, handoffs, and service operations that drive ${workspaceName}.`,
      impact: "Without a shared baseline, teams struggle to prioritize the highest-leverage improvements.",
    },
    {
      title: "Manual coordination",
      description: "High-friction scheduling, follow-up, and administrative steps slow down execution and absorb management time.",
      impact: "Time spent coordinating work manually limits throughput and margin expansion.",
    },
    {
      title: "Inconsistent accountability",
      description: "Teams need named owners, success measures, and review cadence to keep the roadmap moving.",
      impact: "A plan without ownership usually creates activity without measurable business results.",
    },
  ];
}

function fallbackAims(bp: BusinessProfile) {
  const aims = uniqueStrings([
    ...(bp.primary_goals ?? []),
    bp.custom_goal,
    bp.sixty_day_goal,
  ]);

  return aims.length
    ? aims.slice(0, 6)
    : [
        "Create a measurable operating baseline for the current business",
        "Automate the highest-friction workflows first",
        "Give leadership weekly visibility into progress and blockers",
        "Connect execution changes to profit, service quality, and capacity",
      ];
}

function fallbackStrategicPriorities(
  bp: BusinessProfile,
  workspaceName: string,
  agentNames: string[],
) {
  const firstAgentNames = agentNames.slice(0, 3);
  const companyOps = uniqueStrings(bp.research?.company_profile?.operations ?? []);
  const operationsText = companyOps.length
    ? companyOps.slice(0, 3).join(", ")
    : "core service delivery";

  return [
    {
      title: "Stabilize the operating baseline",
      rationale: `Map the current ${operationsText} motion so leadership can see where work stalls, where response time slips, and which steps should be automated first.`,
      initiatives: uniqueStrings([
        "Document current-state workflow from intake through completion",
        "Establish baseline KPIs for speed, quality, and capacity",
        firstAgentNames[0]
          ? `Launch ${firstAgentNames[0]} in the first implementation wave`
          : "Identify the first workflow to automate in the first implementation wave",
      ]).slice(0, 3),
    },
    {
      title: "Remove manual bottlenecks",
      rationale: `Use automation to reduce coordination drag, tighten handoffs, and free up manager capacity for higher-value decisions at ${workspaceName}.`,
      initiatives: uniqueStrings([
        firstAgentNames[1]
          ? `Roll out ${firstAgentNames[1]} to the most repetitive admin or coordination task`
          : "Target the most repetitive admin workflow for automation",
        "Define standard operating procedures for the new process",
        "Track hours recovered and cycle-time reduction each week",
      ]).slice(0, 3),
    },
    {
      title: "Turn execution into measurable profit impact",
      rationale: "The roadmap should not stop at activity. Each deployment step needs to show how service execution improves margin, throughput, retention, or compliance.",
      initiatives: uniqueStrings([
        "Build a weekly executive scorecard tied to the 60-day goal",
        "Review operational gains against labor, billing, and service targets",
        firstAgentNames[2]
          ? `Expand ${firstAgentNames[2]} once the first workflows are stable`
          : "Scale successful automations after the first workflows are stable",
      ]).slice(0, 3),
    },
  ];
}

function fallbackPhase(
  day: "30" | "60" | "90",
  goal: string,
  agentNames: string[],
) {
  if (day === "30") {
    return {
      day,
      title: "Foundation and baseline",
      focus: `Days 1-30 focus on making ${goal} executable by locking the baseline, sequencing ownership, and launching the first production workflows.`,
      milestones: uniqueStrings([
        "Complete current-state workflow and data audit",
        "Define owners, escalation paths, and implementation cadence",
        agentNames[0] ? `Deploy ${agentNames[0]} into the first production workflow` : "Deploy the first automation into the highest-friction workflow",
        "Stand up weekly KPI reporting for leadership",
      ]),
      successCriteria: [
        "Baseline metrics are captured and reviewed weekly",
        "At least one high-friction workflow is live in production",
        "The team has a clear owner for each implementation stream",
      ],
      agentNames: agentNames.slice(0, 2),
    };
  }

  if (day === "60") {
    return {
      day,
      title: "Scale and adoption",
      focus: `Days 31-60 expand the initial wins, deepen adoption, and connect automation activity to the operational metrics that matter most for ${goal}.`,
      milestones: uniqueStrings([
        "Expand automation into adjacent workflows and handoffs",
        "Refine SOPs based on field feedback and adoption data",
        agentNames[1] ? `Bring ${agentNames[1]} online for the next operating bottleneck` : "Launch the next wave of workflow automation",
        "Review KPI movement and adjust deployment sequencing",
      ]),
      successCriteria: [
        "The second wave of workflows is active with named owners",
        "Leadership can point to measurable movement in speed, quality, or labor efficiency",
        "Adoption blockers are documented and actively managed",
      ],
      agentNames: agentNames.slice(0, 3),
    };
  }

  return {
    day,
    title: "Optimize and institutionalize",
    focus: "Days 61-90 focus on optimization, governance, and making the roadmap durable so gains continue beyond the first deployment window.",
    milestones: uniqueStrings([
      "Tune automations using live performance data",
      "Formalize governance, scorecards, and monthly review routines",
      agentNames[2] ? `Scale ${agentNames[2]} or the next best-fit agent into steady-state operations` : "Scale the most successful workflow into steady-state operations",
      "Publish the next-quarter expansion roadmap",
    ]),
    successCriteria: [
      "The operating cadence is stable and repeatable",
      "KPIs show sustained improvement from the pre-launch baseline",
      "Leadership has a clear next-quarter scale plan",
    ],
    agentNames,
  };
}

function fallbackReadiness(
  bp: BusinessProfile,
  workspaceName: string,
  agentNames: string[],
) {
  const primaryAgentLabel = agentNames.length ? agentNames.join(", ") : "the selected automations";

  return {
    headline: "Execution readiness checklist",
    summary: `A professional roadmap for ${workspaceName} also needs the operating conditions that let the plan ship on time and stick after launch.`,
    items: [
      {
        category: "Data",
        title: "System access and source-of-truth mapping",
        detail: `Confirm where scheduling, service, customer, billing, and compliance data live before ${primaryAgentLabel} is deployed.`,
      },
      {
        category: "People",
        title: "Named owners and decision rights",
        detail: "Assign an executive sponsor, an operational lead, and workflow owners so implementation decisions do not stall between meetings.",
      },
      {
        category: "Process",
        title: "Standard operating procedures",
        detail: "Document the current workflow, desired future state, and exception paths for the areas being automated first.",
      },
      {
        category: "Governance",
        title: "Weekly KPI and blocker review",
        detail: `Run a standing leadership review tied to ${bp.sixty_day_goal?.trim() || "the 60-day goal"} so progress, risks, and resource decisions stay visible.`,
      },
    ],
  };
}

function fallbackMetrics(bp: BusinessProfile) {
  const goal = bp.sixty_day_goal?.toLowerCase() ?? "";

  const metrics: VisionRoadmapMetric[] = [];

  metrics.push({
    label: "Workflow cycle time",
    target: "-15% to -25%",
    description: "Measures whether the new operating motion is actually removing delay from core processes.",
  });

  if (/billing|invoice|ar|collections|cash/.test(goal)) {
    metrics.push({
      label: "Invoice-to-cash speed",
      target: "-20%",
      description: "Shows whether execution improvements are converting into faster realized revenue.",
    });
  } else {
    metrics.push({
      label: "Admin hours recovered",
      target: "5-10 hrs/week",
      description: "Captures manager and coordinator time returned through automation and cleaner handoffs.",
    });
  }

  if (/compliance|risk|violation|deadline|audit/.test(goal)) {
    metrics.push({
      label: "Compliance completion rate",
      target: ">95%",
      description: "Confirms the roadmap is reducing operational risk and preventing missed obligations.",
    });
  } else {
    metrics.push({
      label: "On-time execution rate",
      target: "+10% to +15%",
      description: "Tracks whether work is being completed more reliably once the new process is live.",
    });
  }

  metrics.push({
    label: "Leadership visibility",
    target: "Weekly scorecard live",
    description: "Ensures the roadmap creates a review rhythm instead of a one-time strategy artifact.",
  });

  return metrics.slice(0, 5);
}

export function hasVisionRoadmapDoc(bp: BusinessProfile): boolean {
  const doc = bp.vision_roadmap_doc;
  return Boolean(
    doc &&
      doc.version === VISION_ROADMAP_VERSION &&
      bp.vision_roadmap_version === VISION_ROADMAP_VERSION,
  );
}

export function roadmapPromptSchema(hasAgents: boolean) {
  return `Return JSON only:
{
  "title": "Roadmap to 100x",
  "subtitle": "Professional one-sentence positioning for this company",
  "narrative": "3-4 sentences explaining the journey from today to the 60-day goal, what changes operationally, and how the roadmap creates measurable business value",
  "baseline": {
    "headline": "Where you are today (1x)",
    "summary": "3-4 sentences grounded in website research and user goals",
    "painPoints": [
      { "title": "short label", "description": "specific operational problem", "impact": "business impact if unresolved" }
    ]
  },
  "northStar": {
    "goal": "quote or paraphrase their exact 60-day goal",
    "summary": "what success looks like in 60 days",
    "aims": ["4-6 specific aims tied to goals and research"]
  },
  "strategicPriorities": [
    {
      "title": "priority name",
      "rationale": "why this matters now",
      "initiatives": ["3 concrete initiatives under this priority"]
    }
  ],
  ${
    hasAgents
      ? `"agents": [
    {
      "id": "exact catalog id from selected list",
      "name": "agent name",
      "role": "role title",
      "painPoint": "specific pain from their operations",
      "solution": "what this agent does for THEM",
      "outcome": "measurable outcome in 60-90 days",
      "deployPhase": "foundation" | "30" | "60" | "90"
    }
  ],`
      : `"agents": [],`
  }
  "phases": [
    {
      "day": "30",
      "title": "phase title",
      "focus": "what happens in this phase and why",
      "milestones": ["4-6 concrete milestones"],
      "successCriteria": ["2-4 checkpoints that prove the phase is complete"],
      "agentNames": ["agents active this phase"]
    },
    {
      "day": "60",
      "title": "phase title",
      "focus": "what happens in this phase and why",
      "milestones": ["4-6 concrete milestones"],
      "successCriteria": ["2-4 checkpoints that prove the phase is complete"],
      "agentNames": ["agents active this phase"]
    },
    {
      "day": "90",
      "title": "phase title",
      "focus": "what happens in this phase and why",
      "milestones": ["4-6 concrete milestones"],
      "successCriteria": ["2-4 checkpoints that prove the phase is complete"],
      "agentNames": ["agents active this phase"]
    }
  ],
  "executionReadiness": {
    "headline": "section headline",
    "summary": "2-3 sentence explanation of what must be in place for the roadmap to succeed",
    "items": [
      { "category": "Data | People | Process | Governance | Systems", "title": "readiness item", "detail": "why it matters and what to do" }
    ]
  },
  "outcomes": {
    "headlineMetric": "one headline KPI e.g. +18% gross margin in 90 days",
    "summary": "closing paragraph tying agents to profit/goals",
    "metrics": [
      { "label": "metric name", "target": "target value", "description": "why it matters" }
    ]
  }
}`;
}

export function normalizeVisionRoadmap(
  raw: RawRoadmap,
  bp: BusinessProfile,
  workspaceName: string,
  selectedIds: string[],
): VisionRoadmapDocument {
  const selectedAgents = selectedIds
    .map((id) => getCatalogAgent(id))
    .filter(Boolean);
  const selectedAgentNames = selectedAgents.map((agent) => agent.name);
  const goal = bp.sixty_day_goal?.trim() || "improve operational performance";
  const researchSummary = bp.research?.summary?.trim();

  const agents: VisionRoadmapAgent[] = (raw.agents ?? [])
    .filter((agent) => agent.id && selectedIds.includes(agent.id))
    .map((agent) => {
      const catalog = getCatalogAgent(agent.id!);
      return {
        id: agent.id!,
        name: agent.name ?? catalog?.name ?? agent.id!,
        role: agent.role ?? catalog?.role ?? "Agent",
        painPoint: sentence(agent.painPoint ?? "Operational friction"),
        solution: sentence(agent.solution ?? catalog?.description ?? "Improves execution in a targeted workflow"),
        outcome: sentence(agent.outcome ?? "Improved efficiency"),
        deployPhase: agent.deployPhase ?? "30",
      };
    });

  for (const catalog of selectedAgents) {
    if (!catalog || agents.some((agent) => agent.id === catalog.id)) continue;
    agents.push({
      id: catalog.id,
      name: catalog.name,
      role: catalog.role,
      painPoint: "Identified during agent matching.",
      solution: sentence(catalog.description),
      outcome: "Supports the 60-day goal with measurable workflow improvement.",
      deployPhase: "30",
    });
  }

  const strategicPriorities = (raw.strategicPriorities ?? [])
    .map((priority) => ({
      title: priority.title?.trim() ?? "",
      rationale: sentence(priority.rationale ?? ""),
      initiatives: uniqueStrings(priority.initiatives ?? []).slice(0, 4),
    }))
    .filter((priority) => priority.title && priority.rationale);

  const phases: VisionRoadmapPhase[] = (["30", "60", "90"] as const).map((day) => {
    const fromRaw = raw.phases?.find((phase) => phase.day === day);
    const fallback = fallbackPhase(day, goal, selectedAgentNames);
    return {
      day,
      title: fromRaw?.title?.trim() || fallback.title,
      focus: sentence(fromRaw?.focus ?? fallback.focus),
      milestones: uniqueStrings(fromRaw?.milestones ?? fallback.milestones).slice(0, 6),
      successCriteria: uniqueStrings(fromRaw?.successCriteria ?? fallback.successCriteria).slice(0, 4),
      agentNames: uniqueStrings(fromRaw?.agentNames ?? fallback.agentNames),
    };
  });

  const executionReadinessFallback = fallbackReadiness(
    bp,
    workspaceName,
    selectedAgentNames,
  );

  const baselinePainPoints = (raw.baseline?.painPoints ?? [])
    .map((point) => ({
      title: point.title?.trim() ?? "",
      description: sentence(point.description ?? ""),
      impact: point.impact ? sentence(point.impact) : undefined,
    }))
    .filter((point) => point.title && point.description)
    .slice(0, 6);

  return {
    version: VISION_ROADMAP_VERSION,
    title: raw.title?.trim() || "Roadmap to 100x",
    subtitle:
      raw.subtitle?.trim() ||
      `Personalized vision for ${bp.domain ?? workspaceName}`,
    companyName: workspaceName,
    domain: bp.domain,
    narrative:
      sentence(raw.narrative ?? "") ||
      `This roadmap connects where ${workspaceName} is today to the 60-day goal through phased execution, targeted agent deployment, and weekly operating accountability.`,
    baseline: {
      headline: raw.baseline?.headline?.trim() || "Where you are today (1x)",
      summary:
        sentence(raw.baseline?.summary ?? "") ||
        sentence(
          researchSummary ??
            `Operations at ${bp.domain ?? workspaceName} are ready for a more structured execution plan tied directly to the stated business goal.`,
        ),
      painPoints: baselinePainPoints.length
        ? baselinePainPoints
        : fallbackPainPoints(bp, workspaceName, selectedIds),
    },
    northStar: {
      goal: raw.northStar?.goal?.trim() ?? bp.sixty_day_goal ?? "Operational improvement",
      summary:
        sentence(raw.northStar?.summary ?? "") ||
        "Success means measurable progress toward the stated goal, with better execution, faster decisions, and clearer accountability.",
      aims: uniqueStrings(raw.northStar?.aims ?? fallbackAims(bp)).slice(0, 6),
    },
    strategicPriorities:
      strategicPriorities.length
        ? strategicPriorities
        : fallbackStrategicPriorities(bp, workspaceName, selectedAgentNames),
    agents,
    phases,
    executionReadiness: {
      headline:
        raw.executionReadiness?.headline?.trim() ||
        executionReadinessFallback.headline,
      summary:
        sentence(raw.executionReadiness?.summary ?? "") ||
        executionReadinessFallback.summary,
      items:
        (raw.executionReadiness?.items ?? executionReadinessFallback.items)
          .map((item) => ({
            category: item.category?.trim() || "Execution",
            title: item.title?.trim() || "Readiness requirement",
            detail: sentence(item.detail ?? ""),
          }))
          .filter((item) => item.detail)
          .slice(0, 6),
    },
    outcomes: {
      headlineMetric:
        raw.outcomes?.headlineMetric?.trim() ||
        "Operational efficiency gain in 90 days",
      summary:
        sentence(raw.outcomes?.summary ?? "") ||
        "Phased deployment aligns agent execution to the north star and gives leadership a concrete path from operational improvements to business results.",
      metrics:
        (raw.outcomes?.metrics ?? fallbackMetrics(bp))
          .map((metric) => ({
            label: metric.label?.trim() || "KPI",
            target: metric.target?.trim() || "TBD",
            description: sentence(metric.description ?? ""),
          }))
          .filter((metric) => metric.label && metric.target)
          .slice(0, 5),
    },
  };
}

export function visionRoadmapToMarkdown(doc: VisionRoadmapDocument): string {
  const lines = [
    `# ${doc.title} - ${doc.companyName}`,
    "",
    doc.subtitle,
    "",
    doc.narrative,
    "",
    `## ${doc.baseline.headline}`,
    doc.baseline.summary,
    "",
    ...doc.baseline.painPoints.flatMap((point) => [
      `### ${point.title}`,
      point.description,
      point.impact ? `Impact: ${point.impact}` : "",
      "",
    ]),
    "## Your 60-day north star",
    `**${doc.northStar.goal}**`,
    "",
    doc.northStar.summary,
    "",
    ...doc.northStar.aims.map((aim) => `- ${aim}`),
    "",
    "## Strategic priorities",
    "",
    ...doc.strategicPriorities.flatMap((priority) => [
      `### ${priority.title}`,
      priority.rationale,
      ...priority.initiatives.map((initiative) => `- ${initiative}`),
      "",
    ]),
  ];

  if (doc.agents.length) {
    lines.push("## Your agent package", "");
    for (const agent of doc.agents) {
      lines.push(
        `### ${agent.name} (${agent.role})`,
        `Pain: ${agent.painPoint}`,
        `Solution: ${agent.solution}`,
        `Outcome: ${agent.outcome}`,
        "",
      );
    }
  }

  lines.push("## 30 / 60 / 90 day roadmap", "");

  for (const phase of doc.phases) {
    lines.push(`### Day ${phase.day} - ${phase.title}`, phase.focus, "");
    for (const milestone of phase.milestones) {
      lines.push(`- ${milestone}`);
    }
    if (phase.successCriteria.length) {
      lines.push("", "Success criteria");
      for (const checkpoint of phase.successCriteria) {
        lines.push(`- ${checkpoint}`);
      }
    }
    if (phase.agentNames.length) {
      lines.push("", `Agents active: ${phase.agentNames.join(", ")}`);
    }
    lines.push("");
  }

  lines.push(
    "## Execution readiness",
    doc.executionReadiness.headline,
    "",
    doc.executionReadiness.summary,
    "",
  );

  for (const item of doc.executionReadiness.items) {
    lines.push(`### ${item.category} - ${item.title}`, item.detail, "");
  }

  lines.push(
    "## Measurable outcomes",
    `**${doc.outcomes.headlineMetric}**`,
    "",
    doc.outcomes.summary,
    "",
  );

  for (const metric of doc.outcomes.metrics) {
    lines.push(`- **${metric.label}:** ${metric.target} - ${metric.description}`);
  }

  return lines.join("\n");
}
