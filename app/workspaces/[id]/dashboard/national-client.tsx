"use client";

import { DollarSign, Building2, HardHat, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/roi-dashboard/facility19/DashboardHeader";
import { StatCard } from "@/components/roi-dashboard/facility19/StatCard";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";
import { NationalProvider, useNational } from "@/lib/roi-dashboard/national/store";
import { NationalAgentCard } from "@/components/roi-dashboard/national/NationalAgentCard";
import { NationalAgentDetailSheet } from "@/components/roi-dashboard/national/NationalAgentDetailSheet";
import { ClientMap } from "@/components/roi-dashboard/national/ClientMap";
import { ClientDetailSheet } from "@/components/roi-dashboard/national/ClientDetailSheet";
import { NationalActivityFeed } from "@/components/roi-dashboard/national/NationalActivityFeed";
import { SubcontractorPanel } from "@/components/roi-dashboard/national/SubcontractorPanel";
import { NationalRoiPanel } from "@/components/roi-dashboard/national/NationalRoiPanel";
import { NationalControls } from "@/components/roi-dashboard/national/NationalControls";

function NationalDashboard() {
  const { agents, kpis } = useNational();
  const activeCount = agents.filter((a) => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-[1400px] px-6 py-8 md:py-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              National Facility Services Provider · Enterprise Contractor
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Your AI is orchestrating {kpis.subsActive} subs across {kpis.clientSites} client sites.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              APEX runs the network. DISPATCH picks the right sub. WATCH protects every SLA. REPORT turns it all into commercial proof for your clients.
            </p>
          </div>
          <NationalControls />
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Revenue protected"
            value={kpis.revenueProtected}
            format={(n) => `$${(Math.round(n) / 1_000_000).toFixed(2)}M`}
            sub="client contracts · live"
            accent="dark"
            icon={<DollarSign className="h-4 w-4" />}
            explain="Annualized contract value preserved by hitting SLAs and avoiding penalty clauses + churn — recomputed every couple seconds."
          />
          <StatCard
            label="Client sites managed"
            value={kpis.clientSites}
            format={(n) => `${Math.round(n)}`}
            sub={`across ${kpis.states} states`}
            icon={<Building2 className="h-4 w-4" />}
            explain="Total sites under contract across every client account. Grows as REPORT lands new contracts."
          />
          <StatCard
            label="Subcontractors active"
            value={kpis.subsActive}
            format={(n) => `${Math.round(n)}`}
            sub="dispatched today"
            icon={<HardHat className="h-4 w-4" />}
            explain="Number of vendors currently on a job DISPATCH assigned them. Updates as jobs complete and new ones roll in."
          />
          <StatCard
            label="SLA at-risk"
            value={kpis.slaAtRisk}
            format={(n) => `${Math.round(n)}`}
            sub="being resolved"
            accent="primary"
            icon={<AlertTriangle className="h-4 w-4" />}
            explain="Open tickets WATCH has flagged as approaching breach. APEX is already working each one — see the Client Network for details."
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">Workforce</h2>
                <ExplainTip title="AI Workforce">
                  Four specialists run the entire contractor business: APEX orchestrates, DISPATCH assigns, WATCH protects SLAs, REPORT sells it back.
                </ExplainTip>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {agents.length} agents · {activeCount} active
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {agents.map((a) => (
                <NationalAgentCard key={a.id} agent={a} />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Activity</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">stream</span>
            </div>
            <NationalActivityFeed />
          </div>
        </section>

        <section className="mt-6">
          <ClientMap />
        </section>
        <section className="mt-6">
          <SubcontractorPanel />
        </section>
        <section className="mt-6">
          <NationalRoiPanel />
        </section>

        <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono uppercase tracking-wider">Facility19 · National Provider · v0.1</div>
          <div>Connected to UtilizeCore · last sync 8 sec ago</div>
        </footer>
      </main>

      <ClientDetailSheet />
      <NationalAgentDetailSheet />
    </div>
  );
}

export function NationalDashboardClient() {
  return (
    <NationalProvider>
      <NationalDashboard />
    </NationalProvider>
  );
}
