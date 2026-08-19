"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader, PrimaryButton, ShellCard } from "@/components/app-shell";
import { CustomAgentsCta } from "@/components/custom-agents-cta";
import { LoadingPanel } from "@/components/loading-spinner";
import { VisionRoadmapDocumentView } from "@/components/vision-roadmap-document";
import { WorkspaceNav } from "@/components/workspace-nav";
import { downloadRoadmapPdf } from "@/lib/download-roadmap-pdf";
import {
  VISION_ROADMAP_VERSION,
  type VisionRoadmapDocument,
} from "@/lib/vision-roadmap";

export function RoadmapClient({
  workspaceId,
  workspaceName,
  initialDoc,
  agentsMatched,
}: {
  workspaceId: string;
  workspaceName: string;
  initialDoc: VisionRoadmapDocument | null;
  agentsMatched: boolean;
}) {
  const router = useRouter();
  const needsRegenerate =
    agentsMatched &&
    (!initialDoc || initialDoc.version !== VISION_ROADMAP_VERSION);
  const [doc, setDoc] = useState<VisionRoadmapDocument | null>(initialDoc);
  const [loading, setLoading] = useState(needsRegenerate);
  const [skipped, setSkipped] = useState(!agentsMatched);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!needsRegenerate) return;
    (async () => {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/generate/roadmap`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.skipped || !data.doc) {
        setSkipped(true);
        setDoc(null);
      } else {
        setDoc(data.doc ?? null);
      }
      setLoading(false);
    })();
  }, [workspaceId, needsRegenerate]);

  async function enterDashboard() {
    await fetch(`/api/workspaces/${workspaceId}/journey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "dashboard" }),
    });
    router.push(`/workspaces/${workspaceId}/dashboard`);
    router.refresh();
  }

  async function handleDownloadPdf() {
    setPdfError(null);
    setPdfLoading(true);
    try {
      await downloadRoadmapPdf(workspaceId);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "Could not download PDF.");
    } finally {
      setPdfLoading(false);
    }
  }

  const showDocument = !loading && !skipped && Boolean(doc);
  const showActions = showDocument;

  return (
    <div className="app-shell-root min-h-dvh">
      <AppHeader title="Roadmap to 100x" subtitle={workspaceName} />
      <WorkspaceNav
        workspaceId={workspaceId}
        showPdf={showActions}
        onPdfError={setPdfError}
      />

      <main className="mx-auto max-w-[960px] px-6 py-10 md:px-10">
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
              WeLaunch only generates a vision roadmap when agents from our
              49-agent catalog match your business. Explore custom agents or enter
              your workspace to continue.
            </p>
            <CustomAgentsCta className="mx-auto mt-4 max-w-lg" />
            <PrimaryButton type="button" className="mt-8" onClick={enterDashboard}>
              Show demo workspace
            </PrimaryButton>
          </ShellCard>
        ) : doc ? (
          <ShellCard className="overflow-hidden p-0">
            <VisionRoadmapDocumentView doc={doc} />
          </ShellCard>
        ) : null}

        {showActions ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton type="button" onClick={enterDashboard}>
              Show demo workspace
            </PrimaryButton>
            <button
              type="button"
              onClick={() => void handleDownloadPdf()}
              disabled={pdfLoading}
              className="app-shell-btn app-shell-btn-ghost"
            >
              {pdfLoading ? "Preparing PDF…" : "Download PDF"}
            </button>
            {pdfError ? (
              <p className="w-full text-[14px] text-[#B42318]">{pdfError}</p>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}
