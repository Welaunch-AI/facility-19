// Shared data for Facility19 — V2 copy (anonymized, no platform names)

const AGENTS = [
  {
    id: 'linda',
    name: 'Linda',
    role: 'Field Ops Coordinator',
    mono: 'LD',
    hue: 230,
    gender: 'f',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentLinda) || 'assets/agents/linda.png',
    metric: { label: 'Tech routes optimized today', value: 63 },
    status: 'on-shift',
    shift: '24/7',
    stack: ['Dispatch', 'GPS', 'Telephony'],
    stream: [
      { t: '09:42', msg: 'Rerouted Tech #14, emergency HVAC at Site 2104' },
      { t: '09:31', msg: 'Morning routes dispatched · 38 stops across 6 techs' },
      { t: '09:08', msg: 'Traffic delay absorbed, ETA held for Site 2087' },
    ],
    desc: "Linda plans your technicians' routes the night before and adjusts them in real time when emergencies hit. She doesn't panic. She doesn't put you on hold. She just reroutes, quietly, correctly, every time.",
  },
  {
    id: 'emma',
    name: 'Emma',
    role: 'Front Desk, 24/7',
    mono: 'EM',
    hue: 290,
    gender: 'f',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentEmma) || 'assets/agents/emma.png',
    metric: { label: 'Calls answered this week', value: 2481 },
    status: 'on-call',
    shift: '24/7',
    stack: ['Call intake', 'CRM', 'Scheduling'],
    stream: [
      { t: '09:44', msg: 'Intake call · HVAC issue · Site #4102 · ticket created' },
      { t: '09:39', msg: 'After-hours call logged · routed to on-call Tech #7' },
      { t: '09:22', msg: 'Callback scheduled · vendor inquiry, North region' },
    ],
    desc: "Emma picks up every single call, day, night, weekends. She logs the conversation, finds open time slots, updates your system, and never once sounds annoyed to hear from a client. Your customers think you hired someone amazing. You kind of did.",
  },
  {
    id: 'molly',
    name: 'Molly',
    role: 'Asset Intelligence Specialist',
    mono: 'MO',
    hue: 170,
    gender: 'f',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentMolly) || 'assets/agents/molly.png',
    metric: { label: 'Assets profiled this month', value: 1204 },
    status: 'indexing',
    shift: '24/7',
    stack: ['Asset DB', 'Doc storage', 'OCR'],
    stream: [
      { t: '09:40', msg: 'Indexed Carrier 50TCQA12 · manual + parts list attached' },
      { t: '09:18', msg: 'New asset uploaded at Site 2093 · profile built' },
      { t: '08:55', msg: 'Service history merged for chiller #88-A' },
    ],
    desc: "When a tech uploads a new piece of equipment, Molly gets to work. She pulls device specs, manufacturer codes, and the full service manual, so the next technician who touches it already knows exactly what they're dealing with.",
  },
  {
    id: 'matt',
    name: 'Matt',
    role: 'Procurement Specialist',
    mono: 'MT',
    hue: 25,
    gender: 'm',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentMatt) || 'assets/agents/matt.png',
    metric: { label: 'Saved on parts YTD', value: 184200, prefix: '$' },
    status: 'sourcing',
    shift: '24/7',
    stack: ['Vendor catalogs', 'ERP', 'Approvals'],
    stream: [
      { t: '09:43', msg: 'Quoted 3 vendors for compressor · best price locked' },
      { t: '09:12', msg: 'PO #10348 issued, 14% under approved budget' },
      { t: '08:49', msg: 'Backorder flagged · alternate SKU sourced' },
    ],
    desc: "The second a client approves a repair, Matt's already shopping. He checks inventory across multiple vendors in real time, finds the best price, and yes, he negotiates. Your margins will notice.",
  },
  {
    id: 'morgan',
    name: 'Morgan',
    role: 'Accounts & Contracts',
    mono: 'MG',
    hue: 340,
    gender: 'f',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentMorgan) || 'assets/agents/morgan.png',
    metric: { label: 'DSO reduced to', value: 28, suffix: ' days' },
    status: 'following-up',
    shift: 'Business hrs',
    stack: ['Accounting', 'Payments', 'CRM'],
    stream: [
      { t: '09:41', msg: 'Follow-up sent · Invoice #4421 · 9 days overdue' },
      { t: '09:05', msg: 'Renewal flagged · Contract #118 expires in 45d' },
      { t: '08:33', msg: 'Payment confirmed · $12,400 · Invoice #4398' },
    ],
    desc: "Morgan makes sure you get paid. She tracks outstanding invoices, sends follow-ups before things get awkward, and flags every contract for renewal before it expires. Think of her as your most organized, and most diplomatic, AR person ever.",
  },
  {
    id: 'renee',
    name: 'Renée',
    role: 'Fleet & Field Monitor',
    mono: 'RN',
    hue: 190,
    gender: 'f',
    photo: (typeof window !== 'undefined' && window.__resources && window.__resources.agentRenee) || 'assets/agents/renee.png',
    metric: { label: 'Trucks monitored live', value: 142 },
    status: 'watching',
    shift: '24/7',
    stack: ['Telematics', 'GPS', 'Voice'],
    stream: [
      { t: '09:42', msg: 'Called Tech #22, job closed, truck idle 18 min' },
      { t: '09:20', msg: 'Flagged GPS drift · Site #1908 visit unverified' },
      { t: '08:58', msg: 'Verified 11 AM arrivals across North region' },
    ],
    desc: "Renée watches every truck on the field, all day, no blinking. Job done at a site and the truck hasn't moved? She calls the driver. Not a text. A call. Because sometimes people need that.",
  },
];

