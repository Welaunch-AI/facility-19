/** Source: F19 Agent Catalog — 49 agents across 12 clusters */

export type RawCatalogAgent = {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
};

export const AGENT_CLUSTERS = [
  "Field Operations",
  "Fleet & Violations",
  "Payroll & Timekeeping",
  "Expense & Spend",
  "Contracts, Renewals & NTE",
  "Field Compliance & Inspections",
  "Inventory, Parts & Assets",
  "Vendor Management",
  "Finance & Billing",
  "Customer Service & Retention",
  "HR & Workforce",
  "Oversight & Intelligence",
] as const;

export const RAW_AGENT_CATALOG: RawCatalogAgent[] = [
  // 01 Field Operations
  { id: "linda", name: "Linda", role: "Dispatch Check-In Agent", category: "Field Operations", description: "Calls every tech at 85–90% of estimated job duration. Confirms status verbally and cross-checks GPS against the job site. Matches and updates the work order; discrepancies flag the dispatcher." },
  { id: "rae", name: "Rae", role: "Field Accountability Agent", category: "Field Operations", description: "Monitors every technician from first morning check-in to end-of-day drive home. Enforces seven rules in real time covering early check-ins, early departures, GPS time discrepancies, and 8-hour workday compliance." },
  { id: "pete", name: "Pete", role: "GPS Idling Monitor", category: "Field Operations", description: "Continuously watches all fleet vehicles for idling in restricted zones. Alerts the driver at the two-minute mark. Every flagged incident helps avoid costly fines. NYC metro and configurable by city." },
  { id: "molly", name: "Molly", role: "ETA Notifier", category: "Field Operations", description: "Triggered on near-completion. Reads the next work order, texts the next customer with the tech's name and ETA. Customer replies with a problem — logs it and alerts the dispatcher." },
  { id: "vera", name: "Vera", role: "Inbound Call Handler", category: "Field Operations", description: "Answers every inbound dispatch call around the clock. Handles job status queries, captures new service requests, creates draft work orders in the CMMS, and escalates emergencies to a human immediately." },
  { id: "ace", name: "Ace", role: "Emergency Dispatch Agent", category: "Field Operations", description: "Triages urgent work orders against all active techs in real time. Identifies the nearest qualified, available technician by GPS and certification match. Dispatches automatically and updates all affected work orders." },
  { id: "cal", name: "Cal", role: "Check-In/Check-Out Monitor", category: "Field Operations", description: "Cross-references GPS position with logged check-in and check-out location for every job. Flags when a tech checks out beyond the defined threshold distance from the job site. Logs to driver record." },
  { id: "beau", name: "Beau", role: "Job Photo Audit Agent", category: "Field Operations", description: "Receives before and after job photos from technicians. Time-stamps every image, matches it to the correct work order, and uploads it to the client record automatically. No manual filing." },
  { id: "clark", name: "Clark", role: "Pre-Job Communicator", category: "Field Operations", description: "Sends appointment reminders to customers 24 hours and 2 hours before every scheduled job. Includes tech name, trade, and arrival window. Reduces no-access calls and reschedules by over 30%." },
  { id: "nora", name: "Nora", role: "After-Hours Dispatch Agent", category: "Field Operations", description: "Handles all inbound calls, texts, and service requests overnight and on weekends. Triages by urgency, dispatches emergency-qualified techs for critical jobs, and queues non-urgent requests for morning." },
  // 02 Fleet & Violations
  { id: "rico", name: "Rico", role: "Violations Monitor", category: "Fleet & Violations", description: "Tracks every parking ticket, speed camera fine, and traffic violation per driver and vehicle. Logs each incident to the driver record, flags repeat offenders to the fleet manager, and maintains a running cost summary." },
  { id: "ford", name: "Ford", role: "Fleet Health Monitor", category: "Fleet & Violations", description: "Tracks vehicle maintenance schedules, oil change intervals, tire rotations, inspection expirations, and registration renewals per truck. Alerts the fleet manager before a deadline is missed." },
  { id: "gus", name: "Gus", role: "Route Optimizer", category: "Fleet & Violations", description: "Assigns every job to the nearest qualified truck using geo-clustering by trade, division, and time window. Eliminates manual dispatch routing. Increases average jobs-per-truck-per-day." },
  // 03 Payroll & Timekeeping
  { id: "quinn", name: "Quinn", role: "Timesheet Reconciliation", category: "Payroll & Timekeeping", description: "Matches GPS check-in data to logged field hours for every technician before payroll runs. Flags discrepancies between clocked hours and GPS-verified time. No manual reconciliation." },
  { id: "neil", name: "Neil", role: "Labor Cost Monitor", category: "Payroll & Timekeeping", description: "Tracks overtime hours, idle time, and total field hours per technician across every pay period. Delivers a weekly labor cost report to operations. Flags labor cost anomalies before they compound." },
  { id: "drew", name: "Drew", role: "End-of-Day Verification", category: "Payroll & Timekeeping", description: "Confirms that every technician has checked out at close of business. Alerts the supervisor immediately for any open, unresolved jobs. Runs nightly and logs the daily check-out summary." },
  { id: "omar", name: "Omar", role: "Overtime Approval Agent", category: "Payroll & Timekeeping", description: "Reviews every overtime request against GPS data before it hits payroll. Verifies the technician was on-site during claimed hours. Approves or denies in real time with a logged audit trail." },
  // 04 Expense & Spend
  { id: "brook", name: "Brook", role: "Corporate Spend Monitor", category: "Expense & Spend", description: "Monitors all company card, Amex, and fuel card transactions in real time. Flags anomalous charges, ghost spend, and out-of-policy purchases. Matches every charge to a job or vendor before the statement closes." },
  { id: "glen", name: "Glen", role: "Purchase Order Agent", category: "Expense & Spend", description: "Tracks all parts orders, stock purchases, and vendor POs from creation to delivery. Auto-approves within defined thresholds, escalates above them. Every dollar accounted for before it leaves the account." },
  // 05 Contracts, Renewals & NTE
  { id: "renata", name: "Renata", role: "Renewal Agent", category: "Contracts, Renewals & NTE", description: "Monitors every client and vendor contract for expiration. Initiates renewal conversations via voice or SMS at the optimal moment. No rep required until the conversation is warm." },
  { id: "june", name: "June", role: "COI & Insurance Monitor", category: "Contracts, Renewals & NTE", description: "Nightly scan of all vendor certificate of insurance expiry dates. Flags renewals at 60 and 30 days. Expired with no renewal suspends the vendor from the dispatch queue until verified." },
  { id: "nico", name: "Nico", role: "Regulatory Compliance Agent", category: "Contracts, Renewals & NTE", description: "Tracks all required filings — EPA, OSHA, FDNY, and local safety compliance forms. Submits documentation before due dates using connected systems. Monitors regulatory changes by jurisdiction." },
  { id: "wade", name: "Wade", role: "NTE Approval Agent", category: "Contracts, Renewals & NTE", description: "Manages not-to-exceed workflows in real time. When a job's projected cost approaches or exceeds the client threshold, flags it, routes to the right approver, and holds the work order until authorization." },
  // 06 Field Compliance & Inspections
  { id: "finn", name: "Finn", role: "Field Whisperer", category: "Field Compliance & Inspections", description: "Activates on an NFC equipment tag tap. Pulls the asset record, last inspection data, open deficiencies, and applicable compliance standard. Walks the inspector through a live verbal checklist and logs every answer." },
  { id: "max", name: "Max", role: "Proposal Generator", category: "Field Compliance & Inspections", description: "Triggered by any deficiency flag. Reads asset type, deficiency, and compliance standard. Pulls from the internal price list and sends a formatted, priced, compliance-cited proposal before the inspector leaves the site." },
  { id: "dale", name: "Dale", role: "Asset Lifecycle Tracker", category: "Field Compliance & Inspections", description: "Nightly scan across all tagged assets. Flags anything within 90, 60, or 30 days of a compliance deadline or inspection expiry. Sends proactive reports to the account manager and escalates missed deadlines." },
  { id: "maya", name: "Maya", role: "PM Scheduler", category: "Field Compliance & Inspections", description: "On completion of every maintenance visit, calculates the next required service date from manufacturer intervals. Creates the scheduled work order in the CMMS automatically and alerts the account manager 30 days in advance." },
  { id: "lena", name: "Lena", role: "Document Collection Agent", category: "Field Compliance & Inspections", description: "Tracks all post-job paperwork per client: lien waivers, work completion sign-offs, safety inspection certificates, and photo evidence. Chases the technician or subcontractor until every document is filed." },
  // 07 Inventory, Parts & Assets
  { id: "rose", name: "Rose", role: "Asset Intelligence Agent", category: "Inventory, Parts & Assets", description: "Reads equipment nameplate photos. Enriches every CMMS asset record with serial number, manufacturer, model year, and service manuals in under two minutes. High accuracy without human intervention." },
  { id: "sam", name: "Sam", role: "Inventory & Parts Agent", category: "Inventory, Parts & Assets", description: "Tracks all stock levels, logs every part used on every job, flags low inventory counts, and triggers reorders before the stockroom runs dry. Maintains a live parts ledger matched to work orders." },
  { id: "jennie", name: "Jennie", role: "Work Order Lifecycle Agent", category: "Inventory, Parts & Assets", description: "Manages the full work order from creation to billing-ready handoff. Tracks SLAs, triggers NTE flags, ensures documentation is complete, and handles required client communication from open through close." },
  { id: "toby", name: "Toby", role: "Tools & Equipment Tracker", category: "Inventory, Parts & Assets", description: "Logs every tool and specialty piece of equipment checked out per technician per job. Flags unreturned items at end of day. Tracks tool maintenance schedules and eliminates lost-equipment disputes." },
  // 08 Vendor Management
  { id: "iris", name: "Iris", role: "Vendor Sourcing Agent", category: "Vendor Management", description: "Finds qualified contractors in any geography and trade. Runs automated outreach via email, text, and phone. Qualifies against criteria, collects COI, licence, and W-9, then pushes the profile to the CMMS." },
  { id: "skip", name: "Skip", role: "Subcontractor Scorer", category: "Vendor Management", description: "Rates every subcontractor after every job: on-time rate, completion rate, deficiency rate, and response rate. Weekly performance summary. Below threshold for three consecutive jobs flags the vendor; top performers get preferred status." },
  { id: "zara", name: "Zara", role: "Vendor Activation Agent", category: "Vendor Management", description: "Triggered when Iris marks a vendor profile complete. Sends welcome sequence, portal walkthrough, checklist training, and 30-day performance summary. Flags the account manager if the vendor hasn't logged in within seven days." },
  { id: "vic", name: "Vic", role: "Vendor Dispute Agent", category: "Vendor Management", description: "Manages invoice disputes with vendors end-to-end. Pulls the original work order, agreed rate, and completed job record. Flags discrepancies, sends dispute notice, and tracks resolution with full audit trail." },
  // 09 Finance & Billing
  { id: "gina", name: "Gina", role: "Invoice Reconciliation Agent", category: "Finance & Billing", description: "Matches every vendor invoice to a confirmed completed work order before payment. Cross-checks against agreed rate for trade and region. Flags overbilling, unconfirmed completions, and incorrect rates." },
  { id: "cole", name: "Cole", role: "AR & Collections Agent", category: "Finance & Billing", description: "Tracks all outstanding client invoices. Sends automated payment reminders at defined intervals. Escalates to live collections when invoices pass threshold. Logs every touchpoint and routes to account manager when needed." },
  // 10 Customer Service & Retention
  { id: "emma", name: "Emma", role: "Customer Service Agent", category: "Customer Service & Retention", description: "Handles all inbound inquiries via voice, SMS, and email. Resolves common requests, provides job status updates, sets arrival expectations, and routes complex issues to the right human with full context." },
  { id: "stella", name: "Stella", role: "Customer Success Agent", category: "Customer Service & Retention", description: "Proactively follows up with every client after service completion. Captures satisfaction signals, flags at-risk accounts before they churn, and surfaces upsell opportunities before any rep spots them." },
  { id: "harvey", name: "Harvey", role: "Analytics Agent", category: "Customer Service & Retention", description: "Generates live performance scorecards throughout the day — jobs completed vs. target, projected end-of-day close rate, technician exception counts, and SLA performance. Delivered to operations automatically." },
  { id: "brent", name: "Brent", role: "Upsell & Re-engagement Agent", category: "Customer Service & Retention", description: "Monitors every client's work order patterns weekly. Spots signals that indicate need for an agent they don't have yet. Delivers ROI talking points to the account manager and re-engages lapsed clients." },
  { id: "nate", name: "Nate", role: "Review Solicitation Agent", category: "Customer Service & Retention", description: "Sends review requests within 24 hours of every completed job. Routes satisfied customers to Google or preferred review platform. Captures NPS responses and flags dissatisfied clients for immediate Stella follow-up." },
  // 11 HR & Workforce
  { id: "wren", name: "Wren", role: "Recruiting Agent", category: "HR & Workforce", description: "Sources technicians and field staff from job boards, LinkedIn, and licensing databases. Screens applicants against criteria, conducts initial voice qualification interviews, and hands recruiters a shortlist of pre-qualified candidates." },
  { id: "chip", name: "Chip", role: "Workforce Planning Agent", category: "HR & Workforce", description: "Analyses historical job volume, seasonal demand, overtime cost, and technician utilisation to produce hire/hold/reduce recommendations every pay period. Flags when overtime spend exceeds the cost of a new hire." },
  // 12 Oversight & Intelligence
  { id: "monica", name: "Monica", role: "Combat Room Builder", category: "Oversight & Intelligence", description: "Foundational agent. Reads client platforms, SOPs, vendor rules, compliance criteria, and tribal knowledge to build the Combat Room — the structured operational knowledge base that powers every other deployed agent." },
  { id: "claire", name: "Claire", role: "Audit Trail Agent", category: "Oversight & Intelligence", description: "Logs every AI agent action across the deployed workforce with timestamp, confidence score, outcome, and escalation history. Generates audit-ready reports on demand. Full accountability." },
  { id: "seth", name: "Seth", role: "SLA Watchdog", category: "Oversight & Intelligence", description: "Monitors response times, completion rates, and resolution times across all deployed agents against defined SLAs. Escalates before a breach. Every SLA miss is logged with root cause and agent ID." },
  { id: "evan", name: "Evan", role: "Escalation Router", category: "Oversight & Intelligence", description: "When any agent reaches a confidence or authority threshold it cannot cross, routes the task to the correct human with a full context brief. The human always knows what the agent was doing and why it stopped." },
];
