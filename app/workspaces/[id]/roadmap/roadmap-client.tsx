"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppHeader, PrimaryButton, ShellCard } from "@/components/app-shell";
import { CustomAgentsCta } from "@/components/custom-agents-cta";
import { LoadingPanel } from "@/components/loading-spinner";
import { WorkspaceNav } from "@/components/workspace-nav";

async function downloadRoadmapPdf(workspaceId: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/roadmap/pdf`);
  if (!res.ok) return;

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? "vision-roadmap.pdf";

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function RoadmapClient({
  workspaceId,
  workspaceName,
  initialMarkdown,
  agentsMatched,
}: {
  workspaceId: string;
  workspaceName: string;
  initialMarkdown: string | null;
  agentsMatched: boolean;
}) {
  const router = useRouter();
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [loading, setLoading] = useState(agentsMatched && !initialMarkdown);
  const [skipped, setSkipped] = useState(!agentsMatched);

  useEffect(() => {
    if (!agentsMatched || initialMarkdown) return;
    (async () => {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/generate/roadmap`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.skipped || !data.markdown) {
        setSkipped(true);
        setMarkdown(null);
      } else {
        setMarkdown(data.markdown ?? "");
      }
      setLoading(false);
    })();
  }, [workspaceId, initialMarkdown, agentsMatched]);

  async function enterDashboard() {
    await fetch(`/api/workspaces/${workspaceId}/journey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "dashboard" }),
    });
    router.push(`/workspaces/${workspaceId}/dashboard`);
    router.refresh();
  }

  const showDocument = !loading && !skipped && Boolean(markdown);
  const showActions = showDocument;

  return (
    <div className="app-shell-root min-h-dvh">
      <AppHeader title="Roadmap to 100x" subtitle={workspaceName} />
      <WorkspaceNav workspaceId={workspaceId} showPdf={showActions} />

      <main className="mx-auto max-w-[800px] px-6 py-10 md:px-10">
        {loading ? (
          <LoadingPanel label="Generating your vision roadmap" />
        ) : skipped ? (
          <ShellCard className="p-8 text-center md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]">
              Vision roadmap
            </p>
            <h2 className="mt-3 text-[22px] font-medium">
              No vision document — agents didn&apos;t match
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#5E6472]">
              Facility 19 only generates a vision roadmap when field-operations agents
              match your business. Explore custom agents or enter your workspace to
              continue.
            </p>
            <CustomAgentsCta className="mx-auto mt-4 max-w-lg" />
            <PrimaryButton type="button" className="mt-8" onClick={enterDashboard}>
              Show demo workspace
            </PrimaryButton>
          </ShellCard>
        ) : (
          <ShellCard as="article" className="markdown-body p-8 md:p-10">
            <ReactMarkdown>{markdown ?? ""}</ReactMarkdown>
          </ShellCard>
        )}

        {showActions ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton type="button" onClick={enterDashboard}>
              Show demo workspace
            </PrimaryButton>
            <button
              type="button"
              onClick={() => void downloadRoadmapPdf(workspaceId)}
              className="app-shell-btn app-shell-btn-ghost"
            >
              Download PDF
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
