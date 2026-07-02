"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  displayNameFromEmail,
  formatLaneLabel,
  formatWorkspaceDate,
  type WorkspaceRow,
} from "@/lib/workspaces";
import { AppHeader, BrandButton, GhostButton, ShellCard } from "@/components/app-shell";
import { LoadingInline } from "@/components/loading-spinner";
import { TransitionOverlay } from "@/components/transition-overlay";
import { useTransitionNavigate } from "@/hooks/use-transition-navigate";

type WorkspacesViewProps = {
  email: string;
  fullName: string | null;
  workspaces: WorkspaceRow[];
};

export function WorkspacesView({
  email,
  fullName,
  workspaces,
}: WorkspacesViewProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { transitionLabel, navigate, isTransitioning } = useTransitionNavigate();

  const displayName = fullName ?? displayNameFromEmail(email);

  function startWorkspaceInterview() {
    void navigate(
      "/onboarding?step=1",
      "Starting your workspace interview...",
    );
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/start");
    router.refresh();
  }

  return (
    <div className="app-shell-root min-h-dvh">
      {transitionLabel ? <TransitionOverlay label={transitionLabel} /> : null}
      <AppHeader title="Your Workspaces" subtitle={displayName} />

      <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-wrap gap-3">
          <BrandButton
            type="button"
            disabled={isTransitioning}
            onClick={startWorkspaceInterview}
          >
            {isTransitioning ? (
              <LoadingInline size="sm" label="Starting interview" />
            ) : (
              "Create your workspace"
            )}
          </BrandButton>
          <GhostButton type="button" onClick={() => router.refresh()}>
            Refresh
          </GhostButton>
          <GhostButton
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="ml-auto"
          >
            {signingOut ? <LoadingInline size="sm" label="Signing out" /> : "Sign out"}
          </GhostButton>
        </div>

        {workspaces.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DAD8D0] bg-white px-8 py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
              No workspaces yet
            </p>
            <h2 className="mt-4 text-[24px] font-medium tracking-[-0.02em]">
              Start your first workspace interview
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#5E6472]">
              Five quick questions. We&apos;ll research your domain, recommend
              agents, and build your 1x–100x roadmap.
            </p>
            <BrandButton
              type="button"
              className="mt-8"
              disabled={isTransitioning}
              onClick={startWorkspaceInterview}
            >
              {isTransitioning ? (
                <LoadingInline size="sm" label="Starting interview" />
              ) : (
                "Create your workspace"
              )}
            </BrandButton>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {workspaces.map((workspace) => {
              const stage = workspace.business_profile?.journey_stage;
              const href =
                stage === "roadmap"
                  ? `/workspaces/${workspace.id}/roadmap`
                  : stage === "dashboard" || stage === "complete"
                    ? `/workspaces/${workspace.id}/dashboard`
                    : `/workspaces/${workspace.id}`;

              return (
                <ShellCard key={workspace.id} className="block">
                  <Link href={href} className="block p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
                      {formatLaneLabel(workspace.lane)}
                    </p>
                    <h2 className="mt-3 text-[22px] font-medium tracking-[-0.02em]">
                      {workspace.name}
                    </h2>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5E6472]">
                      Status:{" "}
                      <span className="text-[#0A0A0B]">{workspace.status}</span>
                    </p>
                    <p className="mt-2 text-[14px] text-[#5E6472]">
                      Created {formatWorkspaceDate(workspace.created_at)}
                    </p>
                  </Link>
                </ShellCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
