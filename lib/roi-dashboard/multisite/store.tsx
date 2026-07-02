import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExplainModeProvider } from "@/lib/roi-dashboard/explain-mode";
import { createSeededRandom, demoTs, seedSpark } from "@/lib/roi-dashboard/seeded-random";

export type FleetAgentId = "store" | "aria" | "volt" | "apex" | "nova";
export type SiteStatus = "ok" | "watch" | "alert";
export type ChainEventType = "resolved" | "dispatched" | "report" | "alert" | "maintenance";

export type FleetAgent = {
  id: FleetAgentId;
  name: string;
  domain: string;
  color: string;
  status: "Active" | "Scheduled" | "Idle";
  metricLabel: string;
  metricValue: number;
  metricFormat: "currency" | "percent" | "count";
  deltaText: string;
  sparkline: number[];
  description: string;
  recentActions: string[];
};

export type Site = {
  id: string;        // e.g. "0412"
  city: string;
  region: "West" | "Central" | "South" | "East";
  status: SiteStatus;
  savings: number;     // monthly savings $
  workOrders: number;  // open today
  energyDelta: number; // % vs prior year (negative = good)
  sla: number;         // %
  note: string;
  // grid coords for map
  x: number; y: number;
};

export type ChainEvent = {
  id: string;
  type: ChainEventType;
  title: string;
  detail: string;
  ts: number;
  agentId?: FleetAgentId;
  siteId?: string;
};

export type ChainKpis = {
  portfolioSavings: number;   // $
  sitesOnAi: number;
  totalSites: number;
  workOrdersToday: number;
  criticalAlerts: number;
  avgSavingsPerSite: number;
  slaCompliance: number;
  energyReduction: number;     // % vs prior year (positive number meaning reduction)
  sitesNeedingAttn: number;
};

const initialAgents: FleetAgent[] = [
  { id: "store", name: "STORE", domain: "Site Agent", color: "#10B981", status: "Active",
    metricLabel: "Avg savings / site", metricValue: 2480, metricFormat: "currency",
    deltaText: "this month", sparkline: seedSpark(28, 2200, 2700, "store"),
    description: "Lives in every store. Tunes setpoints, watches refrigeration, opens & closes the building, and escalates only what humans need to see.",
    recentActions: [
      "Closed Store #0114 HVAC ticket — auto resolved",
      "Adjusted lighting schedule across 132 stores for DST",
      "Skipped overnight cleaning on 41 low-traffic sites",
    ]},
  { id: "aria", name: "ARIA", domain: "HVAC Fleet", color: "#4F46E5", status: "Active",
    metricLabel: "SLA compliance", metricValue: 97.8, metricFormat: "percent",
    deltaText: "chain-wide", sparkline: seedSpark(28, 95, 99, "aria-ms"),
    description: "Manages every rooftop unit across the chain. Predicts failures days out, batches truck rolls by region.",
    recentActions: [
      "Predicted compressor failure at #0412 Dallas — parts shipped",
      "Reduced runtime 11% across 240 southern stores",
    ]},
  { id: "volt", name: "VOLT", domain: "Electrical Fleet", color: "#F59E0B", status: "Active",
    metricLabel: "Sites needing attn", metricValue: 3, metricFormat: "count",
    deltaText: "↓ from 11 last wk", sparkline: seedSpark(28, 3, 12, "volt-ms"),
    description: "Watches every panel, breaker, and EV charger across 847 sites. Rebalances loads, prevents brownouts.",
    recentActions: [
      "Rebalanced refrigeration load at 28 stores ahead of heat wave",
      "Flagged failing breaker at #0712 Phoenix — work order opened",
    ]},
  { id: "apex", name: "APEX", domain: "Chain Orchestrator", color: "#EC4899", status: "Active",
    metricLabel: "Energy reduction", metricValue: 19, metricFormat: "percent",
    deltaText: "vs prior year", sparkline: seedSpark(28, 14, 22, "apex-ms"),
    description: "The brain of the fleet. Routes work orders to the cheapest qualified vendor, batches truck rolls, writes everything to UtilizeCore.",
    recentActions: [
      "Batched 19 HVAC truck rolls in DFW — saved $4.2K",
      "Generated weekly chain report — sent to VP Facilities",
    ]},
  { id: "nova", name: "NOVA", domain: "Tenant Experience", color: "#0EA5E9", status: "Scheduled",
    metricLabel: "CX score", metricValue: 4.6, metricFormat: "percent",
    deltaText: "↑ 0.3 vs LY", sparkline: seedSpark(28, 4.2, 4.8, "nova-ms"),
    description: "Correlates customer-facing failures (HVAC out, restroom closed) with same-store sales. Brand protection layer.",
    recentActions: [
      "Prevented 14 restroom outages chain-wide this week",
      "Same-store sales lift +1.8% on 'no-fault' stores",
    ]},
];

