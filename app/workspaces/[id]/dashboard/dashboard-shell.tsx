"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { buildCalDemoLink, CAL_EMBED_URL } from "@/lib/cal-demo-link";
import { ROI_DASHBOARD_DISCLAIMER } from "@/lib/roi-dashboard/constants";
import { RoiDashboardProvider } from "@/lib/roi-dashboard/context";
import { BrandButton, GhostButton, ShellCard } from "@/components/app-shell";

type DashboardShellProps = {
  workspaceId: string;
  userName: string;
  userEmail: string;
  domain?: string;
  sixtyDayGoal?: string;
  primaryGoals?: string[];
  children: ReactNode;
};

export function DashboardShell({
  workspaceId,
  userName,
  userEmail,
  domain,
  sixtyDayGoal,
  primaryGoals,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const [showCal, setShowCal] = useState(false);

  const calLink = buildCalDemoLink({
    name: userName,
    email: userEmail,
    domain,
    sixtyDayGoal,
    primaryGoals,
  });

  return (
    <RoiDashboardProvider workspaceId={workspaceId}>
      <div className="app-shell-root min-h-dvh pb-24">
        <div className="mx-auto max-w-[1400px] px-6 pt-6 md:px-10">
          <div className="rounded-xl border border-[#E5E4DE] bg-[#F3F3EF] px-5 py-4 text-[14px] text-[#5E6472]">
            {ROI_DASHBOARD_DISCLAIMER}
          </div>
        </div>

        <div className="roi-dashboard-root mt-4">{children}</div>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E4DE] bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-10">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push(`/workspaces/${workspaceId}`)}
                className="app-shell-btn app-shell-btn-ghost text-[13px]"
              >
                Review agents
              </button>
            </div>
            <BrandButton type="button" onClick={() => setShowCal(true)}>
              Build your own dashboard
            </BrandButton>
          </div>
        </div>

        {showCal ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <ShellCard className="w-full max-w-3xl overflow-hidden p-2">
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="font-medium">Book your demo</h3>
                <GhostButton type="button" onClick={() => setShowCal(false)}>
                  Close
                </GhostButton>
              </div>
              <iframe
                title="Book a demo"
                src={CAL_EMBED_URL}
                className="h-[600px] w-full rounded-xl border-0"
              />
              <div className="px-4 py-3 text-center">
                <a
                  href={calLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-[#3D4DDB] hover:underline"
                >
                  Open booking page in new tab
                </a>
              </div>
            </ShellCard>
          </div>
        ) : null}
      </div>
    </RoiDashboardProvider>
  );
}
