import { useField } from "@/lib/roi-dashboard/field/store";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

export function FleetPanel() {
  const { trucks, setSelectedTruck } = useField();
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">Truck Roster</h3>
          <ExplainTip title="Truck Roster">
            Per-truck day-of-business: jobs completed vs scheduled, revenue booked today, current job and ETA. Click a row for full detail.
          </ExplainTip>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{trucks.length} trucks</span>
      </div>
      <ul className="divide-y divide-border">
        {trucks.map((t) => {
          const pct = Math.round((t.jobsDone / t.jobsToday) * 100);
          return (
            <li key={t.id}
              onClick={() => setSelectedTruck(t.id)}
              className="flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold tracking-tight">{t.unit} · {t.tech}</div>
                <div className="text-xs text-muted-foreground">{t.trade} · {t.currentJob} · ETA {t.etaMin}m</div>
              </div>
              <div className="w-32">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                  <span>Jobs</span><span>{t.jobsDone}/{t.jobsToday}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="w-20 text-right font-mono text-xs">
                <div className="font-semibold">${t.revenueToday.toLocaleString()}</div>
                <div className="text-[10px] uppercase text-muted-foreground">today</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
