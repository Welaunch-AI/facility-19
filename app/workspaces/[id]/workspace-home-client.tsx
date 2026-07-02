"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { BusinessProfile, NoMatchAnalysis, RecommendedAgentDetail } from "@/lib/workspaces";
import { hasCompletedAgentMatching } from "@/lib/workspaces";
import { AUTO_SELECT_THRESHOLD } from "@/lib/agent-catalog";
import { CustomAgentsCta } from "@/components/custom-agents-cta";
import { AgentLibrary, AgentPackageModal } from "@/components/agent-library";
import { NoMatchDetailModal } from "@/components/no-match-detail-modal";
import {
  AppHeader,
  BrandButton,
  PrimaryButton,
  ShellCard,
} from "@/components/app-shell";
import { LoadingInline } from "@/components/loading-spinner";
import { WorkspaceNav } from "@/components/workspace-nav";

type WorkspaceHomeClientProps = {
  workspaceId: string;
  workspaceName: string;
  userName: string;
  businessProfile: BusinessProfile;
};

type LoadingPhase = "research" | "matching" | "idle";

export function WorkspaceHomeClient({
  workspaceId,
  workspaceName,
  userName,
  businessProfile,
}: WorkspaceHomeClientProps) {
  const matchingDone = hasCompletedAgentMatching(businessProfile);
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    businessProfile.selected_agent_ids ?? [],
  );
  const [recommended, setRecommended] = useState<RecommendedAgentDetail[]>(
    businessProfile.recommended_details ?? [],
  );
  const [skippedReason, setSkippedReason] = useState<string | undefined>(
    businessProfile.recommendation_skipped_reason,
  );
  const [noMatchAnalysis, setNoMatchAnalysis] = useState<NoMatchAnalysis | undefined>(
    businessProfile.no_match_analysis,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>(() => {
    if (matchingDone) return "idle";
    return businessProfile.research?.status === "pending" ? "research" : "matching";
  });
  const [saving, setSaving] = useState(false);

  const waitForResearch = useCallback(async () => {
    const deadline = Date.now() + 12000;
    while (Date.now() < deadline) {
      const res = await fetch(
        `/api/research/start?workspaceId=${encodeURIComponent(workspaceId)}`,
      );
      const data = await res.json();
      const status = data.research?.status;
      if (status === "complete" || status === "failed") return;
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }, [workspaceId]);

  const loadRecommendations = useCallback(async () => {
    if (matchingDone) return;

    if (businessProfile.research?.status === "pending") {
      setLoadingPhase("research");
      await waitForResearch();
    } else {
      setLoadingPhase("matching");
    }

    const res = await fetch(`/api/workspaces/${workspaceId}/recommend-agents`, {
      method: "POST",
    });
    const data = await res.json();
    if (Array.isArray(data.agents)) {
      setRecommended(data.agents);
      setSkippedReason(data.skippedReason);
      if (data.noMatchAnalysis) {
        setNoMatchAnalysis(data.noMatchAnalysis);
      }
      if (!data.cached) {
        const autoSelect = (data.agents as RecommendedAgentDetail[])
          .filter((a) => (a.relevanceScore ?? 0) >= AUTO_SELECT_THRESHOLD)
          .map((a) => a.id);
        setSelectedIds(autoSelect);
      }
    }
    setLoadingPhase("idle");
  }, [businessProfile.research?.status, matchingDone, waitForResearch, workspaceId]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  async function saveSelection(ids: string[]) {
    setSelectedIds(ids);
    await fetch(`/api/workspaces/${workspaceId}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_agent_ids: ids }),
    });
  }

  async function proceedToRoadmap() {
    setSaving(true);
    await fetch(`/api/workspaces/${workspaceId}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_agent_ids: selectedIds }),
    });

    if (hasAgents) {
      await fetch(`/api/workspaces/${workspaceId}/generate/roadmap`, {
        method: "POST",
      });
      router.push(`/workspaces/${workspaceId}/roadmap`);
    } else {
      await fetch(`/api/workspaces/${workspaceId}/journey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: "dashboard" }),
      });
      router.push(`/workspaces/${workspaceId}/dashboard`);
    }
    router.refresh();
  }

  const loadingRec = loadingPhase !== "idle";
  const loadingLabel =
    loadingPhase === "research"
      ? "Analyzing your website…"
      : loadingPhase === "matching"
        ? "Matching agents to your goals…"
        : "Personalizing your package";
  const hasAgents = recommended.length > 0;

  return (
    <div className="app-shell-root min-h-dvh">
      <AppHeader
        title={`Welcome, ${userName}`}
        subtitle={workspaceName}
        headerAction={{ href: "/workspaces", label: "All workspaces" }}
      />
      <WorkspaceNav workspaceId={workspaceId} showPdf={false} />

      <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          <ShellCard className="p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
              Primary CTA
            </p>
            <h2 className="mt-3 text-[22px] font-medium">
              {hasAgents ? "See your recommended agent package" : "Agent matching result"}
            </h2>
            <p className="mt-3 text-[15px] text-[#5E6472]">
              {hasAgents
                ? `AI-selected field-operations agents mapped to your 60-day goal${businessProfile.domain ? ` for ${businessProfile.domain}` : ""}.`
                : "We only suggest agents when your website shows physical field operations."}
            </p>
            {!hasAgents && !loadingRec ? <CustomAgentsCta className="mt-4 text-[15px] text-[#5E6472]" /> : null}
            <BrandButton
              type="button"
              className="mt-6"
              onClick={() => setModalOpen(true)}
            >
              {loadingRec ? (
                <LoadingInline size="sm" label={loadingLabel} />
              ) : hasAgents ? (
                "View recommendations"
              ) : (
                "See why no agents matched"
              )}
            </BrandButton>
          </ShellCard>

          <ShellCard className="p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
              Next step
            </p>
            <h2 className="mt-3 text-[22px] font-medium">
              {hasAgents ? "Your matched agents" : "Continue to workspace"}
            </h2>
            <p className="mt-3 text-[15px] text-[#5E6472]">
              {hasAgents
                ? "Toggle agents on or off. Only recommended agents are shown."
                : "No vision roadmap will be generated — enter your workspace to explore the ROI dashboard and custom agent options."}
            </p>
            {!hasAgents && !loadingRec ? <CustomAgentsCta className="mt-4 text-[15px] text-[#5E6472]" /> : null}
            {hasAgents ? (
              <p className="mt-4 text-[14px] font-medium">
                {selectedIds.length} agent{selectedIds.length === 1 ? "" : "s"}{" "}
                selected
              </p>
            ) : null}
          </ShellCard>
        </div>

        <div className="mt-10">
          <h3 className="text-[20px] font-medium">
            {hasAgents ? "Recommended agents" : "Agent matching"}
          </h3>
          <div className="mt-6">
            {loadingRec ? (
              <div className="rounded-2xl border border-[#E5E4DE] bg-white px-8 py-12 text-center">
                <LoadingInline size="md" label={loadingLabel} />
              </div>
            ) : (
              <AgentLibrary
                selectedIds={selectedIds}
                onChange={(ids) => saveSelection(ids)}
                recommended={recommended}
                skippedReason={skippedReason}
              />
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <PrimaryButton
            type="button"
            disabled={saving || loadingRec}
            onClick={proceedToRoadmap}
          >
            {saving ? (
              <LoadingInline size="sm" label={hasAgents ? "Generating roadmap" : "Opening workspace"} />
            ) : hasAgents ? (
              "Continue to vision roadmap"
            ) : (
              "Show demo workspace"
            )}
          </PrimaryButton>
        </div>
      </main>

      <AgentPackageModal
        open={modalOpen && hasAgents}
        onClose={() => setModalOpen(false)}
        agents={recommended}
        loading={loadingRec}
        loadingLabel={loadingLabel}
        skippedReason={skippedReason}
      />

      <NoMatchDetailModal
        open={modalOpen && !hasAgents}
        onClose={() => setModalOpen(false)}
        loading={loadingRec}
        loadingLabel={loadingLabel}
        businessProfile={businessProfile}
        analysis={noMatchAnalysis}
      />
    </div>
  );
}
