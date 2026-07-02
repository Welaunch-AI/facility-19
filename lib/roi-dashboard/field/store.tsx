import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExplainModeProvider } from "@/lib/roi-dashboard/explain-mode";
import { createSeededRandom, demoTs, seedSpark } from "@/lib/roi-dashboard/seeded-random";

export type FieldAgentId = "route" | "tech" | "client" | "invoice";
export type TruckStatus = "enroute" | "onsite" | "idle" | "returning";
export type FieldEventType = "rerouted" | "completed" | "follow_up" | "invoice" | "upsell" | "alert";

export type FieldAgent = {
  id: FieldAgentId;
  name: string;
  domain: string;
  color: string;
  status: "Active" | "Scheduled" | "Idle";
  metricLabel: string;
  metricValue: number;
  metricFormat: "currency" | "percent" | "rating" | "count";
  deltaText: string;
  sparkline: number[];
  description: string;
  recentActions: string[];
};

export type Truck = {
  id: string;
  unit: string;          // "Truck 7"
  tech: string;          // technician name
  trade: "HVAC" | "Plumbing" | "Electrical";
  status: TruckStatus;
  jobsToday: number;
  jobsDone: number;
  revenueToday: number;
  currentJob: string;
  etaMin: number;
  x: number; y: number;  // % position on city grid
};

export type FieldEvent = {
  id: string;
  type: FieldEventType;
  title: string;
  detail: string;
  ts: number;
  agentId?: FieldAgentId;
  truckId?: string;
};

export type FieldKpis = {
  revenueMonth: number;
  jobsMonth: number;
  trucksOnRoute: number;
  avgJobHours: number;
  revenuePerTruckDay: number;
  firstVisitFix: number;
  customerRating: number;
  upsellConversion: number;
  driveTimeReduction: number;
};

const initialAgents: FieldAgent[] = [
  { id: "route", name: "ROUTE", domain: "Dispatch Agent", color: "#4F46E5", status: "Active",
    metricLabel: "Revenue / truck / day", metricValue: 1840, metricFormat: "currency",
    deltaText: "↑ 22% vs last yr", sparkline: seedSpark(28, 1500, 1980, "route"),
    description: "Live traffic-aware dispatcher. Re-sequences every truck's route every few minutes to maximize jobs/day and minimize windshield time.",
    recentActions: [
      "Truck 7 rerouted around I-85 backup — 34 min saved",
      "Batched 3 HVAC tune-ups in Decatur into one route",
      "Promoted emergency call to Truck 3 — closest tech",
    ]},
  { id: "tech", name: "TECH", domain: "Job Optimizer", color: "#10B981", status: "Active",
    metricLabel: "First-visit fix rate", metricValue: 91, metricFormat: "percent",
    deltaText: "↑ from 76%", sparkline: seedSpark(28, 74, 92, "tech"),
    description: "Pre-loads each tech's tablet with the right parts list, service history, and AI-suggested diagnostics so jobs close on the first truck roll.",
    recentActions: [
      "Pulled service history for Johnson Ave — flagged recurring leak",
      "Ordered ahead: 2x capacitor for Truck 4's afternoon HVAC calls",
      "Suggested upsell: water heater >12 yrs at Kim R. residence",
    ]},
  { id: "client", name: "CLIENT", domain: "Customer Agent", color: "#EC4899", status: "Active",
    metricLabel: "Customer rating", metricValue: 4.9, metricFormat: "rating",
    deltaText: "last 90 days", sparkline: seedSpark(28, 4.6, 4.95, "client-fld"),
    description: "Handles every customer touch — booking confirmations, ETA texts, post-job follow-ups, and review requests. Drafts AI service summaries.",
    recentActions: [
      "Sent ETA text to Kim R. — ‘Tech is 12 min out’",
      "Drafted post-service summary for Job #882 — opened in 4 min",
      "Auto-requested Google review from 14 customers · 9 left 5★",
    ]},
  { id: "invoice", name: "INVOICE", domain: "Billing Agent", color: "#F59E0B", status: "Active",
    metricLabel: "Upsell conversion", metricValue: 34, metricFormat: "percent",
    deltaText: "AI-identified jobs", sparkline: seedSpark(28, 22, 38, "invoice"),
    description: "Generates the invoice the moment a job closes, syncs to QuickBooks, and surfaces upsell opportunities TECH spotted on-site.",
    recentActions: [
      "Invoice #882 sent — $1,240 · QuickBooks synced in 11s",
      "Quoted water heater replacement — $3,400 · awaiting approval",
      "Recovered $180 forgotten line item on Job #877",
    ]},
];

