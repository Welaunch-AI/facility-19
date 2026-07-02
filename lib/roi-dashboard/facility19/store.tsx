import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExplainModeProvider } from "@/lib/roi-dashboard/explain-mode";
import { demoTs, seedSpark } from "@/lib/roi-dashboard/seeded-random";

// ---------------- Types ----------------
export type AgentId = "aria" | "volt" | "flow" | "nova" | "dex";
export type ZoneStatus = "ok" | "watch" | "alert";
export type EventType = "resolved" | "rebalanced" | "report" | "alert";

export type Agent = {
  id: AgentId;
  name: string;
  domain: string;
  icon: "hvac" | "electric" | "plumbing" | "cleaning" | "dispatch";
  color: string;
  status: "Active" | "Scheduled" | "Idle";
  metricLabel: string;
  metricValue: number;        // numeric, used for live animation
  metricFormat: "currency" | "percent" | "count" | "minutes";
  deltaText: string;
  // telemetry sparkline
  sparkline: number[];
  description: string;        // what this AI does (for explain mode + drill-down)
  recentActions: string[];
};

export type Zone = {
  id: string;
  label: string;
  x: number; y: number; w: number; h: number;
  status: ZoneStatus;
  agentId: AgentId;
  temp: number;       // °F
  humidity: number;   // %
  load: number;       // %
  note: string;
};

export type LiveEvent = {
  id: string;
  type: EventType;
  title: string;
  detail: string;
  ts: number;
  agentId?: AgentId;
  zoneId?: string;
};

export type Kpis = {
  totalSavings: number;
  hoursFreed: number;
  workOrdersClosed: number;
  agentsActive: number;
};

// ---------------- Initial state ----------------
const initialAgents: Agent[] = [
  { id: "aria", name: "ARIA", domain: "HVAC", icon: "hvac", color: "#4F46E5", status: "Active",
    metricLabel: "Energy saved", metricValue: 9100, metricFormat: "currency",
    deltaText: "↑ 14% vs last mo", sparkline: seedSpark(28, 70, 95, "aria"),
    description: "Continuously tunes airflow, setpoints and chiller load across all zones to keep tenants comfortable while minimizing kWh.",
    recentActions: [
      "Corrected 2°F drift in Zone 3 by re-balancing dampers",
      "Pre-cooled atrium ahead of 11am occupancy spike",
      "Scheduled chiller #2 for predictive maintenance",
    ]},
  { id: "volt", name: "VOLT", domain: "Electrical", icon: "electric", color: "#F59E0B", status: "Active",
    metricLabel: "SLA compliance", metricValue: 99.1, metricFormat: "percent",
    deltaText: "↑ vs 95% target", sparkline: seedSpark(28, 92, 100, "volt"),
    description: "Watches every circuit. Rebalances loads, flags failing breakers, prevents cascading trips.",
    recentActions: [
      "Rebalanced server room circuit B from 89% to 62%",
      "Flagged early-warning thermal signature on panel 4-C",
    ]},
  { id: "flow", name: "FLOW", domain: "Plumbing", icon: "plumbing", color: "#0EA5E9", status: "Active",
    metricLabel: "Leaks prevented", metricValue: 3, metricFormat: "count",
    deltaText: "$8.4K avoided", sparkline: seedSpark(28, 0, 4, "flow"),
    description: "Acoustic + flow-rate models detect micro-leaks days before they're visible. Auto-isolates and dispatches.",
    recentActions: [
      "Isolated micro-leak on riser 7 — dispatched tech",
      "Flushed dormant line in cafeteria to prevent bio-growth",
    ]},
  { id: "nova", name: "NOVA", domain: "Cleaning", icon: "cleaning", color: "#10B981", status: "Scheduled",
    metricLabel: "Avg response", metricValue: 4.2, metricFormat: "minutes",
    deltaText: "↓ 22% faster", sparkline: seedSpark(28, 3, 7, "nova"),
    description: "Coordinates the cleaning crew against real occupancy data — only deploys where and when needed.",
    recentActions: [
      "Re-routed crew to Lobby after spill detected by camera",
      "Skipped cleaning of unused conference rooms",
    ]},
  { id: "dex", name: "DEX", domain: "Dispatch", icon: "dispatch", color: "#EC4899", status: "Active",
    metricLabel: "Open work orders", metricValue: 2, metricFormat: "count",
    deltaText: "both scheduled", sparkline: seedSpark(28, 0, 5, "dex"),
    description: "The conductor. Ingests every signal, decides which agent (or human tech) handles what, and writes it back to your CMMS.",
    recentActions: [
      "Auto-resolved 3 work orders this hour (no human touch)",
      "Escalated chiller #2 efficiency drop to a tech",
    ]},
];

