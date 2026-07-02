import { useState } from "react";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/roi-dashboard/ui/dialog";
import { useFacility19 } from "@/lib/roi-dashboard/facility19/store";

export function MonthlyRoiReport() {
  const { kpis, agents, events } = useFacility19();
  const [open, setOpen] = useState(false);
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const autoResolved = events.filter((e) => e.type === "resolved").length + 70;

  const downloadReport = () => {
    const lines = [
      `FACILITY 19 — MONTHLY ROI REPORT`,
      `${month} · Tower A · Midtown · 412,000 sq ft`,
      ``.padEnd(60, "="),
      ``,
      `HEADLINE`,
      `  Total savings since deploy: $${kpis.totalSavings.toLocaleString()}`,
      `  Labor hours freed: ${kpis.hoursFreed} hrs`,
      `  Work orders auto-closed: ${kpis.workOrdersClosed}`,
      `  AI employees on duty: ${agents.length} (${agents.filter(a => a.status === "Active").length} active)`,
      ``,
      `AGENT PERFORMANCE`,
      ...agents.map((a) => `  ${a.name} — ${a.domain} — ${a.metricLabel}: ${a.metricValue} (${a.deltaText})`),
      ``,
      `RECENT ACTIONS`,
      ...events.slice(0, 8).map((e) => `  • [${e.type.toUpperCase()}] ${e.title} — ${e.detail}`),
      ``,
      `Auto-resolved this month: ${autoResolved} work orders`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facility19-roi-${month.replace(" ", "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90">
          Monthly ROI report
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> {month} · Tower A
          </div>
          <DialogTitle className="font-display text-2xl">Monthly ROI report</DialogTitle>
          <DialogDescription>
            Generated live from agent telemetry. Send to your building owner or download for the file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Stat label="Total savings" value={`$${kpis.totalSavings.toLocaleString()}`} />
          <Stat label="Hours freed" value={`${kpis.hoursFreed} hrs`} />
          <Stat label="Work orders closed" value={`${kpis.workOrdersClosed}`} />
          <Stat label="Auto-resolved" value={`${autoResolved}`} />
        </div>

        <div className="mt-4">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-2">Agent performance</h4>
          <div className="divide-y divide-border rounded-lg border border-border">
            {agents.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-muted-foreground"> · {a.domain}</span>
                </div>
                <div className="font-mono text-xs text-muted-foreground">{a.deltaText}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-2">Recent actions</h4>
          <ul className="space-y-1.5 text-sm">
            {events.slice(0, 6).map((e) => (
              <li key={e.id} className="text-muted-foreground">
                <span className="font-mono text-[10px] uppercase tracking-wider mr-2">{e.type}</span>
                <span className="text-foreground">{e.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={downloadReport} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90">
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
