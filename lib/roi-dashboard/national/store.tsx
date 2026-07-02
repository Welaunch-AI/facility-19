import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExplainModeProvider } from "@/lib/roi-dashboard/explain-mode";
import { createSeededRandom, demoTs, seedSpark } from "@/lib/roi-dashboard/seeded-random";

export type NatAgentId = "apex" | "dispatch" | "report" | "watch";
export type ClientStatus = "healthy" | "watch" | "atrisk";
export type NatEventType = "resolved" | "dispatched" | "report" | "alert" | "win";

export type NatAgent = {
  id: NatAgentId;
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

export type Client = {
  id: string;
  name: string;
  state: string;
  sites: number;
  contractValue: number;   // annual $
  sla: number;             // %
  status: ClientStatus;
  retention: number;       // years
  note: string;
  x: number; y: number;
};

export type Subcontractor = {
  id: string;
  name: string;
  trade: "HVAC" | "Electrical" | "Plumbing" | "Janitorial" | "Roofing";
  region: string;
  utilization: number;     // %
  jobsToday: number;
  rating: number;          // /5
};

export type NatEvent = {
  id: string;
  type: NatEventType;
  title: string;
  detail: string;
  ts: number;
  agentId?: NatAgentId;
  clientId?: string;
};

export type NatKpis = {
  revenueProtected: number;     // $
  clientSites: number;
  states: number;
  subsActive: number;
  slaAtRisk: number;
  clientRetention: number;      // %
  slaBreachRate: number;        // %
  subUtilization: number;       // %
  newContracts: number;
};

const initialAgents: NatAgent[] = [
  { id: "apex", name: "APEX", domain: "Master Orchestrator", color: "#4F46E5", status: "Active",
    metricLabel: "Client retention", metricValue: 96, metricFormat: "percent",
    deltaText: "↑ 4 pts this year", sparkline: seedSpark(28, 90, 97, "apex-nat"),
    description: "Top-level brain. Routes work across 124 client sites, balances SLA risk vs cost, and decides when to escalate to a human account manager.",
    recentActions: [
      "Resolved scheduling conflict — 3 subs · 7 sites · zero client impact",
      "Pre-warmed 4 subcontractors ahead of Friday weather event",
      "Re-priced Q2 contract proposal for TechCorp (+$140K margin)",
    ]},
  { id: "dispatch", name: "DISPATCH", domain: "Sub Coordinator", color: "#10B981", status: "Active",
    metricLabel: "SLA breach rate", metricValue: 0.8, metricFormat: "percent",
    deltaText: "↓ from 3.1%", sparkline: seedSpark(28, 0.5, 3.2, "dispatch"),
    description: "Picks the right subcontractor for every work order. Optimizes by distance, current load, trade, rating and contract terms.",
    recentActions: [
      "Rerouted HVAC sub to Northgate Mall — ETA cut 22 min",
      "Batched 14 plumbing jobs in NJ → 4 truck rolls instead of 14",
    ]},
  { id: "report", name: "REPORT", domain: "Client Reporting", color: "#EC4899", status: "Active",
    metricLabel: "New contracts won", metricValue: 3, metricFormat: "count",
    deltaText: "this quarter", sparkline: seedSpark(28, 0, 4, "report"),
    description: "Generates the QBR decks, monthly client invoices, and the win-back narratives that turn operational data into commercial proof.",
    recentActions: [
      "Sent QBR to TechCorp — $340K savings documented",
      "Generated win-back proposal for Northgate Mall renewal",
      "Built case study: 22% SLA improvement at Riverside Plaza",
    ]},
  { id: "watch", name: "WATCH", domain: "SLA Monitor", color: "#F59E0B", status: "Active",
    metricLabel: "Subcontractor util.", metricValue: 84, metricFormat: "percent",
    deltaText: "↑ efficiency", sparkline: seedSpark(28, 72, 88, "watch"),
    description: "Watches every open work order against its contractual SLA clock. Escalates to APEX the moment a job is at risk of breaching.",
    recentActions: [
      "Flagged 2 jobs at risk · escalated to APEX · both saved",
      "Detected sub no-show pattern at SunGroup — vendor swapped",
    ]},
];

const clientSeeds: Array<Pick<Client, "id" | "name" | "state" | "x" | "y">> = [
  { id: "C-101", name: "TechCorp HQ",       state: "CA", x: 6,  y: 44 },
  { id: "C-104", name: "Pacific Retail",    state: "WA", x: 10, y: 18 },
  { id: "C-112", name: "Sunset Hospitality", state: "NV", x: 16, y: 50 },
  { id: "C-118", name: "Mountain Logistics", state: "CO", x: 30, y: 42 },
  { id: "C-122", name: "Riverside Plaza",   state: "TX", x: 44, y: 66 },
  { id: "C-127", name: "Lone Star Foods",   state: "TX", x: 40, y: 70 },
  { id: "C-131", name: "Heartland Banks",   state: "MO", x: 50, y: 44 },
  { id: "C-135", name: "Northern Health",   state: "MN", x: 52, y: 22 },
  { id: "C-140", name: "Lakeside Mfg",      state: "IL", x: 58, y: 32 },
  { id: "C-144", name: "Bluegrass Retail",  state: "TN", x: 64, y: 50 },
  { id: "C-149", name: "Northgate Mall",    state: "GA", x: 70, y: 58 },
  { id: "C-153", name: "Coastal Resorts",   state: "FL", x: 78, y: 78 },
  { id: "C-158", name: "Capitol Offices",   state: "DC", x: 80, y: 38 },
  { id: "C-162", name: "Empire Towers",     state: "NY", x: 86, y: 28 },
  { id: "C-166", name: "Beacon Hill Group", state: "MA", x: 90, y: 22 },
  { id: "C-170", name: "Liberty Logistics", state: "PA", x: 82, y: 32 },
  { id: "C-174", name: "Crescent Medical",  state: "LA", x: 52, y: 76 },
  { id: "C-178", name: "Gateway Industrial", state: "MO", x: 54, y: 46 },
];

function makeClients(): Client[] {
  return clientSeeds.map((c) => {
    const rand = createSeededRandom(`client-${c.id}`);
    const r = rand();
    const status: ClientStatus = r < 0.06 ? "atrisk" : r < 0.22 ? "watch" : "healthy";
    return {
      ...c, status,
      sites: 2 + Math.floor(rand() * 18),
      contractValue: 220_000 + Math.round(rand() * 1_400_000),
      sla: 96 + rand() * 3.5,
      retention: 1 + rand() * 7,
      note: status === "atrisk"
        ? "SLA approaching breach — DISPATCH rerouting sub"
        : status === "watch"
          ? "One open ticket past 80% SLA window"
          : "All sites green · contract healthy",
    };
  });
}

const subs: Subcontractor[] = [
  { id: "S-21", name: "Apex HVAC Co",     trade: "HVAC",       region: "Southeast", utilization: 86, jobsToday: 7, rating: 4.7 },
  { id: "S-22", name: "BlueLine Electric", trade: "Electrical", region: "Northeast", utilization: 79, jobsToday: 5, rating: 4.5 },
  { id: "S-23", name: "Cascade Plumbing", trade: "Plumbing",   region: "West",      utilization: 91, jobsToday: 8, rating: 4.6 },
  { id: "S-24", name: "Crystal Janitorial", trade: "Janitorial", region: "National",utilization: 74, jobsToday: 12, rating: 4.4 },
  { id: "S-25", name: "Summit Roofing",   trade: "Roofing",    region: "Midwest",   utilization: 68, jobsToday: 3, rating: 4.8 },
];

const initialKpis: NatKpis = {
  revenueProtected: 8_400_000,
  clientSites: 124,
  states: 18,
  subsActive: 43,
  slaAtRisk: 2,
  clientRetention: 96,
  slaBreachRate: 0.8,
  subUtilization: 84,
  newContracts: 3,
};

const initialEvents: NatEvent[] = [
  { id: "ne1", type: "alert", title: "SLA risk: Northgate Mall",
    detail: "HVAC response at 47 min · escalated · sub rerouted 8 min ago",
    ts: demoTs(8 * 60 * 1000), agentId: "watch", clientId: "C-149" },
  { id: "ne2", type: "report", title: "Client QBR — TechCorp",
    detail: "AI-generated · $340K savings documented · sent to client",
    ts: demoTs(2 * 60 * 60 * 1000), agentId: "report", clientId: "C-101" },
  { id: "ne3", type: "resolved", title: "APEX resolved scheduling conflict",
    detail: "3 subcontractors · 7 sites · zero client impact",
    ts: demoTs(22 * 60 * 60 * 1000), agentId: "apex" },
];

const eventTemplates: Array<Omit<NatEvent, "id" | "ts">> = [
  { type: "dispatched", title: "Sub rerouted to closer site", detail: "DISPATCH cut ETA by 18 min · SLA preserved", agentId: "dispatch" },
  { type: "resolved",   title: "Conflict resolved across regions", detail: "APEX rebalanced 4 jobs · zero client impact", agentId: "apex" },
  { type: "report",     title: "Monthly invoice packet sent",  detail: "REPORT generated client packets · $1.4M billed", agentId: "report" },
  { type: "alert",      title: "SLA breach risk flagged",      detail: "WATCH escalated to APEX · sub being swapped", agentId: "watch" },
  { type: "win",        title: "New contract signed",          detail: "REPORT-led pitch · 12-site logistics account", agentId: "report" },
  { type: "dispatched", title: "Truck rolls batched",          detail: "DISPATCH grouped 9 jobs into 3 routes · saved $3.1K", agentId: "dispatch" },
];

type Ctx = {
  agents: NatAgent[];
  clients: Client[];
  subs: Subcontractor[];
  events: NatEvent[];
  kpis: NatKpis;
  paused: boolean;
  setPaused: (v: boolean) => void;
  explainMode: boolean;
  setExplainMode: (v: boolean) => void;
  selectedAgent: NatAgentId | null;
  setSelectedAgent: (id: NatAgentId | null) => void;
  selectedClient: string | null;
  setSelectedClient: (id: string | null) => void;
  injectEvent: () => void;
};

const NationalContext = createContext<Ctx | null>(null);

export function NationalProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<NatAgent[]>(initialAgents);
  const [clients, setClients] = useState<Client[]>(makeClients);
  const [subsState] = useState<Subcontractor[]>(subs);
  const [events, setEvents] = useState<NatEvent[]>(initialEvents);
  const [kpis, setKpis] = useState<NatKpis>(initialKpis);
  const [paused, setPaused] = useState(false);
  const [explainMode, setExplainMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<NatAgentId | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const atRiskRef = useRef(initialKpis.slaAtRisk);

  const tick = useCallback(() => {
    setKpis((k) => ({
      ...k,
      revenueProtected: k.revenueProtected + Math.round(Math.random() * 380 + 80),
      subsActive: clamp(k.subsActive + (Math.random() < 0.1 ? (Math.random() < 0.5 ? 1 : -1) : 0), 32, 60),
      slaAtRisk: atRiskRef.current,
      clientRetention: clamp(k.clientRetention + (Math.random() - 0.5) * 0.05, 92, 98),
      slaBreachRate: clamp(k.slaBreachRate + (Math.random() - 0.5) * 0.04, 0.2, 2.5),
      subUtilization: clamp(k.subUtilization + (Math.random() - 0.5) * 0.4, 72, 92),
    }));
    setAgents((arr) => arr.map((a) => {
      const next = { ...a };
      const last = a.sparkline[a.sparkline.length - 1] ?? 50;
      next.sparkline = [...a.sparkline.slice(-27), Math.max(0, last + (Math.random() - 0.5) * 4)];
      switch (a.metricFormat) {
        case "currency": next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 8, 100, 1e9); break;
        case "percent":  next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.25, 0, 100); break;
        case "count":    if (Math.random() < 0.04) next.metricValue = Math.max(0, a.metricValue + (Math.random() < 0.5 ? 1 : -1)); break;
      }
      return next;
    }));
    setClients((arr) => {
      const next = arr.map((c) => ({
        ...c,
        sla: round1(clamp(c.sla + (Math.random() - 0.5) * 0.2, 92, 100)),
        contractValue: c.contractValue,
      }));
      atRiskRef.current = next.filter((c) => c.status === "atrisk").length;
      return next;
    });
  }, []);

  const injectEvent = useCallback(() => {
    const tpl = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    let clientId: string | undefined = tpl.clientId;
    let title = tpl.title;
    if (Math.random() < 0.6) {
      setClients((arr) => {
        const c = arr[Math.floor(Math.random() * arr.length)];
        clientId = c.id;
        title = `${title} — ${c.name}`;
        return arr;
      });
    }
    const ev: NatEvent = {
      ...tpl, title, clientId,
      id: `ne-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ts: Date.now(),
    };
    setEvents((prev) => [ev, ...prev].slice(0, 20));
    if (ev.type === "alert" && clientId) {
      setClients((arr) => arr.map((c) => c.id === clientId ? { ...c, status: "watch" } : c));
    }
    if (ev.type === "win") {
      setKpis((k) => ({ ...k, newContracts: k.newContracts + 1, clientSites: k.clientSites + 6 }));
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
    agents, clients, subs: subsState, events, kpis,
    paused, setPaused, explainMode, setExplainMode,
    selectedAgent, setSelectedAgent, selectedClient, setSelectedClient,
    injectEvent,
  }), [agents, clients, subsState, events, kpis, paused, explainMode, selectedAgent, selectedClient, injectEvent]);

  return (
    <NationalContext.Provider value={value}>
      <ExplainModeProvider explainMode={explainMode}>{children}</ExplainModeProvider>
    </NationalContext.Provider>
  );
}

export function useNational() {
  const ctx = useContext(NationalContext);
  if (!ctx) throw new Error("useNational must be used within NationalProvider");
  return ctx;
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function round1(n: number) { return Math.round(n * 10) / 10; }

export function formatNatMetric(v: number, f: NatAgent["metricFormat"]) {
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
