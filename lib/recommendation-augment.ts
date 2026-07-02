import {
  getAgentsByCategory,
  MIN_USE_CASE_THRESHOLD,
} from "@/lib/agent-catalog";
import {
  PRIMARY_GOAL_CLUSTER_MAP,
  type UserGoalSignals,
} from "@/lib/user-goal-signals";
import type { RecommendedAgentDetail } from "@/lib/workspaces";

const SUPPLEMENT_SCORE = MIN_USE_CASE_THRESHOLD + 0.07;

function goalLabelForCluster(cluster: string, signals: UserGoalSignals): string {
  for (const goal of signals.matchedPrimaryGoals) {
    const clusters = PRIMARY_GOAL_CLUSTER_MAP[goal];
    if (clusters?.includes(cluster)) return goal;
  }
  if (signals.sixtyDayGoal) return `your 60-day goal (${signals.sixtyDayGoal.slice(0, 80)})`;
  return "your stated operational priorities";
}

/** Add goal-mapped catalog agents the LLM omitted — only when a real use case exists. */
export function augmentRecommendations(
  agents: RecommendedAgentDetail[],
  signals: UserGoalSignals,
): RecommendedAgentDetail[] {
  if (!signals.indicatesFacilityOps && signals.clusterHints.length === 0) {
    return agents;
  }

  const byId = new Map(agents.map((a) => [a.id, a]));

  for (const cluster of signals.clusterHints) {
    const goalLabel = goalLabelForCluster(cluster, signals);
    for (const catalog of getAgentsByCategory(cluster)) {
      if (byId.has(catalog.id)) continue;
      byId.set(catalog.id, {
        id: catalog.id,
        name: catalog.name,
        problemSolved: catalog.automates,
        goalMapping: `Supports ${catalog.category} related to ${goalLabel}`,
        description: catalog.description,
        relevanceScore: SUPPLEMENT_SCORE,
        requirementReason: `Included because ${catalog.category} aligns with your goals; review fit before selecting.`,
      });
    }
  }

  return [...byId.values()].sort(
    (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0),
  );
}

export function boostHintScores(
  agents: RecommendedAgentDetail[],
  hintIds: string[],
): RecommendedAgentDetail[] {
  const hintSet = new Set(hintIds);
  return agents.map((agent) => {
    if (!hintSet.has(agent.id)) return agent;
    const score = agent.relevanceScore ?? 0;
    if (score >= MIN_USE_CASE_THRESHOLD) return agent;
    return { ...agent, relevanceScore: MIN_USE_CASE_THRESHOLD };
  });
}