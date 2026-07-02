import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useField } from "@/lib/roi-dashboard/field/store";

export function TruckDetailSheet() {
  const { trucks, selectedTruck, setSelectedTruck, events } = useField();
  const truck = trucks.find((t) => t.id === selectedTruck) ?? null;
  const open = !!truck;
  const truckEvents = truck ? events.filter((e) => e.truckId === truck.id).slice(0, 6) : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedTruck(null)}>
      <SheetContent className="w-full sm:max-w-md">
        {truck && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">{truck.unit}</SheetTitle>
              <SheetDescription>{truck.tech} · {truck.trade} · {truck.currentJob}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Status" value={truck.status} />
              <Stat label="ETA next stop" value={`${truck.etaMin} min`} />
              <Stat label="Jobs today" value={`${truck.jobsDone} / ${truck.jobsToday}`} />
              <Stat label="Revenue today" value={`$${truck.revenueToday.toLocaleString()}`} />
            </div>
            <div className="mt-6">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</div>
              {truckEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent events for this truck.</div>
              ) : (
                <ul className="space-y-2">
                  {truckEvents.map((e) => (
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
      <div className="mt-1 font-display text-xl font-bold tracking-tight capitalize">{value}</div>
    </div>
  );
}