const cities: Array<Pick<Site, "id" | "city" | "region" | "x" | "y">> = [
  { id: "0114", city: "Seattle",     region: "West",    x: 8,  y: 18 },
  { id: "0188", city: "Portland",    region: "West",    x: 6,  y: 26 },
  { id: "0231", city: "San Fran",    region: "West",    x: 4,  y: 42 },
  { id: "0244", city: "LA",          region: "West",    x: 10, y: 56 },
  { id: "0312", city: "Las Vegas",   region: "West",    x: 16, y: 50 },
  { id: "0322", city: "Denver",      region: "West",    x: 28, y: 42 },
  { id: "0410", city: "Phoenix",     region: "West",    x: 18, y: 60 },
  { id: "0412", city: "Dallas",      region: "Central", x: 42, y: 64 },
  { id: "0418", city: "Houston",     region: "Central", x: 46, y: 72 },
  { id: "0501", city: "Austin",      region: "Central", x: 40, y: 70 },
  { id: "0533", city: "Kansas City", region: "Central", x: 48, y: 44 },
  { id: "0540", city: "Minneapolis", region: "Central", x: 50, y: 22 },
  { id: "0612", city: "Chicago",     region: "Central", x: 58, y: 32 },
  { id: "0701", city: "Nashville",   region: "South",   x: 62, y: 52 },
  { id: "0712", city: "Atlanta",     region: "South",   x: 68, y: 58 },
  { id: "0744", city: "Miami",       region: "South",   x: 78, y: 78 },
  { id: "0801", city: "DC",          region: "East",    x: 80, y: 38 },
  { id: "0812", city: "NYC",         region: "East",    x: 86, y: 28 },
  { id: "0844", city: "Boston",      region: "East",    x: 90, y: 22 },
  { id: "0888", city: "Philly",      region: "East",    x: 84, y: 32 },
];

function makeSites(): Site[] {
  return cities.map((c) => {
    const rand = createSeededRandom(`site-${c.id}`);
    const r = rand();
    const status: SiteStatus = r < 0.08 ? "alert" : r < 0.22 ? "watch" : "ok";
    return {
      ...c,
      status,
      savings: 1800 + Math.round(rand() * 1400),
      workOrders: Math.floor(rand() * 6),
      energyDelta: -(8 + rand() * 14),
      sla: 95 + rand() * 4.5,
      note: status === "alert"
        ? "HVAC fault — tech auto-dispatched"
        : status === "watch"
          ? "Energy 8% above baseline — investigating"
          : "All systems nominal",
    };
  });
}

const initialKpis: ChainKpis = {
  portfolioSavings: 2_100_000,
  sitesOnAi: 847,
  totalSites: 1000,
  workOrdersToday: 1240,
  criticalAlerts: 3,
  avgSavingsPerSite: 2480,
  slaCompliance: 97.8,
  energyReduction: 19,
  sitesNeedingAttn: 3,
};

const initialEvents: ChainEvent[] = [
  { id: "ce1", type: "dispatched", title: "Store #0412 Dallas — HVAC fault",
    detail: "Auto-dispatched tech · ETA 22 min · WO created in UtilizeCore",
    ts: demoTs(5 * 60 * 1000), agentId: "aria", siteId: "0412" },
  { id: "ce2", type: "report", title: "Weekly chain report generated",
    detail: "847 sites · top 10 underperformers flagged · sent to VP Facilities",
    ts: demoTs(60 * 60 * 1000), agentId: "apex" },
  { id: "ce3", type: "maintenance", title: "Scheduled maintenance completed",
    detail: "200 stores · electrical panels checked · all green",
    ts: demoTs(22 * 60 * 60 * 1000), agentId: "volt" },
];

const eventTemplates: Array<Omit<ChainEvent, "id" | "ts">> = [
  { type: "resolved", title: "Store HVAC ticket auto-closed", detail: "STORE matched signal to known pattern · no truck roll", agentId: "store" },
  { type: "dispatched", title: "Truck rolls batched in region", detail: "APEX combined 12 work orders into 3 routes · saved $2.8K", agentId: "apex" },
  { type: "alert", title: "Refrigeration drift detected", detail: "STORE flagged 3 sites · ARIA pre-cooling now", agentId: "store" },
  { type: "resolved", title: "Lighting schedule shift", detail: "VOLT applied DST adjustment to 132 stores", agentId: "volt" },
  { type: "report", title: "Region performance digest", detail: "APEX summarized 240 southern stores for VP", agentId: "apex" },
  { type: "maintenance", title: "Predictive parts shipment", detail: "ARIA pre-ordered compressor for #0410 — no downtime expected", agentId: "aria" },
];

type Ctx = {
  agents: FleetAgent[];
  sites: Site[];
  events: ChainEvent[];
  kpis: ChainKpis;
  paused: boolean;
  setPaused: (v: boolean) => void;
  explainMode: boolean;
  setExplainMode: (v: boolean) => void;
  selectedAgent: FleetAgentId | null;
  setSelectedAgent: (id: FleetAgentId | null) => void;
  selectedSite: string | null;
  setSelectedSite: (id: string | null) => void;
  injectEvent: () => void;
};

