import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/roi-dashboard/ui/sheet";
import { useNational } from "@/lib/roi-dashboard/national/store";

export function ClientDetailSheet() {
  const { clients, selectedClient, setSelectedClient, events } = useNational();
  const client = clients.find((c) => c.id === selectedClient) ?? null;
  const open = !!client;
  const clientEvents = client ? events.filter((e) => e.clientId === client.id).slice(0, 6) : [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && setSelectedClient(null)}>
      <SheetContent className="w-full sm:max-w-md">
        {client && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">{client.name}</SheetTitle>
              <SheetDescription>{client.state} · {client.sites} sites · {client.note}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Contract value / yr" value={`$${(client.contractValue / 1000).toFixed(0)}K`} />
              <Stat label="SLA" value={`${client.sla.toFixed(1)}%`} />
              <Stat label="Sites under mgmt" value={`${client.sites}`} />
              <Stat label="Retention" value={`${client.retention.toFixed(1)} yrs`} />
            </div>
            <div className="mt-6">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</div>
              {clientEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent events for this client.</div>
              ) : (
                <ul className="space-y-2">
                  {clientEvents.map((e) => (
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
