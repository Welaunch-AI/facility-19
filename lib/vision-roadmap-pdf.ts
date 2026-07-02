import { jsPDF } from "jspdf";
import type { VisionRoadmapDocument } from "@/lib/vision-roadmap";
import { visionRoadmapToMarkdown } from "@/lib/vision-roadmap";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 16;
const MARGIN_TOP = 18;
const MARGIN_BOTTOM = 18;
const LINE_HEIGHT = 5.2;
const MAX_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

type PdfCursor = {
  doc: jsPDF;
  y: number;
};

function ensureSpace(cursor: PdfCursor, needed = LINE_HEIGHT) {
  if (cursor.y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
    cursor.doc.addPage();
    cursor.y = MARGIN_TOP;
  }
}

function writeLine(cursor: PdfCursor, text: string, options?: { bold?: boolean; size?: number }) {
  const size = options?.size ?? 10;
  cursor.doc.setFont("helvetica", options?.bold ? "bold" : "normal");
  cursor.doc.setFontSize(size);
  ensureSpace(cursor, LINE_HEIGHT + 1);
  cursor.doc.text(text, MARGIN_X, cursor.y);
  cursor.y += LINE_HEIGHT + (options?.bold ? 1 : 0);
}

function writeParagraph(cursor: PdfCursor, text: string, options?: { bold?: boolean; size?: number }) {
  const size = options?.size ?? 10;
  cursor.doc.setFont("helvetica", options?.bold ? "bold" : "normal");
  cursor.doc.setFontSize(size);
  const lines = cursor.doc.splitTextToSize(text, MAX_WIDTH) as string[];
  for (const line of lines) {
    ensureSpace(cursor);
    cursor.doc.text(line, MARGIN_X, cursor.y);
    cursor.y += LINE_HEIGHT;
  }
  cursor.y += 2;
}

function writeSection(cursor: PdfCursor, title: string) {
  cursor.y += 4;
  writeLine(cursor, title, { bold: true, size: 13 });
  cursor.y += 1;
}

function writeBullets(cursor: PdfCursor, items: string[]) {
  for (const item of items) {
    writeParagraph(cursor, `• ${item}`);
  }
}