const truckSeeds: Array<Pick<Truck, "id" | "unit" | "tech" | "trade" | "x" | "y">> = [
  { id: "T-01", unit: "Truck 1",  tech: "Marcus Reed",   trade: "HVAC",       x: 18, y: 28 },
  { id: "T-02", unit: "Truck 2",  tech: "Lila Park",     trade: "Plumbing",   x: 32, y: 22 },
  { id: "T-03", unit: "Truck 3",  tech: "Devon Cole",    trade: "Electrical", x: 44, y: 36 },
  { id: "T-04", unit: "Truck 4",  tech: "Aisha Bell",    trade: "HVAC",       x: 58, y: 48 },
  { id: "T-05", unit: "Truck 5",  tech: "Jorge Ruiz",    trade: "Plumbing",   x: 28, y: 56 },
  { id: "T-06", unit: "Truck 6",  tech: "Riley Chen",    trade: "Electrical", x: 70, y: 30 },
  { id: "T-07", unit: "Truck 7",  tech: "Sam Okafor",    trade: "HVAC",       x: 64, y: 64 },
  { id: "T-08", unit: "Truck 8",  tech: "Nina Patel",    trade: "Plumbing",   x: 22, y: 72 },
  { id: "T-09", unit: "Truck 9",  tech: "Ben Hill",      trade: "Electrical", x: 80, y: 52 },
  { id: "T-10", unit: "Truck 10", tech: "Maya Lin",      trade: "HVAC",       x: 50, y: 70 },
  { id: "T-11", unit: "Truck 11", tech: "Owen Park",     trade: "Plumbing",   x: 38, y: 44 },
  { id: "T-12", unit: "Truck 12", tech: "Tara West",     trade: "Electrical", x: 74, y: 78 },
  { id: "T-13", unit: "Truck 13", tech: "Kai Brown",     trade: "HVAC",       x: 12, y: 50 },
  { id: "T-14", unit: "Truck 14", tech: "Elena Cruz",    trade: "Plumbing",   x: 56, y: 18 },
];

const jobTitles = [
  "AC compressor swap", "Drain clearing", "Panel inspection", "Furnace tune-up",
  "Water heater diag", "Outlet rewire", "Leak repair", "Thermostat install",
  "Sewer camera scope", "Breaker replace", "Coil clean", "Toilet rebuild",
];

function makeTrucks(): Truck[] {
  return truckSeeds.map((t) => {
    const rand = createSeededRandom(`truck-${t.id}`);
    const r = rand();
    const status: TruckStatus = r < 0.6 ? "enroute" : r < 0.85 ? "onsite" : r < 0.95 ? "returning" : "idle";
    const jobsToday = 4 + Math.floor(rand() * 4);
    return {
      ...t, status, jobsToday,
      jobsDone: Math.floor(rand() * jobsToday),
      revenueToday: 800 + Math.round(rand() * 1800),
      currentJob: jobTitles[Math.floor(rand() * jobTitles.length)],
      etaMin: 4 + Math.floor(rand() * 22),
    };
  });
}

