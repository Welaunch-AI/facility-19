"use client";

import { DollarSign, Store, ClipboardList, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/roi-dashboard/facility19/DashboardHeader";
import { StatCard } from "@/components/roi-dashboard/facility19/StatCard";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";
import { MultiSiteProvider, useMultiSite } from "@/lib/roi-dashboard/multisite/store";
import { FleetAgentCard } from "@/components/roi-dashboard/multisite/FleetAgentCard";
import { SiteMap } from "@/components/roi-dashboard/multisite/SiteMap";
import { ChainActivityFeed } from "@/components/roi-dashboard/multisite/ChainActivityFeed";
import { ChainRoiPanel } from "@/components/roi-dashboard/multisite/ChainRoiPanel";
import { MultiSiteControls } from "@/components/roi-dashboard/multisite/MultiSiteControls";
import { SiteDetailSheet } from "@/components/roi-dashboard/multisite/SiteDetailSheet";
import { FleetAgentDetailSheet } from "@/components/roi-dashboard/multisite/FleetAgentDetailSheet";

function MultiSiteDashboard() {
  const { agents, kpis } = useMultiSite();
  const activeCount = agents.filter((a) => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-[1400px] px-6 py-8 md:py-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Multi-Site Retail Chain · Centralized Facility Dept
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Your AI fleet is running {kpis.sitesOnAi} stores.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              One AI employee in every store, three fleet agents over the whole chain, one orchestrator routing every truck roll.
              Click any tile to drill into a store, agent or event.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <MultiSiteControls />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Portfolio savings"
            value={kpis.portfolioSavings}
            format={(n) => `$${(Math.round(n) / 1_000_000).toFixed(2)}M`}
            sub={`across ${kpis.sitesOnAi} sites · live`}
            accent="dark"
            icon={<DollarSign className="h-4 w-4" />}
            explain="Sum of labor + energy + avoided-repair savings across every site on AI, recomputed every couple seconds."
          />
          <StatCard
            label="Sites on AI"
            value={kpis.sitesOnAi}
            format={(n) => `${Math.round(n)}`}
            sub={`of ${kpis.totalSites} total`}
            icon={<Store className="h-4 w-4" />}
            explain="Stores where the AI workforce is fully active. The remainder are in pilot / rollout."
          />
          <StatCard
            label="Work orders today"
            value={kpis.workOrdersToday}
            format={(n) => `${Math.round(n).toLocaleString()}`}
            sub="chain-wide"
            icon={<ClipboardList className="h-4 w-4" />}
            explain="Tickets opened today across the chain. Most are auto-resolved by STORE before a human ever sees them."
          />
          <StatCard
            label="Critical alerts"
            value={kpis.criticalAlerts}
            format={(n) => `${Math.round(n)}`}
            sub="require attention"
            accent="primary"
            icon={<AlertTriangle className="h-4 w-4" />}
            explain="Sites the fleet has escalated to a human. Click 'Live Site Network' below to see which ones."
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">Fleet Workforce</h2>
                <ExplainTip title="Fleet Workforce">
                  Each card is an AI specialist running across the entire chain. STORE lives in every store; ARIA, VOLT and APEX operate fleet-wide.
                </ExplainTip>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {agents.length} agents · {activeCount} active
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {agents.map((a) => (
                <FleetAgentCard key={a.id} agent={a} />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Activity</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">stream</span>
            </div>
            <ChainActivityFeed />
          </div>
        </section>

        <section className="mt-6">
          <SiteMap />
        </section>
        <section className="mt-6">
          <ChainRoiPanel />
        </section>

        <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono uppercase tracking-wider">Facility19 · Multi-Site Retail Chain · v0.1</div>
          <div>Connected to UtilizeCore · last sync 8 sec ago</div>
        </footer>
      </main>

      <SiteDetailSheet />
      <FleetAgentDetailSheet />
    </div>
  );
}

export function MultiSiteDashboardClient() {
  return (
    <MultiSiteProvider>
      <MultiSiteDashboard />
    </MultiSiteProvider>
  );
}
