import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useMultiSite } from "@/lib/roi-dashboard/multisite/store";

export function SiteDetailSheet() {
  const { sites, selectedSite, setSelectedSite, events } = useMultiSite();
  const site = sites.find((s) => s.id === selectedSite) ?? null;
  const open = !!site;
  const siteEvents = site ? events.filter((e) => e.siteId === site.id).slice(0, 6) : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedSite(null)}>
      <SheetContent className="w-full sm:max-w-md">
        {site && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">Store #{site.id} · {site.city}</SheetTitle>
              <SheetDescription>{site.region} region · {site.note}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Savings / mo" value={`$${site.savings.toLocaleString()}`} />
              <Stat label="SLA" value={`${site.sla.toFixed(1)}%`} />
              <Stat label="Open work orders" value={`${site.workOrders}`} />
              <Stat label="Energy vs LY" value={`${site.energyDelta.toFixed(1)}%`} />
            </div>
            <div className="mt-6">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</div>
              {siteEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent events for this site.</div>
              ) : (
                <ul className="space-y-2">
                  {siteEvents.map((e) => (
                    <li key={e.id} className="rounded-lg border border-border p-3">
                      <div className="text-sm font-semibold">{e.title}</div>
                      <div className="text-xs text-muted-foreground">{e.detail}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