const initialZones: Zone[] = [
  { id: "z1", label: "Lobby & Atrium", x: 3,  y: 3,  w: 30, h: 24, status: "ok",    agentId: "nova", temp: 71, humidity: 44, load: 38, note: "Comfort optimal" },
  { id: "z2", label: "Server Room",    x: 35, y: 3,  w: 30, h: 24, status: "ok",    agentId: "volt", temp: 68, humidity: 38, load: 62, note: "Circuit B rebalanced" },
  { id: "z3", label: "Zone 3 — South", x: 67, y: 3,  w: 30, h: 24, status: "watch", agentId: "aria", temp: 73, humidity: 51, load: 48, note: "ARIA correcting 2°F drift" },
  { id: "z4", label: "Tenant Floor 4", x: 3,  y: 29, w: 30, h: 24, status: "ok",    agentId: "aria", temp: 71, humidity: 45, load: 41, note: "All setpoints met" },
  { id: "z5", label: "Mechanical",     x: 35, y: 29, w: 30, h: 24, status: "ok",    agentId: "flow", temp: 76, humidity: 40, load: 55, note: "Pump cycle nominal" },
  { id: "z6", label: "Tenant Floor 5", x: 67, y: 29, w: 30, h: 24, status: "ok",    agentId: "aria", temp: 70, humidity: 46, load: 39, note: "All setpoints met" },
  { id: "z7", label: "Loading Dock",   x: 3,  y: 55, w: 30, h: 22, status: "ok",    agentId: "volt", temp: 74, humidity: 48, load: 22, note: "Bay doors closed" },
  { id: "z8", label: "Cafeteria",      x: 35, y: 55, w: 30, h: 22, status: "ok",    agentId: "nova", temp: 72, humidity: 50, load: 67, note: "Lunch rush ramping" },
  { id: "z9", label: "Plant Room",     x: 67, y: 55, w: 30, h: 22, status: "alert", agentId: "flow", temp: 81, humidity: 62, load: 88, note: "FLOW investigating pump #3" },
];

const initialKpis: Kpis = {
  totalSavings: 127400,
  hoursFreed: 412,
  workOrdersClosed: 76,
  agentsActive: 4,
};

const initialEvents: LiveEvent[] = [
  { id: "e1", type: "resolved", title: "Zone 3 airflow corrected", detail: "Detected 2°F drift · auto-resolved · no tech dispatched", ts: demoTs(2 * 60 * 1000), agentId: "aria", zoneId: "z3" },
  { id: "e2", type: "rebalanced", title: "Server room load rebalanced", detail: "Circuit B at 89% · redistributed · no downtime", ts: demoTs(14 * 60 * 1000), agentId: "volt", zoneId: "z2" },
  { id: "e3", type: "report", title: "Monthly ROI report ready", detail: "$127K savings documented · sent to building owner", ts: demoTs(60 * 60 * 1000), agentId: "dex" },
  { id: "e4", type: "alert", title: "Chiller #2 efficiency dropped 6%", detail: "Predictive maintenance scheduled · parts ordered", ts: demoTs(3 * 60 * 60 * 1000), agentId: "aria" },
];

// ---------------- Event templates for simulation ----------------
const eventTemplates: Array<Omit<LiveEvent, "id" | "ts">> = [
  { type: "resolved", title: "Setpoint drift auto-corrected", detail: "ARIA tuned VAV box · 0.8°F brought back in band", agentId: "aria", zoneId: "z4" },
  { type: "rebalanced", title: "Lighting circuit rebalanced", detail: "VOLT shifted load before peak window", agentId: "volt", zoneId: "z7" },
  { type: "resolved", title: "Cafeteria humidity normalized", detail: "NOVA + ARIA coordinated exhaust + reheat", agentId: "nova", zoneId: "z8" },
  { type: "alert", title: "Plant room pump #3 vibration up 9%", detail: "FLOW scheduled inspection · no shutdown needed", agentId: "flow", zoneId: "z9" },
  { type: "resolved", title: "Work order WO-2041 auto-closed", detail: "DEX matched signal to known pattern · resolved", agentId: "dex" },
  { type: "rebalanced", title: "Pre-cool started for Floor 5", detail: "ARIA anticipating 14:00 occupancy", agentId: "aria", zoneId: "z6" },
  { type: "resolved", title: "Micro-leak isolated on riser 7", detail: "FLOW closed valve · tech dispatched", agentId: "flow", zoneId: "z5" },
];

