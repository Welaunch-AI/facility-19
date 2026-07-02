"use client";

import { DollarSign, Clock, ClipboardCheck, Bot } from "lucide-react";
import { MonthlyRoiReport } from "@/components/roi-dashboard/facility19/MonthlyRoiReport";
import { DashboardHeader } from "@/components/roi-dashboard/facility19/DashboardHeader";
import { StatCard } from "@/components/roi-dashboard/facility19/StatCard";
import { AgentCard } from "@/components/roi-dashboard/facility19/AgentCard";
import { ActivityFeed } from "@/components/roi-dashboard/facility19/ActivityFeed";
import { FloorPlan } from "@/components/roi-dashboard/facility19/FloorPlan";
import { RoiPanel } from "@/components/roi-dashboard/facility19/RoiPanel";
import { Facility19Provider, useFacility19 } from "@/lib/roi-dashboard/facility19/store";
import { LiveControls } from "@/components/roi-dashboard/facility19/LiveControls";
import { AgentDetailSheet } from "@/components/roi-dashboard/facility19/AgentDetailSheet";
import { ZoneDetailSheet } from "@/components/roi-dashboard/facility19/ZoneDetailSheet";
import { ExplainTip } from "@/components/roi-dashboard/facility19/ExplainTip";

function SingleFacilityDashboard() {
  const { agents, kpis } = useFacility19();
  const activeCount = agents.filter((a) => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-[1400px] px-6 py-8 md:py-10">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Tower A · Midtown · 412,000 sq ft
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Your AI team is on shift.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Five AI employees handling HVAC, electrical, plumbing, cleaning and dispatch — connected to your CMMS, working every minute. Click anything to see what they&apos;re doing.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <LiveControls />
            <MonthlyRoiReport />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total savings"
            value={kpis.totalSavings}
            format={(n) => `$${Math.round(n).toLocaleString()}`}
            sub="since deployment · live"
            accent="dark"
            icon={<DollarSign className="h-4 w-4" />}
            explain="Sum of labor + energy + avoided-repair savings, recomputed every couple seconds from agent telemetry."
          />
          <StatCard
            label="Hours freed"
            value={kpis.hoursFreed}
            format={(n) => `${Math.round(n)} hrs`}
            sub="this month"
            icon={<Clock className="h-4 w-4" />}
            explain="Hours your human team did NOT have to spend because the agents resolved the issue first."
          />
          <StatCard
            label="Work orders closed"
            value={kpis.workOrdersClosed}
            format={(n) => `${Math.round(n)}`}
            sub="avg 4.2 min response"
            icon={<ClipboardCheck className="h-4 w-4" />}
            explain="Tickets opened in your CMMS and closed by an AI without dispatching a tech."
          />
          <StatCard
            label="AI employees"
            value={agents.length}
            format={(n) => `${Math.round(n)}`}
            sub={`${activeCount} active now`}
            accent="primary"
            icon={<Bot className="h-4 w-4" />}
            explain="Specialist agents on duty 24/7. Click any card below to see what each one is doing."
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider">Workforce</h2>
                <ExplainTip title="Workforce">
                  Each card is a specialist AI employee. Sparkline = last minute of work. Click for full telemetry, recent actions and the zones it manages.
                </ExplainTip>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {agents.length} agents · {activeCount} active
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {agents.map((a) => (
                <AgentCard key={a.id} agent={a} />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider">Activity</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">stream</span>
            </div>
            <ActivityFeed />
          </div>
        </section>

        <section className="mt-6">
          <FloorPlan />
        </section>
        <section className="mt-6">
          <RoiPanel />
        </section>

        <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono uppercase tracking-wider">Facility19 · Single Facility Director · v0.1</div>
          <div>Connected to CMMS · last sync 12 sec ago</div>
        </footer>
      </main>

      <AgentDetailSheet />
      <ZoneDetailSheet />
    </div>
  );
}

export function SingleFacilityClient() {
  return (
    <Facility19Provider>
      <SingleFacilityDashboard />
    </Facility19Provider>
  );
}