const METRICS = [
  { value: 2481, suffix: '', label: 'Calls answered this week', sub: 'across deployed agents' },
  { value: 94, suffix: '%', label: 'First-call resolution', sub: 'vs. 62% industry baseline' },
  { value: 18, suffix: 'hr', label: 'Back-office hours saved / day', sub: 'per operation, avg.' },
  { value: 184, prefix: '$', suffix: 'K', label: 'Saved on procurement YTD', sub: 'one mid-market operator' },
];

// Generic capability badges, no platform names
const CAPABILITIES = [
  'Work orders', 'Dispatch', 'Routing & GPS', 'Call intake', 'Scheduling',
  'Vendor catalogs', 'Procurement', 'Accounting', 'Payments', 'CRM',
  'Asset management', 'Document storage', 'Telematics', 'Compliance', 'Reporting',
];

const STEPS = [
  {
    n: '01',
    t: 'Discovery call',
    d: "We map your workflow end-to-end: platforms, handoffs, the places coordination is eating your team alive.",
    len: 'Week 1',
  },
  {
    n: '02',
    t: 'Pilot agent',
    d: "We deploy one agent on one process: dispatch, intake, or procurement. Wired into your actual stack.",
    len: 'Weeks 2 to 4',
  },
  {
    n: '03',
    t: 'Production cutover',
    d: "Agent runs live alongside your team. Performance reviewed weekly. Monitored 24/7 by our 40-person ops team.",
    len: 'Week 5+',
  },
  {
    n: '04',
    t: 'Expand the roster',
    d: "Add agents as you find wins. Some clients run 20 to 30, a full network purpose-built for their operation.",
    len: 'Ongoing',
  },
];

const TESTIMONIALS = [
  {
    q: 'The dispatch check-in, the GPS verification, the automatic ticket update, that is all we have needed for 30 years and nobody built it.',
    who: 'CEO',
    where: 'Commercial HVAC · 30 years in FM',
  },
  {
    q: 'The vendor onboarding agent is exactly the coordination overhead that is killing our margin. I can already see two agents working for our operation right now.',
    who: 'VP Operations',
    where: 'Global Facility Management · 23 years in FM',
  },
  {
    q: 'Document attachment, dispatch follow-up, asset profile population, three immediate pain points for every client I support.',
    who: 'Operations Director',
    where: 'Fire & Safety Services',
  },
  {
    q: "This isn't something I'd pilot. This is something I'd roll out across the entire network.",
    who: 'Executive',
    where: 'Multi-Site Facility Network',
  },
];

window.F19 = { AGENTS, METRICS, CAPABILITIES, STEPS, TESTIMONIALS };
