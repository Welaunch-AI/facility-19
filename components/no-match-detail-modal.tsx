"use client";

import type { ReactNode } from "react";
import type { BusinessProfile, NoMatchAnalysis } from "@/lib/workspaces";
import { WELAUNCH_CASE_STUDIES_URL } from "@/lib/no-match-analysis";
import { CustomAgentsCta } from "@/components/custom-agents-cta";
import { BrandButton, GhostButton, PrimaryButton, ShellCard } from "@/components/app-shell";
import { LoadingPanel } from "@/components/loading-spinner";

type Props = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  loadingLabel?: string;
  businessProfile: BusinessProfile;
  analysis?: NoMatchAnalysis;
};

function AnalysisSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E5E4DE] p-5 text-left">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5E6472]">
        {label}
      </p>
      <div className="mt-3 text-[15px] leading-relaxed text-[#5E6472]">{children}</div>
    </section>
  );
}

export function NoMatchDetailModal({
  open,
  onClose,
  loading,
  loadingLabel,
  businessProfile,
  analysis,
}: Props) {
  if (!open) return null;

  const domain = businessProfile.domain;
  const profile = businessProfile.research?.company_profile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ShellCard className="modal-panel flex w-full max-w-[720px] flex-col overflow-hidden p-0">
        <div className="shrink-0 border-b border-[#E5E4DE] px-8 pb-6 pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
                Agent matching
              </p>
              <h2 className="mt-2 text-[22px] font-medium">
                Why no Facility 19 agents matched
              </h2>
              {domain ? (
                <p className="mt-1 text-[14px] text-[#5E6472]">
                  Analyzed:{" "}
                  <span className="font-medium text-[#0A0A0B]">{domain}</span>
                </p>
              ) : null}
            </div>
            <GhostButton type="button" onClick={onClose}>
              Close
            </GhostButton>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 py-6">
          {loading ? (
            <LoadingPanel label={loadingLabel ?? "Analyzing your website…"} />
          ) : analysis ? (
            <div className="space-y-4">
              <AnalysisSection label="What we found on your website">
                <p>{analysis.websiteSummary}</p>
                {profile?.industry || profile?.company_type ? (
                  <ul className="mt-3 space-y-1 text-[14px]">
                    {profile.industry ? (
                      <li>
                        <span className="font-medium text-[#0A0A0B]">Industry:</span>{" "}
                        {profile.industry}
                      </li>
                    ) : null}
                    {profile.company_type ? (
                      <li>
                        <span className="font-medium text-[#0A0A0B]">Company type:</span>{" "}
                        {profile.company_type.replace(/_/g, " ")}
                      </li>
                    ) : null}
                    {profile.operations?.length ? (
                      <li>
                        <span className="font-medium text-[#0A0A0B]">Operations:</span>{" "}
                        {profile.operations.join(", ")}
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </AnalysisSection>

              <AnalysisSection label="Why this isn't a Facility 19 fit">
                <p>{analysis.whyNotFacility19}</p>
                <p className="mt-3 text-[14px]">
                  Facility 19&apos;s catalog covers physical field operations — HVAC
                  technicians, fleet dispatch, CMMS work orders, and building
                  maintenance. Your site doesn&apos;t show those operating patterns, so
                  we won&apos;t force-fit pre-built agents.
                </p>
              </AnalysisSection>

              <AnalysisSection label="Custom agents we could build for you">
                <p className="text-[14px]">
                  Based on your website and goals, a tailored agent stack might look
                  like this:
                </p>
                <div className="mt-4 space-y-3">
                  {analysis.customAgents.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-lg border border-[#E5E4DE] bg-[#FAFAF8] p-4"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h3 className="text-[16px] font-medium text-[#0A0A0B]">
                          {agent.name}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#5E6472]">
                          {agent.role}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed">{agent.description}</p>
                      {agent.mapsToGoal ? (
                        <p className="mt-2 text-[13px] text-[#5E6472]">
                          <span className="font-medium text-[#0A0A0B]">Maps to your goal:</span>{" "}
                          {agent.mapsToGoal}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </AnalysisSection>

              <AnalysisSection label="Explore AI use cases">
                <p>
                  See how WeLaunch builds custom AI systems for growth, automation, and
                  operations — real deployments with measurable outcomes.
                </p>
                <BrandButton
                  type="button"
                  className="mt-4"
                  onClick={() =>
                    window.open(WELAUNCH_CASE_STUDIES_URL, "_blank", "noopener,noreferrer")
                  }
                >
                  View use cases
                </BrandButton>
              </AnalysisSection>

              <CustomAgentsCta className="text-center text-[15px]" />
            </div>
          ) : (
            <p className="text-center text-[15px] text-[#5E6472]">
              Analysis unavailable. Try refreshing the page.
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-[#E5E4DE] px-8 pb-8 pt-6">
          <PrimaryButton type="button" className="w-full" onClick={onClose}>
            Got it
          </PrimaryButton>
        </div>
      </ShellCard>
    </div>
  );
}
