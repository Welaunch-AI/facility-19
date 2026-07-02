import { useNational } from "@/lib/roi-dashboard/national/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

export function SubcontractorPanel() {
  const { subs } = useNational();
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Subcontractor Bench</h3>
          <ExplainTip title="Sub Bench">
            DISPATCH picks from this bench in real time, balancing trade, region, current load and rating against the contractual SLA on each ticket.
          </ExplainTip>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{subs.length} active vendors</span>
      </div>
      <ul className="divide-y divide-border">
        {subs.map((s) => (
          <li key={s.id} className="flex items-center gap-4 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold tracking-tight">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.trade} · {s.region} · ★ {s.rating.toFixed(1)}</div>
            </div>
            <div className="w-28">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                <span>Util</span><span>{s.utilization}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-foreground" style={{ width: `${s.utilization}%` }} />
              </div>
            </div>
            <div className="w-14 text-right font-mono text-xs">
              <div className="font-semibold">{s.jobsToday}</div>
              <div className="text-[10px] uppercase text-muted-foreground">today</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