const initialKpis: FieldKpis = {
  revenueMonth: 184_200,
  jobsMonth: 312,
  trucksOnRoute: 14,
  avgJobHours: 1.4,
  revenuePerTruckDay: 1840,
  firstVisitFix: 91,
  customerRating: 4.9,
  upsellConversion: 34,
  driveTimeReduction: 28,
};

const initialEvents: FieldEvent[] = [
  { id: "fe1", type: "rerouted", title: "Truck 7 rerouted — traffic alert",
    detail: "Johnson Ave job moved up · saved 34 min",
    ts: demoTs(3 * 60 * 1000), agentId: "route", truckId: "T-07" },
  { id: "fe2", type: "follow_up", title: "Customer follow-up sent — Kim R.",
    detail: "AI drafted service summary + upsell offer · opened",
    ts: demoTs(18 * 60 * 1000), agentId: "client" },
  { id: "fe3", type: "invoice", title: "Invoice auto-generated — Job #882",
    detail: "Sent to client · QuickBooks synced · $1,240",
    ts: demoTs(45 * 60 * 1000), agentId: "invoice" },
];

const eventTemplates: Array<Omit<FieldEvent, "id" | "ts">> = [
  { type: "rerouted",  title: "Route re-sequenced",          detail: "ROUTE saved 22 min of windshield time", agentId: "route" },
  { type: "completed", title: "Job closed first visit",      detail: "TECH had the right part on the truck — no callback", agentId: "tech" },
  { type: "follow_up", title: "Customer follow-up sent",     detail: "CLIENT drafted summary + review request", agentId: "client" },
  { type: "invoice",   title: "Invoice auto-generated",      detail: "INVOICE sent · QuickBooks synced in 12s", agentId: "invoice" },
  { type: "upsell",    title: "Upsell quote accepted",       detail: "TECH-flagged water heater · +$3,400 booked", agentId: "tech" },
  { type: "alert",     title: "Emergency call routed",       detail: "ROUTE pulled closest tech · 9 min ETA", agentId: "route" },
];

type Ctx = {
  agents: FieldAgent[];
  trucks: Truck[];
  events: FieldEvent[];
  kpis: FieldKpis;
  paused: boolean;
  setPaused: (v: boolean) => void;
  explainMode: boolean;
  setExplainMode: (v: boolean) => void;
  selectedAgent: FieldAgentId | null;
  setSelectedAgent: (id: FieldAgentId | null) => void;
  selectedTruck: string | null;
  setSelectedTruck: (id: string | null) => void;
  injectEvent: () => void;
};

const FieldContext = createContext<Ctx | null>(null);

