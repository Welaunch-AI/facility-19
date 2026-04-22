// Mid-page sections: Metrics band, Tech Stack, Three Kinds, How it works, Capabilities

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;
const { Reveal: RevealS, Counter: CounterS, ArrowRight: ArrowRightS, ARIA_URL: ARIA_URL_S } = window.F19UI;

function MetricsBand({ metrics }) {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(1000px 400px at 50% -20%, rgba(107,123,255,0.18), transparent 60%)',
      }} />
      {/* animated data lines */}
      <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        <defs>
          <pattern id="metricsGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#metricsGrid)"/>
      </svg>
      <div className="wrap" style={{ position: 'relative' }}>
        <RevealS>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="section-eyebrow" style={{ color: 'var(--slate-2)' }}>Measured results</div>
              <h2 className="display-l" style={{ marginTop: 16, maxWidth: 720 }}>
                Not a chatbot on a landing page. <span style={{ color: 'var(--slate-2)' }}>A back office that runs itself.</span>
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="live-dot" />
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate-2)' }}>
                Aggregated across deployed operations
              </span>
            </div>
          </div>
        </RevealS>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: 'var(--ink)', padding: '40px 32px' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                <CounterS to={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} />
              </div>
              <div style={{ fontSize: 14, marginTop: 16, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>{m.label}</div>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, color: 'var(--slate-2)', letterSpacing: '0.03em' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Live map tracker — dispatcher's view
function DispatcherViz() {
  const trucks = [
    { id: 14, x: 82, y: 35, color: '#3D4DDB', tech: 'Ortiz' },
    { id: 22, x: 28, y: 62, color: '#F59E0B', tech: 'Chen', idle: true },
    { id: 7,  x: 66, y: 78, color: '#1F8A5F', tech: 'Reyes' },
    { id: 31, x: 48, y: 22, color: '#06B6D4', tech: 'Banks' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(160deg, #EEF4FB, #FAFAF8)', border: '1px solid var(--line)' }}>
      {/* header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 18px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', letterSpacing: '0.06em', fontWeight: 500 }}>Live dispatch · North region</span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)' }}>142 trucks · 38 stops</span>
      </div>
      <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D6E4F0" strokeWidth="0.6"/>
          </pattern>
          <pattern id="mapGrid2" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#B6CCE0" strokeWidth="1"/>
          </pattern>
          <radialGradient id="cityBg" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor="#F8FAFD"/>
            <stop offset="100%" stopColor="#E2ECF7"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#cityBg)"/>
        <rect width="400" height="400" fill="url(#mapGrid)"/>
        <rect width="400" height="400" fill="url(#mapGrid2)"/>

        {/* Major highways */}
        <path d="M-20 180 Q 150 140 250 170 Q 320 200 420 160" stroke="#F6D272" strokeWidth="10" fill="none" opacity="0.6"/>
        <path d="M-20 180 Q 150 140 250 170 Q 320 200 420 160" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="6 6" fill="none"/>
        <path d="M200 -20 Q 180 150 220 260 Q 240 340 210 420" stroke="#F6D272" strokeWidth="10" fill="none" opacity="0.6"/>
        <path d="M200 -20 Q 180 150 220 260 Q 240 340 210 420" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="6 6" fill="none"/>

        {/* Secondary roads */}
        <path d="M0 90 L 400 90" stroke="#CBD5E1" strokeWidth="3" opacity="0.6"/>
        <path d="M0 290 L 400 290" stroke="#CBD5E1" strokeWidth="3" opacity="0.6"/>
        <path d="M100 0 L 100 400" stroke="#CBD5E1" strokeWidth="3" opacity="0.6"/>
        <path d="M320 0 L 320 400" stroke="#CBD5E1" strokeWidth="3" opacity="0.6"/>

        {/* Building blocks */}
        <rect x="40" y="110" width="40" height="50" fill="#DBE6F3" rx="2"/>
        <rect x="120" y="100" width="60" height="55" fill="#DBE6F3" rx="2"/>
        <rect x="240" y="40" width="50" height="35" fill="#DBE6F3" rx="2"/>
        <rect x="340" y="220" width="45" height="50" fill="#DBE6F3" rx="2"/>
        <rect x="25" y="310" width="60" height="55" fill="#DBE6F3" rx="2"/>
        <rect x="250" y="320" width="55" height="50" fill="#DBE6F3" rx="2"/>

        {/* Water/park */}
        <ellipse cx="150" cy="340" rx="50" ry="28" fill="#B8D8F0" opacity="0.5"/>
        <ellipse cx="350" cy="100" rx="38" ry="25" fill="#C4E4C2" opacity="0.5"/>

        {/* Route path - Tech #14 */}
        <path id="dispatchPath" d="M328 140 Q 280 180 220 220 Q 180 260 120 290" stroke="#3D4DDB" strokeWidth="2.5" fill="none" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite"/>
        </path>

        {/* Waypoints */}
        {[[328, 140, 'done'], [220, 220, 'next'], [120, 290, 'queued']].map(([x,y,s], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill={s === 'done' ? '#1F8A5F' : s === 'next' ? '#F59E0B' : '#fff'} stroke="#3D4DDB" strokeWidth="2"/>
            {s === 'done' && <path d={`M${x-4} ${y} l3 3 l5 -5`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>}
            {s === 'next' && <circle cx={x} cy={y} r="3" fill="#fff"/>}
            <circle cx={x} cy={y} r="14" fill="none" stroke={s === 'next' ? '#F59E0B' : '#3D4DDB'} strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>
        ))}

        {/* Trucks */}
        {trucks.map((t, i) => (
          <g key={t.id} transform={`translate(${t.x * 4}, ${t.y * 4})`}>
            {/* glow */}
            <circle r="18" fill={t.color} opacity="0.15">
              {!t.idle && <animate attributeName="r" values="12;22;12" dur="2.2s" repeatCount="indefinite"/>}
              {!t.idle && <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite"/>}
            </circle>
            {/* truck body */}
            <rect x="-10" y="-6" width="20" height="12" rx="2" fill={t.color}/>
            <rect x="-12" y="-5" width="4" height="10" rx="1" fill="#FCD34D"/>
            <circle r="1.8" cx="-6" cy="6" fill="#1A1A1D"/>
            <circle r="1.8" cx="6" cy="6" fill="#1A1A1D"/>
            <text x="0" y="1" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="7" fontWeight="700" fill="#fff">{t.id}</text>
          </g>
        ))}

        {/* Moving truck along route */}
        <g>
          <circle r="18" fill="#3D4DDB" opacity="0.2">
            <animate attributeName="r" values="14;24;14" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <rect x="-10" y="-6" width="20" height="12" rx="2" fill="#3D4DDB"/>
          <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
            <mpath href="#dispatchPath"/>
          </animateMotion>
        </g>
      </svg>

      {/* Floating tech card */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, background: '#fff', borderRadius: 10, border: '1px solid var(--line-2)', padding: '10px 14px', boxShadow: '0 8px 24px -8px rgba(10,10,11,0.15)', minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulseDot 1.5s infinite' }}/>
          <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Alert</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>Tech #22 · idle 18 min</div>
        <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>Site #1908 · Renée calling</div>
      </div>

      {/* Stats chip */}
      <div style={{ position: 'absolute', top: 70, right: 16, background: 'rgba(10,10,11,0.88)', color: '#fff', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
        <div className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Avg ETA</div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>11:42</div>
        <div className="mono" style={{ fontSize: 10, color: '#86EFAC' }}>+42m saved</div>
      </div>
    </div>
  );
}

function TechStack() {
  return (
    <section style={{ padding: '120px 0' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
        <RevealS>
          <DispatcherViz />
        </RevealS>
        <RevealS delay={100}>
          <div>
            <div className="section-eyebrow">The tools problem</div>
            <h2 className="display-xl" style={{ marginTop: 20 }}>
              You've got the tech stack. <span style={{ color: 'var(--slate)' }}>Nobody's running it.</span>
            </h2>
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)' }}>
              Every FM operation is different. Different platforms. Different workflows. Different integrations built up over years. You've invested in the tools, and you're paying for them every month.
            </p>
            <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6, color: 'var(--slate)' }}>
              But your dispatchers are still toggling between screens. Your invoices are still getting rubber-stamped by hand. Your back office is still drowning in coordination work that your tech stack was supposed to eliminate.
            </p>
            <div style={{
              marginTop: 28, padding: '20px 24px',
              background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 12,
              borderLeft: '3px solid var(--brand)',
            }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)' }}>
                The tools were never the problem. The missing employee was.
              </div>
              <p style={{ marginTop: 10, fontSize: 14, color: 'var(--slate)', lineHeight: 1.55 }}>
                Facility19 connects to whatever you're already running. No rip-and-replace. No new platform to learn. We plug our agents into your existing stack and put them to work.
              </p>
            </div>
            <a className="btn btn-ghost" href={ARIA_URL_S} style={{ marginTop: 28 }}>
              Ask Aria what platforms we connect to <ArrowRightS />
            </a>
          </div>
        </RevealS>
      </div>
    </section>
  );
}

function ThreeKinds() {
  const kinds = [
    {
      tag: 'You already hire this',
      title: 'Full-time staff',
      body: "Your techs, dispatchers, and coordinators. Great people. On payroll. Benefits, PTO, sick days. They've been holding this thing together for years.",
      meta: ['W-2', 'Salary + benefits', 'Business hours'],
      icon: 'hardhat',
    },
    {
      tag: 'You already hire this',
      title: 'Contractors',
      body: 'Your subs and outside vendors. 1099s. Paid per job. You love them when they show up, and lose your mind when they ghost you.',
      meta: ['1099', 'Paid per job', 'Variable'],
      icon: 'clipboard',
    },
    {
      tag: 'This one is new',
      title: 'AI employees',
      body: "The third hire. One job. Done right. Works 24/7. Never quits. Never calls in sick. Never asks for PTO the week of your biggest job. That's Facility19.",
      meta: ['Facility19', 'Monthly retainer', '24/7'],
      icon: 'ai',
      brand: true,
    },
  ];
  return (
    <section style={{ padding: '120px 0', borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <RevealS>
          <div className="section-head">
            <div className="section-eyebrow">The three kinds of employees</div>
            <h2 className="display-xl">You already know the first two. <span style={{ color: 'var(--slate)' }}>It's time to hire the third.</span></h2>
            <p className="lede" style={{ marginTop: 8 }}>
              This is not a concept. We have working deployments where AI employees are sourcing vendors, increasing technician productivity, and managing inventory. You can still talk to these agents, just like you'd check in with any member of your team.
            </p>
          </div>
        </RevealS>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 72 }}>
          {kinds.map((k, i) => (
            <RevealS key={i} delay={i * 80}>
              <div className="card" style={{
                padding: 32, height: '100%', display: 'flex', flexDirection: 'column',
                background: k.brand ? 'var(--ink)' : '#fff',
                color: k.brand ? 'var(--paper)' : 'var(--ink)',
                borderColor: k.brand ? 'var(--ink)' : 'var(--line)',
                position: 'relative', overflow: 'hidden',
              }}>
                {k.brand && (
                  <div aria-hidden style={{
                    position: 'absolute', top: -100, right: -100, width: 260, height: 260, borderRadius: '50%',
                    background: 'radial-gradient(closest-side, rgba(107,123,255,0.3), transparent 70%)',
                  }} />
                )}
                <ThreeKindsIcon kind={k.icon} brand={k.brand} />
                <div className="mono" style={{
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: k.brand ? 'var(--brand)' : 'var(--slate)', marginTop: 20, marginBottom: 10,
                }}>
                  {k.tag}
                </div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500, marginBottom: 16 }}>
                  {k.title}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: k.brand ? 'rgba(255,255,255,0.8)' : 'var(--slate)' }}>
                  {k.body}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {k.meta.map((m, j) => (
                    <span key={j} className="mono" style={{
                      fontSize: 11, letterSpacing: '0.03em',
                      padding: '5px 10px', borderRadius: 999,
                      border: `1px solid ${k.brand ? 'rgba(255,255,255,0.18)' : 'var(--line-2)'}`,
                      color: k.brand ? 'rgba(255,255,255,0.72)' : 'var(--slate)',
                    }}>{m}</span>
                  ))}
                </div>
              </div>
            </RevealS>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThreeKindsIcon({ kind, brand }) {
  const stroke = brand ? 'var(--brand)' : 'var(--ink-2)';
  if (kind === 'hardhat') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 28 Q 8 14 20 14 Q 32 14 32 28 L 34 28 L 34 32 L 6 32 L 6 28 Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M18 14 L 18 10 L 22 10 L 22 14" stroke={stroke} strokeWidth="1.5"/>
        <path d="M12 28 L 12 22 M 20 28 L 20 20 M 28 28 L 28 22" stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  }
  if (kind === 'clipboard') {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="10" y="8" width="20" height="26" rx="2" stroke={stroke} strokeWidth="1.5"/>
        <rect x="15" y="5" width="10" height="5" rx="1" stroke={stroke} strokeWidth="1.5" fill="none"/>
        <line x1="14" y1="18" x2="26" y2="18" stroke={stroke} strokeWidth="1.5"/>
        <line x1="14" y1="22" x2="26" y2="22" stroke={stroke} strokeWidth="1.5"/>
        <line x1="14" y1="26" x2="22" y2="26" stroke={stroke} strokeWidth="1.5"/>
      </svg>
    );
  }
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="12" stroke={stroke} strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="4" fill={stroke}>
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="20" cy="20" r="8" stroke={stroke} strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6"/>
    </svg>
  );
}

// Motion graphic per step — small, looping animations that communicate the stage
function StepMotion({ n, active }) {
  const common = { width: '100%', height: '100%', viewBox: '0 0 160 120', preserveAspectRatio: 'xMidYMid meet' };
  if (n === '01') {
    // Discovery: radar sweep scanning a workflow graph
    return (
      <svg {...common}>
        <defs>
          <radialGradient id="radarG" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#3D4DDB" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#3D4DDB" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* workflow nodes */}
        {[[30,40],[70,30],[110,48],[130,80],[90,90],[50,80]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#fff" stroke="#0A0A0B" strokeWidth="1.2"/>
          </g>
        ))}
        {/* edges */}
        <g stroke="#0A0A0B" strokeWidth="1" opacity="0.25" strokeDasharray="2 3" fill="none">
          <path d="M30 40 L 70 30"/><path d="M70 30 L 110 48"/><path d="M110 48 L 130 80"/>
          <path d="M130 80 L 90 90"/><path d="M90 90 L 50 80"/><path d="M50 80 L 30 40"/>
          <path d="M70 30 L 90 90"/>
        </g>
        {/* radar */}
        <g transform="translate(80 60)">
          <circle r="52" fill="url(#radarG)"/>
          <circle r="52" fill="none" stroke="#3D4DDB" strokeWidth="1" opacity="0.4"/>
          <circle r="34" fill="none" stroke="#3D4DDB" strokeWidth="1" opacity="0.25"/>
          <circle r="18" fill="none" stroke="#3D4DDB" strokeWidth="1" opacity="0.2"/>
          <line x1="0" y1="0" x2="52" y2="0" stroke="#3D4DDB" strokeWidth="1.2">
            {active && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3.5s" repeatCount="indefinite"/>}
          </line>
          <circle r="3" fill="#3D4DDB"/>
        </g>
        {/* highlighted found nodes */}
        {active && [[70,30],[110,48],[130,80]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill="#F59E0B">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="3.5s" begin={`${i*0.8}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
    );
  }
  if (n === '02') {
    // Pilot: one agent slotting into a pipeline
    return (
      <svg {...common}>
        {/* pipeline track */}
        <rect x="10" y="56" width="140" height="8" rx="4" fill="#EEF0F4"/>
        <rect x="10" y="56" width="140" height="8" rx="4" fill="none" stroke="#D5D9E0" strokeWidth="0.8"/>
        {/* slots */}
        {[30, 60, 90, 120].map((x,i)=>(
          <rect key={i} x={x-8} y="52" width="16" height="16" rx="3" fill={i===1?'#fff':'#E8ECF3'} stroke={i===1?'#3D4DDB':'#D5D9E0'} strokeWidth={i===1?'1.6':'0.8'}/>
        ))}
        {/* moving pilot agent */}
        <g>
          <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#3D4DDB"/>
          <circle cx="0" cy="-2" r="3" fill="#fff"/>
          <rect x="-4" y="2" width="8" height="5" rx="1.5" fill="#fff"/>
          {active && (
            <animateTransform
              attributeName="transform" type="translate"
              values="30 20; 30 20; 60 60; 60 60; 60 60"
              keyTimes="0;0.25;0.5;0.85;1"
              dur="3.5s" repeatCount="indefinite"/>
          )}
          {!active && <animateTransform attributeName="transform" type="translate" from="30 20" to="30 20" dur="1s"/>}
        </g>
        {/* flow ticks */}
        <g fill="#1F8A5F" opacity="0">
          <circle cx="60" cy="60" r="3">
            {active && <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.55;0.9;1" dur="3.5s" repeatCount="indefinite"/>}
          </circle>
        </g>
        <text x="60" y="95" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill="#6B7280" letterSpacing="0.1em">PILOT</text>
      </svg>
    );
  }
  if (n === '03') {
    // Production: live chart climbing + heartbeat
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D4DDB" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3D4DDB" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* grid */}
        <g stroke="#E5E7EB" strokeWidth="0.6">
          <line x1="10" y1="30" x2="150" y2="30"/>
          <line x1="10" y1="55" x2="150" y2="55"/>
          <line x1="10" y1="80" x2="150" y2="80"/>
        </g>
        {/* area */}
        <path d="M 10 85 L 30 78 L 50 72 L 70 64 L 90 56 L 110 46 L 130 38 L 150 30 L 150 95 L 10 95 Z" fill="url(#chartFill)">
          {active && <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite"/>}
        </path>
        {/* line */}
        <path d="M 10 85 L 30 78 L 50 72 L 70 64 L 90 56 L 110 46 L 130 38 L 150 30" stroke="#3D4DDB" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* moving dot */}
        <circle r="3.5" fill="#3D4DDB" stroke="#fff" strokeWidth="1.5">
          {active && <animateMotion dur="3s" repeatCount="indefinite" path="M 10 85 L 30 78 L 50 72 L 70 64 L 90 56 L 110 46 L 130 38 L 150 30"/>}
          {!active && <animate attributeName="cx" from="150" to="150"/>}
          {!active && <animate attributeName="cy" from="30" to="30"/>}
        </circle>
        {/* heartbeat */}
        <g transform="translate(132 16)">
          <circle r="5" fill="#1F8A5F" opacity="0.15">
            {active && <animate attributeName="r" values="3;9;3" dur="1.5s" repeatCount="indefinite"/>}
          </circle>
          <circle r="2.5" fill="#1F8A5F"/>
        </g>
      </svg>
    );
  }
  // n === '04' — Expand roster: avatars popping into a constellation
  return (
    <svg {...common}>
      {/* center hub */}
      <circle cx="80" cy="60" r="14" fill="#0A0A0B"/>
      <text x="80" y="63" textAnchor="middle" fontFamily="var(--f-display)" fontSize="9" fontWeight="600" fill="#fff">YOU</text>
      {/* orbit ring */}
      <circle cx="80" cy="60" r="42" fill="none" stroke="#D5D9E0" strokeWidth="0.8" strokeDasharray="2 3"/>
      {/* agents */}
      {[
        [0, '#3D4DDB'], [60, '#F59E0B'], [120, '#14B8A6'],
        [180, '#EC4899'], [240, '#8B5CF6'], [300, '#06B6D4'],
      ].map(([deg, col], i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 80 + Math.cos(rad) * 42;
        const y = 60 + Math.sin(rad) * 42;
        return (
          <g key={i}>
            <line x1="80" y1="60" x2={x} y2={y} stroke={col} strokeWidth="0.8" opacity="0.35"/>
            <circle cx={x} cy={y} r="6" fill={col} stroke="#fff" strokeWidth="1.5">
              {active && <animate attributeName="r" values="0;6;6" keyTimes="0;0.5;1" dur="3s" begin={`${i*0.25}s`} repeatCount="indefinite"/>}
            </circle>
          </g>
        );
      })}
      <text x="80" y="108" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="7" fill="#6B7280" letterSpacing="0.15em">+ MORE AGENTS</text>
    </svg>
  );
}

function HowItWorks({ steps }) {
  const [active, setActive] = useStateS(0);
  const howCarouselRef = useRefS(null);
  // auto-advance
  useEffectS(() => {
    const t = setInterval(() => {
      setActive(prev => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(t);
  }, [steps.length]);

  useEffectS(() => {
    const root = howCarouselRef.current;
    if (!root || typeof window === "undefined") return;
    if (window.innerWidth > 720) return;
    const howEl = document.getElementById("how");
    if (!howEl) return;
    const r = howEl.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return;
    const slide = root.children[active];
    if (!slide) return;
    requestAnimationFrame(() => {
      slide.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
    });
  }, [active]);

  const progress = ((active + 0.5) / steps.length) * 100;

  return (
    <section id="how" style={{ padding: '120px 0', background: 'var(--paper-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
      {/* subtle background grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.25, pointerEvents: 'none',
        maskImage: 'radial-gradient(circle at 50% 40%, #000, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000, transparent 75%)',
      }}/>
      <div className="wrap" style={{ position: 'relative' }}>
        <RevealS>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 40 }}>
            <div className="section-head">
              <div className="section-eyebrow">How it works</div>
              <h2 className="display-xl">From first call to production agent <span style={{ color: 'var(--slate)' }}>in under five weeks.</span></h2>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="live-dot"/> Now showing: Step {String(active+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}
            </div>
          </div>
        </RevealS>

        <div style={{ marginTop: 72, position: 'relative' }}>
          {/* Progress rail */}
          <div aria-hidden style={{
            position: 'absolute', left: 40, right: 40, top: 44, height: 2, borderRadius: 2,
            background: 'var(--line)',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${progress}%`, background: 'var(--brand-ink)',
              borderRadius: 2, transition: 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}/>
            {/* traveling pulse */}
            <div style={{
              position: 'absolute', top: '50%', left: `${progress}%`,
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--brand-ink)',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 4px rgba(61,77,219,0.18)',
              transition: 'left 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}/>
          </div>

          <div ref={howCarouselRef} className="f19-how-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {steps.map((s, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <RevealS key={i} delay={i * 80}>
                  <button
                    onClick={() => setActive(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: 0, background: 'transparent',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', gap: 20,
                    }}
                  >
                    {/* Step badge */}
                    <div style={{
                      width: 88, height: 88, borderRadius: 18, position: 'relative',
                      background: isActive ? 'var(--brand-ink)' : '#fff',
                      color: isActive ? '#fff' : 'var(--brand-ink)',
                      border: isActive ? '1px solid var(--brand-ink)' : '1px solid var(--line)',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--f-display)', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em',
                      boxShadow: isActive ? '0 18px 40px -14px rgba(61,77,219,0.45), 0 0 0 6px rgba(61,77,219,0.08)' : '0 2px 0 rgba(10,10,11,0.02)',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                    }}>
                      {isDone ? (
                        <svg width="28" height="28" viewBox="0 0 28 28">
                          <path d="M7 14 l5 5 l9 -11" stroke="#1F8A5F" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span>{s.n}</span>
                      )}
                      {/* active ring */}
                      {isActive && (
                        <div style={{
                          position: 'absolute', inset: -8, borderRadius: 22,
                          border: '1.5px solid var(--brand-ink)', opacity: 0.3,
                          animation: 'stepRing 2.2s ease-out infinite',
                        }}/>
                      )}
                    </div>

                    {/* Motion graphic */}
                    <div style={{
                      width: '100%', aspectRatio: '4/3',
                      background: '#fff', borderRadius: 12, border: '1px solid var(--line)',
                      padding: 14, position: 'relative',
                      transition: 'all 0.4s ease',
                      opacity: isActive ? 1 : 0.55,
                      transform: isActive ? 'translateY(0)' : 'translateY(0)',
                    }}>
                      <StepMotion n={s.n} active={isActive} />
                    </div>

                    {/* Copy */}
                    <div>
                      <div className="mono" style={{ fontSize: 11, color: isActive ? 'var(--brand-ink)' : 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.3s' }}>{s.len}</div>
                      <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>
                        {s.t}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--slate)', marginTop: 10 }}>{s.d}</p>
                    </div>
                  </button>
                </RevealS>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes stepRing {
          0%   { transform: scale(0.96); opacity: 0.35; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

// Interactive stack diagram — left rail of platforms, center agent, right rail of outcomes
// Clicking/hovering a platform fires packets along the wire and updates the "now handling" card
const STACK_PLATFORMS = [
  {
    key: 'servicechannel',
    name: 'ServiceChannel',
    category: 'Work orders',
    hue: 210,
    glyph: 'SC',
    sample: 'WO #48291 · Store 142 · Freezer down',
    action: 'Triage · assign · dispatch',
    agent: 'Aria',
  },
  {
    key: 'corrigo',
    name: 'Corrigo',
    category: 'Work orders',
    hue: 340,
    glyph: 'CR',
    sample: 'WO #7731 · Plumbing · Urgent',
    action: 'Vendor sourced in 4 min',
    agent: 'Aria',
  },
  {
    key: 'utilizecore',
    name: 'UtilizeCore',
    category: 'Subs + invoicing',
    hue: 260,
    glyph: 'UC',
    sample: 'Invoice batch · 38 subs · $74.2k',
    action: 'Reviewed · flagged · approved',
    agent: 'Miles',
  },
  {
    key: 'intellishift',
    name: 'IntelliShift',
    category: 'GPS + telematics',
    hue: 30,
    glyph: 'IS',
    sample: 'Truck #22 · idle 18 min · Site #1908',
    action: 'ETA recalculated · dispatch pinged',
    agent: 'Ivy',
  },
  {
    key: 'housecall',
    name: 'Housecall Pro',
    category: 'Scheduling',
    hue: 290,
    glyph: 'HC',
    sample: 'Route 04 · 9 stops · Tech Ortiz',
    action: 'Resequenced · 42 min saved',
    agent: 'Ivy',
  },
  {
    key: 'facility',
    name: 'FacilITY',
    category: 'CMMS',
    hue: 160,
    glyph: 'FA',
    sample: 'PM schedule · 284 assets due',
    action: 'Generated · batched · released',
    agent: 'Miles',
  },
  {
    key: 'quickbooks',
    name: 'QuickBooks',
    category: 'Accounting',
    hue: 140,
    glyph: 'QB',
    sample: 'AR aging · 12 invoices > 45 days',
    action: 'Dunning drafted · sent for review',
    agent: 'Miles',
  },
  {
    key: 'ringcentral',
    name: 'RingCentral',
    category: 'Telephony',
    hue: 10,
    glyph: 'RC',
    sample: 'Inbound · "Store manager, Target 1908"',
    action: 'Transcribed · WO opened · routed',
    agent: 'Aria',
  },
];

function StackDiagram() {
  const [active, setActive] = useStateS(0);
  const [hovered, setHovered] = useStateS(null);
  const [paused, setPaused] = useStateS(false);

  useEffectS(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive(a => (a + 1) % STACK_PLATFORMS.length);
    }, 2800);
    return () => clearInterval(t);
  }, [paused]);

  const shown = hovered ?? active;
  const p = STACK_PLATFORMS[shown];

  return (
    <div
      className="f19-stack-diagram"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setHovered(null); }}
      style={{
        position: 'relative',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 16,
        overflow: 'hidden',
        padding: '20px 20px 24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            Live integrations
          </span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)' }}>
          {paused ? 'hover — paused' : `${shown + 1} / ${STACK_PLATFORMS.length}`}
        </span>
      </div>

      <div className="f19-stack-main" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 12,
        alignItems: 'stretch',
        minHeight: 420,
      }}>
        {/* LEFT RAIL — platforms */}
        <div className="f19-stack-rail" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 2 }}>
          {STACK_PLATFORMS.map((pl, i) => {
            const isActive = i === shown;
            return (
              <button
                type="button"
                key={pl.key}
                onMouseEnter={() => setHovered(i)}
                onClick={() => {
                  setHovered(i);
                  setActive(i);
                  if (typeof window !== "undefined" && window.innerWidth <= 720) {
                    const y = window.scrollY;
                    requestAnimationFrame(() => {
                      window.scrollTo(0, y);
                      requestAnimationFrame(() => window.scrollTo(0, y));
                    });
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  border: `1px solid ${isActive ? 'var(--brand)' : 'var(--line)'}`,
                  background: isActive ? '#fff' : 'var(--paper-2)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 8px 20px -8px rgba(61,77,219,0.28), 0 0 0 3px rgba(61,77,219,0.08)' : 'none',
                  transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: `oklch(0.94 0.04 ${pl.hue})`,
                  border: `1px solid oklch(0.82 0.08 ${pl.hue})`,
                  color: `oklch(0.42 0.16 ${pl.hue})`,
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
                  flexShrink: 0,
                }}>
                  {pl.glyph}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>
                    {pl.name}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.03em', marginTop: 2 }}>
                    {pl.category}
                  </div>
                </div>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: isActive ? 'var(--brand-ink)' : 'var(--line-2)',
                  boxShadow: isActive ? '0 0 0 3px rgba(61,77,219,0.2)' : 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}/>
              </button>
            );
          })}
        </div>

        {/* RIGHT — hub + flowing detail */}
        <div className="f19-stack-hub" style={{ position: 'relative', padding: '4px 0 0 4px' }}>
          {/* Connector SVG — draws lines from each platform button to the hub */}
          <svg
            aria-hidden
            viewBox="0 0 300 440"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
          >
            <defs>
              <linearGradient id="wireActive" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#3D4DDB" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#3D4DDB" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            {STACK_PLATFORMS.map((_, i) => {
              // y for each platform row (approx based on 10px gap + 50px row height)
              const rowH = 420 / STACK_PLATFORMS.length;
              const y = rowH * i + rowH / 2;
              const isActive = i === shown;
              // curve from (0, y) to (230, 220) — hub center
              const d = `M 0 ${y} C 100 ${y}, 120 220, 230 220`;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={isActive ? 'url(#wireActive)' : 'var(--line-2)'}
                  strokeWidth={isActive ? 1.6 : 0.8}
                  strokeDasharray={isActive ? '0' : '2 3'}
                  opacity={isActive ? 1 : 0.5}
                  style={{ transition: 'all 0.25s' }}
                />
              );
            })}
            {/* moving packet on active wire */}
            {(() => {
              const rowH = 420 / STACK_PLATFORMS.length;
              const y = rowH * shown + rowH / 2;
              const d = `M 0 ${y} C 100 ${y}, 120 220, 230 220`;
              return (
                <g key={`pkt-${shown}`}>
                  <circle r="5" fill="#3D4DDB">
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={d}/>
                  </circle>
                  <circle r="9" fill="#3D4DDB" opacity="0.25">
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={d}/>
                  </circle>
                </g>
              );
            })()}
          </svg>

          {/* Hub — the Facility19 agent receiving + response card */}
          <div className="f19-stack-hub-inner" style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'calc(100% - 60px)',
            maxWidth: 280,
            zIndex: 2,
          }}>
            {/* Agent chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: 'var(--ink)',
              borderRadius: 12,
              color: 'var(--paper)',
              boxShadow: '0 16px 40px -14px rgba(10,10,11,0.4)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: `oklch(0.72 0.15 ${p.hue})`,
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 15, color: '#fff',
                transition: 'background 0.4s',
              }}>
                {p.agent[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.agent}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--slate-2)', letterSpacing: '0.04em' }}>
                  handling {p.name}
                </div>
              </div>
              <span className="live-dot" style={{ background: '#86EFAC' }}/>
            </div>

            {/* Event card */}
            <div key={shown} style={{
              marginTop: 10,
              padding: '14px 16px',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 12,
              boxShadow: '0 8px 24px -12px rgba(10,10,11,0.18)',
              animation: 'cardIn 0.45s cubic-bezier(0.2, 0.9, 0.2, 1)',
            }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Incoming
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.45 }}>
                {p.sample}
              </div>
              <div style={{
                marginTop: 12, paddingTop: 12,
                borderTop: '1px dashed var(--line-2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7.5 l2.5 2.5 l5.5 -6" stroke="#1F8A5F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{p.action}</span>
              </div>
            </div>

            {/* tiny reassurance row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--slate)' }}>
                read · write · audit-logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* footer — quick list of other integration types */}
      <div className="f19-stack-footer" style={{
        marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)',
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {['+ Fexa', '+ ServiceTitan', '+ Jonas', '+ Sage', '+ Twilio', '+ Zapier', '+ Custom API'].map((x, i) => (
          <span key={i} className="mono" style={{
            fontSize: 10, color: 'var(--slate)', letterSpacing: '0.04em',
            padding: '4px 10px', borderRadius: 999, border: '1px dashed var(--line-2)',
          }}>{x}</span>
        ))}
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Capabilities({ items }) {
  return (
    <section className="f19-capabilities" style={{ padding: '96px 0' }}>
      <div className="wrap f19-cap-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'center' }}>
        <RevealS>
          <div>
            <div className="section-eyebrow">Wired into your stack</div>
            <h2 className="display-l" style={{ marginTop: 20 }}>
              Every platform you run. <span style={{ color: 'var(--slate)' }}>One roster.</span>
            </h2>
            <p style={{ marginTop: 20, color: 'var(--slate)', fontSize: 15, lineHeight: 1.6 }}>
              Your tech stack took a decade to build. We don't replace it. Our agents read and write to the platforms you already pay for — work orders, dispatch, GPS, accounting, telephony — and act inside them like any other teammate.
            </p>
            <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
              {[
                ['Read', 'Pull work orders, routes, invoices, call transcripts'],
                ['Decide', 'Triage, source vendors, resequence routes, flag invoices'],
                ['Write back', 'Update records, dispatch, send messages — with an audit trail'],
              ].map(([t, d], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div className="mono" style={{
                    fontSize: 10, color: 'var(--brand-ink)', letterSpacing: '0.1em',
                    padding: '4px 8px', border: '1px solid var(--brand-ink)',
                    borderRadius: 4, minWidth: 66, textAlign: 'center', textTransform: 'uppercase', fontWeight: 600,
                    flexShrink: 0, marginTop: 1,
                  }}>{t}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{d}</div>
                </div>
              ))}
            </div>
            <a className="btn btn-ghost" href={ARIA_URL_S} style={{ marginTop: 28 }}>
              Ask Aria about your stack <ArrowRightS />
            </a>
          </div>
        </RevealS>
        <RevealS delay={100}>
          <StackDiagram />
        </RevealS>
      </div>
    </section>
  );
}

window.F19Sections = { MetricsBand, TechStack, ThreeKinds, HowItWorks, Capabilities };