// ---------------- Context ----------------
type Ctx = {
  agents: Agent[];
  zones: Zone[];
  events: LiveEvent[];
  kpis: Kpis;
  paused: boolean;
  setPaused: (v: boolean) => void;
  explainMode: boolean;
  setExplainMode: (v: boolean) => void;
  selectedAgent: AgentId | null;
  setSelectedAgent: (id: AgentId | null) => void;
  selectedZone: string | null;
  setSelectedZone: (id: string | null) => void;
  injectEvent: () => void;
};

const Facility19Context = createContext<Ctx | null>(null);

export function Facility19Provider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [events, setEvents] = useState<LiveEvent[]>(initialEvents);
  const [kpis, setKpis] = useState<Kpis>(initialKpis);
  const [paused, setPaused] = useState(false);
  const [explainMode, setExplainMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const tick = useCallback(() => {
    // Drift KPIs
    setKpis((k) => ({
      totalSavings: k.totalSavings + Math.round(Math.random() * 18 + 4),
      hoursFreed: k.hoursFreed + (Math.random() < 0.25 ? 1 : 0),
      workOrdersClosed: k.workOrdersClosed + (Math.random() < 0.12 ? 1 : 0),
      agentsActive: k.agentsActive,
    }));
    // Drift agent metrics + sparkline
    setAgents((arr) => arr.map((a) => {
      const next = { ...a };
      const last = a.sparkline[a.sparkline.length - 1] ?? 50;
      const wobble = (Math.random() - 0.5) * 6;
      const newPoint = Math.max(0, last + wobble);
      next.sparkline = [...a.sparkline.slice(-27), newPoint];
      switch (a.metricFormat) {
        case "currency": next.metricValue = a.metricValue + Math.round(Math.random() * 12); break;
        case "percent":  next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.3, 90, 100); break;
        case "count":    if (Math.random() < 0.08) next.metricValue = Math.max(0, a.metricValue + (Math.random() < 0.5 ? 1 : -1)); break;
        case "minutes":  next.metricValue = clamp(a.metricValue + (Math.random() - 0.5) * 0.2, 2, 8); break;
      }
      return next;
    }));
    // Drift zones
    setZones((arr) => arr.map((z) => ({
      ...z,
      temp: round1(clamp(z.temp + (Math.random() - 0.5) * 0.3, 65, 84)),
      humidity: Math.round(clamp(z.humidity + (Math.random() - 0.5) * 1.2, 30, 70)),
      load: Math.round(clamp(z.load + (Math.random() - 0.5) * 4, 10, 95)),
    })));
  }, []);

  const injectEvent = useCallback(() => {
    const tpl = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const ev: LiveEvent = { ...tpl, id: `e-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ts: Date.now() };
    setEvents((prev) => [ev, ...prev].slice(0, 20));
    // Briefly pulse the involved zone
    if (ev.zoneId && ev.type === "alert") {
      setZones((arr) => arr.map((z) => z.id === ev.zoneId ? { ...z, status: "watch" } : z));
    }
  }, []);

  // Simulation loops
  const tickRef = useRef(tick);
  tickRef.current = tick;
  const evRef = useRef(injectEvent);
  evRef.current = injectEvent;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => tickRef.current(), 2000);
    const e = setInterval(() => evRef.current(), 9000);
    return () => { clearInterval(t); clearInterval(e); };
  }, [paused]);

  const value = useMemo<Ctx>(() => ({
    agents, zones, events, kpis,
    paused, setPaused, explainMode, setExplainMode,
    selectedAgent, setSelectedAgent, selectedZone, setSelectedZone,
    injectEvent,
  }), [agents, zones, events, kpis, paused, explainMode, selectedAgent, selectedZone, injectEvent]);

  return <Facility19Context.Provider value={value}><ExplainModeProvider explainMode={explainMode}>{children}</ExplainModeProvider></Facility19Context.Provider>;
}

export function useFacility19() {
  const ctx = useContext(Facility19Context);
  if (!ctx) throw new Error("useFacility19 must be used within Facility19Provider");
  return ctx;
}

// ---------------- Helpers ----------------
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function round1(n: number) { return Math.round(n * 10) / 10; }

export function formatMetric(v: number, f: Agent["metricFormat"]) {
  switch (f) {
    case "currency": return `$${Math.round(v).toLocaleString()}`;
    case "percent":  return `${v.toFixed(1)}%`;
    case "count":    return `${Math.round(v)}`;
    case "minutes":  return `${v.toFixed(1)} min`;
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
