"use client";

import { AGENT_CATALOG } from "@/lib/agent-catalog";
import type { CatalogAgent } from "@/lib/agent-catalog";
import type { RecommendedAgentDetail } from "@/lib/workspaces";
import { GhostButton, PrimaryButton, ShellCard } from "@/components/app-shell";
import { CustomAgentsCta } from "@/components/custom-agents-cta";
import {
  displaySkippedReason,
} from "@/lib/custom-agents-cta";
import { GlowCard } from "@/components/ui/spotlight-card";
import { LoadingPanel } from "@/components/loading-spinner";

function relevanceLabel(score?: number) {
  if (score === undefined) return null;
  if (score >= 0.85) return "Strong fit";
  if (score >= 0.65) return "Good fit";
  return null;
}

type AgentLibraryProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  recommended?: RecommendedAgentDetail[];
  agents?: CatalogAgent[];
};

export function AgentLibrary({
  selectedIds,
  onChange,
  recommended = [],
  agents,
  skippedReason,
}: AgentLibraryProps & { skippedReason?: string }) {
  const recommendedById = new Map(recommended.map((r) => [r.id, r]));
  const catalog = agents ?? AGENT_CATALOG;
  const displayAgents =
    recommended.length > 0
      ? catalog.filter((a) => recommendedById.has(a.id))
      : [];

  function toggle(agent: CatalogAgent) {
    if (selectedIds.includes(agent.id)) {
      onChange(selectedIds.filter((id) => id !== agent.id));
    } else {
      onChange([...selectedIds, agent.id]);
    }
  }

  if (displayAgents.length === 0) {
    const reason =
      displaySkippedReason(skippedReason) ??
      "Based on your website and 60-day goal, none of our field-operations agents are a fit. You can still continue to your vision roadmap focused on your goals.";
    return (
      <div className="rounded-2xl border border-dashed border-[#DAD8D0] bg-white px-8 py-12 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
          No agents recommended
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#5E6472]">
          {reason}
        </p>
        <CustomAgentsCta className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#5E6472]" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {displayAgents.map((agent) => {
        const selected = selectedIds.includes(agent.id);
        const rec = recommendedById.get(agent.id);
        const fitLabel = relevanceLabel(rec?.relevanceScore);

        return (
          <GlowCard
            key={agent.id}
            as="button"
            type="button"
            onClick={() => toggle(agent)}
            className={`app-shell-select-card rounded-2xl p-5 text-left w-full ${
              selected ? "is-selected" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5E6472]">
                {agent.category}
              </p>
              {fitLabel ? (
                <span className="shrink-0 rounded-full bg-[#6B7BFF]/12 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#3D4DDB]">
                  {fitLabel}
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 text-[18px] font-medium">{agent.name}</h3>
            <p className="mt-1 text-[13px] text-[#5E6472]">{agent.role}</p>
            <p className="mt-2 text-[14px] text-[#5E6472]">
              {rec?.description ?? agent.description}
            </p>
            <p className="mt-3 text-[13px] text-[#0A0A0B]">
              Automates: {agent.automates}
            </p>
            {rec?.requirementReason ? (
              <p className="mt-2 text-[12px] leading-relaxed text-[#5E6472]">
                <span className="font-medium text-[#0A0A0B]">Why:</span>{" "}
                {rec.requirementReason}
              </p>
            ) : null}
          </GlowCard>
        );
      })}
    </div>
  );
}

export function AgentPackageModal({
  open,
  onClose,
  agents,
  loading,
  loadingLabel,
  skippedReason,
}: {
  open: boolean;
  onClose: () => void;
  agents: RecommendedAgentDetail[];
  loading: boolean;
  loadingLabel?: string;
  skippedReason?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ShellCard className="no-scrollbar max-h-[85vh] w-full max-w-[640px] overflow-y-auto p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[22px] font-medium">Your recommended agent package</h2>
          <GhostButton type="button" onClick={onClose}>
            Close
          </GhostButton>
        </div>
        {loading ? (
          <LoadingPanel label={loadingLabel ?? "Personalizing your package"} />
        ) : agents.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[#DAD8D0] p-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
              No agents recommended
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#5E6472]">
              {displaySkippedReason(skippedReason) ??
                "Based on your website and 60-day goal, none of our field-operations agents are a fit. Your vision roadmap will focus on your stated goals."}
            </p>
            <CustomAgentsCta />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {agents.map((agent) => {
              const fitLabel = relevanceLabel(agent.relevanceScore);
              return (
                <div
                  key={agent.id}
                  className="rounded-xl border border-[#E5E4DE] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[18px] font-medium">{agent.name}</h3>
                    {fitLabel ? (
                      <span className="shrink-0 rounded-full bg-[#6B7BFF]/12 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#3D4DDB]">
                        {fitLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[14px] text-[#5E6472]">
                    {agent.description}
                  </p>
                  <p className="mt-3 text-[13px]">
                    <span className="font-medium">Solves:</span> {agent.problemSolved}
                  </p>
                  <p className="mt-1 text-[13px]">
                    <span className="font-medium">Maps to your goal:</span>{" "}
                    {agent.goalMapping}
                  </p>
                  {agent.requirementReason ? (
                    <p className="mt-2 text-[13px] text-[#5E6472]">
                      <span className="font-medium text-[#0A0A0B]">Why required:</span>{" "}
                      {agent.requirementReason}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
        <PrimaryButton type="button" className="mt-6 w-full" onClick={onClose}>
          Got it
        </PrimaryButton>
      </ShellCard>
    </div>
  );
}