export function FieldProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<FieldAgent[]>(initialAgents);
  const [trucks, setTrucks] = useState<Truck[]>(makeTrucks);
  const [events, setEvents] = useState<FieldEvent[]>(initialEvents);
  const [kpis, setKpis] = useState<FieldKpis>(initialKpis);
  const [paused, setPaused] = useState(false);
  const [explainMode, setExplainMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<FieldAgentId | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  const onRouteRef = useRef(initialKpis.trucksOnRoute);

  const tick = useCallback(() => {
    setKpis((k) => ({
      ...k,
      revenueMonth: k.revenueMonth + Math.round(Math.random() * 220 + 40),
      jobsMonth: k.jobsMonth + (Math.random() < 0.18 ? 1 : 0),
      trucksOnRoute: onRouteRef.current,
      avgJobHours: clamp(k.avgJobHours + (Math.random() - 0.5) * 0.01, 1.1, 1.7),
      revenuePerTruckDay: clamp(k.revenuePerTruckDay + (Math.random() - 0.5) * 12, 1500, 2100),
      firstVisitFix: clamp(k.firstVisitFix + (Math.random() - 0.5) * 0.2, 86, 95),
      customerRating: clamp(k.customerRating + (Math.random() - 0.5) * 0.01, 4.7, 5.0),
      upsellConversion: clamp(k.upsellConversion + (Math.random() - 0.5) * 0.3, 26, 42),
    }));
    setAgents((arr) => arr.map((a) => {
      const next = { ...a };
      const last = a.sparkline[a.sparkline.length - 1] ?? 50;
      next.sparkline = [...a.sparkline.slice(-27), Math.max(0, last + (Math.random() - 0.5) * 4)];
      switch (a.metricFormat) {
        case "currency": next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 12, 100, 1e9); break;
        case "percent":  next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.3, 0, 100); break;
        case "rating":   next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.02, 4, 5); break;
        case "count":    if (Math.random() < 0.04) next.metricValue = Math.max(0, a.metricValue + (Math.random() < 0.5 ? 1 : -1)); break;
      }
      return next;
    }));
    setTrucks((arr) => {
      const next = arr.map((t) => {
        let { x, y, etaMin, status, jobsDone, revenueToday } = t;
        // wander
        x = clamp(x + (Math.random() - 0.5) * 1.4, 4, 96);
        y = clamp(y + (Math.random() - 0.5) * 1.4, 6, 92);
        etaMin = Math.max(0, etaMin - 1);
        // state machine
        if (status === "enroute" && etaMin <= 0) status = "onsite";
        else if (status === "onsite" && Math.random() < 0.18) {
          status = "enroute";
          etaMin = 6 + Math.floor(Math.random() * 18);
          jobsDone = Math.min(t.jobsToday, jobsDone + 1);
          revenueToday += 180 + Math.round(Math.random() * 320);
        }
        return { ...t, x, y, etaMin, status, jobsDone, revenueToday };
      });
      onRouteRef.current = next.filter((t) => t.status === "enroute" || t.status === "onsite").length;
      return next;
    });
  }, []);

  const injectEvent = useCallback(() => {
    const tpl = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    let truckId: string | undefined = tpl.truckId;
    let title = tpl.title;
    if (Math.random() < 0.7) {
      setTrucks((arr) => {
        const t = arr[Math.floor(Math.random() * arr.length)];
        truckId = t.id;
        title = `${title} — ${t.unit}`;
        return arr;
      });
    }
    const ev: FieldEvent = {
      ...tpl, title, truckId,
      id: `fe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ts: Date.now(),
    };
    setEvents((prev) => [ev, ...prev].slice(0, 20));
    if (ev.type === "completed" || ev.type === "upsell") {
      setKpis((k) => ({
        ...k,
        jobsMonth: k.jobsMonth + (ev.type === "completed" ? 1 : 0),
        revenueMonth: k.revenueMonth + (ev.type === "upsell" ? 3400 : 420),
      }));
    }
  }, []);

  const tickRef = useRef(tick); tickRef.current = tick;
  const evRef = useRef(injectEvent); evRef.current = injectEvent;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => tickRef.current(), 2000);
    const e = setInterval(() => evRef.current(), 7000);
    return () => { clearInterval(t); clearInterval(e); };
  }, [paused]);

  const value = useMemo<Ctx>(() => ({
    agents, trucks, events, kpis,
    paused, setPaused, explainMode, setExplainMode,
    selectedAgent, setSelectedAgent, selectedTruck, setSelectedTruck,
    injectEvent,
  }), [agents, trucks, events, kpis, paused, explainMode, selectedAgent, selectedTruck, injectEvent]);

  return (
    <FieldContext.Provider value={value}>
      <ExplainModeProvider explainMode={explainMode}>{children}</ExplainModeProvider>
    </FieldContext.Provider>
  );
}

export function useField() {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error("useField must be used within FieldProvider");
  return ctx;
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export function formatFieldMetric(v: number, f: FieldAgent["metricFormat"]) {
  switch (f) {
    case "currency": return `$${Math.round(v).toLocaleString()}`;
    case "percent":  return `${v.toFixed(0)}%`;
    case "rating":   return `${v.toFixed(2)}`;
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
