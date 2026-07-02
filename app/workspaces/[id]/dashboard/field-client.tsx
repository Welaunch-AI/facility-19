"use client";

import { DollarSign, ClipboardCheck, Truck, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/roi-dashboard/facility19/DashboardHeader";
import { StatCard } from "@/components/roi-dashboard/facility19/StatCard";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";
import { FieldProvider, useField } from "@/lib/roi-dashboard/field/store";
import { FieldAgentCard } from "@/components/roi-dashboard/field/FieldAgentCard";
import { FieldAgentDetailSheet } from "@/components/roi-dashboard/field/FieldAgentDetailSheet";
import { TruckMap } from "@/components/roi-dashboard/field/TruckMap";
import { TruckDetailSheet } from "@/components/roi-dashboard/field/TruckDetailSheet";
import { FieldActivityFeed } from "@/components/roi-dashboard/field/FieldActivityFeed";
import { FleetPanel } from "@/components/roi-dashboard/field/FleetPanel";
import { FieldRoiPanel } from "@/components/roi-dashboard/field/FieldRoiPanel";
import { FieldControls } from "@/components/roi-dashboard/field/FieldControls";
import { FleetMapDemoSection } from "@/components/roi-dashboard/field/fleet-map/FleetMapDemoSection";

function FieldDashboard() {
  const { agents, kpis } = useField();
  const activeCount = agents.filter((a) => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-[1400px] px-6 py-8 md:py-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Field Service Provider · Trade Company
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Your AI is running {kpis.trucksOnRoute} trucks and closing jobs as they land.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              ROUTE dispatches around traffic. TECH puts the right part on the right truck. CLIENT keeps customers in the loop. INVOICE bills before the tech leaves the driveway.
            </p>
          </div>
          <FieldControls />
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Revenue generated"
            value={kpis.revenueMonth}
            format={(n) => `$${Math.round(n).toLocaleString()}`}
            sub="this month · live"
            accent="dark"
            icon={<DollarSign className="h-4 w-4" />}
            explain="Sum of every invoice INVOICE has sent this month — ticking up as jobs close in real time."
          />
          <StatCard
            label="Jobs completed"
            value={kpis.jobsMonth}
            format={(n) => `${Math.round(n)}`}
            sub="this month"
            icon={<ClipboardCheck className="h-4 w-4" />}
            explain="Total work orders closed first-visit and billed. ROUTE + TECH together drive this number up."
          />
          <StatCard
            label="Trucks on route"
            value={kpis.trucksOnRoute}
            format={(n) => `${Math.round(n)}`}
            sub="right now"
            icon={<Truck className="h-4 w-4" />}
            explain="Trucks currently en route or on site. Updates every couple seconds as the fleet moves."
          />
          <StatCard
            label="Avg job time"
            value={kpis.avgJobHours}
            format={(n) => `${n.toFixed(1)} hrs`}
            sub="↓ 28% vs last yr"
            accent="primary"
            icon={<Clock className="h-4 w-4" />}
            explain="Mean wrench-time per job. Lower = more jobs/truck/day = more revenue. TECH's pre-loaded diagnostics drive this down."
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">Workforce</h2>
                <ExplainTip title="AI Workforce">
                  Four agents run the trade business: ROUTE dispatches, TECH preps the job, CLIENT handles the customer, INVOICE bills and books upsells.
                </ExplainTip>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {agents.length} agents · {activeCount} active
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {agents.map((a) => (
                <FieldAgentCard key={a.id} agent={a} />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Activity</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">stream</span>
            </div>
            <FieldActivityFeed />
          </div>
        </section>

        <section className="mt-6">
          <TruckMap />
        </section>
        <section className="mt-10">
          <FleetMapDemoSection />
        </section>
        <section className="mt-6">
          <FleetPanel />
        </section>
        <section className="mt-6">
          <FieldRoiPanel />
        </section>

        <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono uppercase tracking-wider">Facility19 · Field Service · v0.1</div>
          <div>Connected to ServiceTitan · QuickBooks synced 6 sec ago</div>
        </footer>
      </main>

      <TruckDetailSheet />
      <FieldAgentDetailSheet />
    </div>
  );
}

export function FieldDashboardClient() {
  return (
    <FieldProvider>
      <FieldDashboard />
    </FieldProvider>
  );
}