export function buildVisionRoadmapPdf(
  workspaceName: string,
  doc: VisionRoadmapDocument,
): ArrayBuffer {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const cursor: PdfCursor = { doc: pdf, y: MARGIN_TOP };

  writeLine(cursor, "Facility 19 — Roadmap to 100x", { bold: true, size: 16 });
  writeLine(cursor, workspaceName, { bold: true, size: 12 });
  if (doc.domain) writeLine(cursor, doc.domain, { size: 9 });
  cursor.y += 2;

  writeParagraph(cursor, doc.subtitle, { size: 10 });
  writeParagraph(cursor, doc.narrative);

  writeSection(cursor, doc.baseline.headline);
  writeParagraph(cursor, doc.baseline.summary);
  for (const point of doc.baseline.painPoints) {
    writeLine(cursor, point.title, { bold: true, size: 10 });
    writeParagraph(cursor, point.description);
    if (point.impact) writeParagraph(cursor, `Impact: ${point.impact}`, { size: 9 });
  }

  writeSection(cursor, "Your 60-day north star");
  writeParagraph(cursor, doc.northStar.goal, { bold: true });
  writeParagraph(cursor, doc.northStar.summary);
  if (doc.northStar.aims.length) writeBullets(cursor, doc.northStar.aims);

  if (doc.strategicPriorities.length) {
    writeSection(cursor, "Strategic priorities");
    for (const priority of doc.strategicPriorities) {
      writeLine(cursor, priority.title, { bold: true, size: 10 });
      writeParagraph(cursor, priority.rationale);
      writeBullets(cursor, priority.initiatives);
    }
  }

  if (doc.agents.length) {
    writeSection(cursor, "Your agent package");
    for (const agent of doc.agents) {
      writeLine(cursor, `${agent.name} — ${agent.role}`, { bold: true, size: 10 });
      writeParagraph(cursor, `Pain: ${agent.painPoint}`, { size: 9 });
      writeParagraph(cursor, `Solution: ${agent.solution}`, { size: 9 });
      writeParagraph(cursor, `Outcome: ${agent.outcome}`, { size: 9 });
      cursor.y += 1;
    }
  }

  writeSection(cursor, "30 / 60 / 90 day roadmap");
  for (const phase of doc.phases) {
    writeLine(cursor, `Day ${phase.day} — ${phase.title}`, { bold: true, size: 10 });
    writeParagraph(cursor, phase.focus);
    if (phase.milestones.length) writeBullets(cursor, phase.milestones);
    if (phase.successCriteria.length) {
      writeLine(cursor, "Success criteria", { bold: true, size: 9 });
      writeBullets(cursor, phase.successCriteria);
    }
    if (phase.agentNames.length) {
      writeParagraph(cursor, `Agents active: ${phase.agentNames.join(", ")}`, { size: 9 });
    }
  }

  writeSection(cursor, doc.executionReadiness.headline);
  writeParagraph(cursor, doc.executionReadiness.summary);
  for (const item of doc.executionReadiness.items) {
    writeLine(cursor, `${item.category}: ${item.title}`, { bold: true, size: 9 });
    writeParagraph(cursor, item.detail, { size: 9 });
  }

  writeSection(cursor, "Measurable outcomes");
  writeParagraph(cursor, doc.outcomes.headlineMetric, { bold: true, size: 11 });
  writeParagraph(cursor, doc.outcomes.summary);
  for (const metric of doc.outcomes.metrics) {
    writeParagraph(cursor, `${metric.label}: ${metric.target} — ${metric.description}`, {
      size: 9,
    });
  }

  return pdf.output("arraybuffer") as ArrayBuffer;
}

export function buildVisionRoadmapPdfFromMarkdown(
  workspaceName: string,
  markdown: string,
): ArrayBuffer {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const cursor: PdfCursor = { doc: pdf, y: MARGIN_TOP };

  writeLine(cursor, "Facility 19 — Roadmap to 100x", { bold: true, size: 16 });
  writeLine(cursor, workspaceName, { bold: true, size: 12 });
  cursor.y += 2;

  const lines = markdown.split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      cursor.y += 2;
      continue;
    }
    if (line.startsWith("# ")) {
      writeSection(cursor, line.slice(2));
    } else if (line.startsWith("## ")) {
      writeSection(cursor, line.slice(3));
    } else if (line.startsWith("### ")) {
      writeLine(cursor, line.slice(4), { bold: true, size: 10 });
    } else if (line.startsWith("- ")) {
      writeParagraph(cursor, `• ${line.slice(2)}`, { size: 9 });
    } else if (line.startsWith("**") && line.endsWith("**")) {
      writeParagraph(cursor, line.replace(/\*\*/g, ""), { bold: true });
    } else {
      writeParagraph(cursor, line, { size: 10 });
    }
  }

  return pdf.output("arraybuffer") as ArrayBuffer;
}

export function buildVisionRoadmapPdfBytes(
  workspaceName: string,
  doc?: VisionRoadmapDocument | null,
  markdown?: string | null,
): ArrayBuffer {
  if (doc) return buildVisionRoadmapPdf(workspaceName, doc);
  const body = markdown?.trim() || "Vision roadmap not yet generated.";
  return buildVisionRoadmapPdfFromMarkdown(workspaceName, body);
}

export function roadmapPdfFilename(workspaceName: string) {
  const safe = workspaceName.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-") || "workspace";
  return `${safe}-vision-roadmap.pdf`;
}

/** Plain-text fallback for debugging or legacy export. */
export function roadmapPdfPlainText(doc: VisionRoadmapDocument) {
  return visionRoadmapToMarkdown(doc);
}