const MultiSiteContext = createContext<Ctx | null>(null);

export function MultiSiteProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<FleetAgent[]>(initialAgents);
  const [sites, setSites] = useState<Site[]>(makeSites);
  const [events, setEvents] = useState<ChainEvent[]>(initialEvents);
  const [kpis, setKpis] = useState<ChainKpis>(initialKpis);
  const [paused, setPaused] = useState(false);
  const [explainMode, setExplainMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<FleetAgentId | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const tick = useCallback(() => {
    setKpis((k) => {
      const alerts = sitesAlerts.current;
      return {
        ...k,
        portfolioSavings: k.portfolioSavings + Math.round(Math.random() * 240 + 60),
        workOrdersToday: k.workOrdersToday + (Math.random() < 0.4 ? 1 : 0),
        sitesOnAi: clamp(k.sitesOnAi + (Math.random() < 0.04 ? 1 : 0), 800, k.totalSites),
        criticalAlerts: alerts,
        sitesNeedingAttn: alerts,
        avgSavingsPerSite: clamp(k.avgSavingsPerSite + (Math.random() - 0.5) * 6, 2200, 2700),
        slaCompliance: clamp(k.slaCompliance + (Math.random() - 0.5) * 0.05, 95, 99.5),
        energyReduction: clamp(k.energyReduction + (Math.random() - 0.5) * 0.08, 15, 24),
      };
    });
    setAgents((arr) => arr.map((a) => {
      const next = { ...a };
      const last = a.sparkline[a.sparkline.length - 1] ?? 50;
      const wobble = (Math.random() - 0.5) * 6;
      next.sparkline = [...a.sparkline.slice(-27), Math.max(0, last + wobble)];
      switch (a.metricFormat) {
        case "currency": next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 8, 2200, 2700); break;
        case "percent":  next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.3, 1, 100); break;
        case "count":    if (Math.random() < 0.1) next.metricValue = Math.max(0, a.metricValue + (Math.random() < 0.5 ? 1 : -1)); break;
      }
      return next;
    }));
    setSites((arr) => {
      const next = arr.map((s) => ({
        ...s,
        savings: Math.round(clamp(s.savings + (Math.random() - 0.5) * 18, 1500, 3500)),
        workOrders: Math.max(0, s.workOrders + (Math.random() < 0.05 ? (Math.random() < 0.5 ? 1 : -1) : 0)),
        energyDelta: round1(clamp(s.energyDelta + (Math.random() - 0.5) * 0.4, -25, -2)),
        sla: round1(clamp(s.sla + (Math.random() - 0.5) * 0.2, 92, 100)),
      }));
      sitesAlerts.current = next.filter((s) => s.status === "alert").length;
      return next;
    });
  }, []);

  const sitesAlerts = useRef(initialKpis.criticalAlerts);

  const injectEvent = useCallback(() => {
    const tpl = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    // optionally bind to a random site
    const useSite = Math.random() < 0.6;
    let siteId: string | undefined = tpl.siteId;
    let title = tpl.title;
    if (useSite) {
      setSites((arr) => {
        const idx = Math.floor(Math.random() * arr.length);
        siteId = arr[idx].id;
        title = `${title} — Store #${arr[idx].id} ${arr[idx].city}`;
        return arr;
      });
    }
    const ev: ChainEvent = {
      ...tpl, title, siteId,
      id: `ce-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      ts: Date.now(),
    };
    setEvents((prev) => [ev, ...prev].slice(0, 20));
    if (ev.type === "alert" && siteId) {
      setSites((arr) => arr.map((s) => s.id === siteId ? { ...s, status: "watch" } : s));
    }
  }, []);

  const tickRef = useRef(tick); tickRef.current = tick;
  const evRef = useRef(injectEvent); evRef.current = injectEvent;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => tickRef.current(), 2000);
    const e = setInterval(() => evRef.current(), 8000);
    return () => { clearInterval(t); clearInterval(e); };
  }, [paused]);

  const value = useMemo<Ctx>(() => ({
    agents, sites, events, kpis,
    paused, setPaused, explainMode, setExplainMode,
    selectedAgent, setSelectedAgent, selectedSite, setSelectedSite,
    injectEvent,
  }), [agents, sites, events, kpis, paused, explainMode, selectedAgent, selectedSite, injectEvent]);

  return <MultiSiteContext.Provider value={value}><ExplainModeProvider explainMode={explainMode}>{children}</ExplainModeProvider></MultiSiteContext.Provider>;
}

export function useMultiSite() {
  const ctx = useContext(MultiSiteContext);
  if (!ctx) throw new Error("useMultiSite must be used within MultiSiteProvider");
  return ctx;
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function round1(n: number) { return Math.round(n * 10) / 10; }

export function formatChainMetric(v: number, f: FleetAgent["metricFormat"]) {
  switch (f) {
    case "currency": return `$${Math.round(v).toLocaleString()}`;
    case "percent":  return `${v.toFixed(1)}%`;
    case "count":    return `${Math.round(v)}`;
  }
}

export function formatRelative(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}
