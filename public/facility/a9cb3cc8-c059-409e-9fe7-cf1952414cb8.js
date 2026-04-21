// Hero — animated agent roster with facility backdrop + human/agent duo

const { useEffect: useEffectH, useState: useStateH } = React;
const { Reveal: RevealH, ArrowRight: ArrowRightH, ARIA_URL: ARIA_URL_H, BOOK_URL: BOOK_URL_H } = window.F19UI;
const { AgentPortrait: AgentPortraitH, FacilityBackdrop: FacilityBackdropH } = window.F19Viz;

const TICKER_EVENTS = [
  { agent: 'LD', color: 230, msg: 'Rerouted Tech #14 · emergency HVAC · Site 2104' },
  { agent: 'EM', color: 290, msg: 'Intake call answered · ticket #48213 created' },
  { agent: 'MT', color: 25,  msg: 'PO #10348 issued · 14% under budget' },
  { agent: 'MO', color: 170, msg: 'Indexed Carrier 50TCQA12 · manual attached' },
  { agent: 'RN', color: 190, msg: 'Called Tech #22 · truck idle 18 min' },
  { agent: 'MG', color: 340, msg: 'Follow-up sent · Invoice #4421 · 9 days overdue' },
  { agent: 'LD', color: 230, msg: 'Morning routes dispatched · 38 stops · 6 techs' },
  { agent: 'EM', color: 290, msg: 'After-hours call · routed to on-call Tech #7' },
  { agent: 'MT', color: 25,  msg: '3 vendors quoted · best price locked · compressor' },
  { agent: 'MO', color: 170, msg: 'Asset profile built · chiller #88-A · Site 2093' },
];

function LiveTicker() {
  const [items, setItems] = useStateH(() => TICKER_EVENTS.slice(0, 4));
  useEffectH(() => {
    let i = 4;
    const id = setInterval(() => {
      setItems(prev => [TICKER_EVENTS[i % TICKER_EVENTS.length], ...prev.slice(0, 3)]);
      i += 1;
    }, 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden', borderRadius: 16,
      boxShadow: '0 1px 0 rgba(10,10,11,0.02), 0 24px 48px -24px rgba(10,10,11,0.14)',
      background: '#fff',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid var(--line)', background: 'var(--paper)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)' }}>
            Live operations feed
          </span>
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--slate-2)' }}>facility19 · today</span>
      </div>
      <div style={{ padding: '8px 0' }}>
        {items.map((it, i) => (
          <div key={`${it.agent}-${i}-${it.msg}`} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', fontSize: 13,
            opacity: 1 - i * 0.16, transition: 'opacity .5s',
          }}>
            <span style={{
              fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
              padding: '3px 6px', borderRadius: 4,
              background: `oklch(0.96 0.02 ${it.color})`, color: `oklch(0.35 0.14 ${it.color})`,
            }}>{it.agent}</span>
            <span style={{ color: 'var(--ink-2)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {it.msg}
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--slate-2)' }}>just now</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Duo: stylized human silhouette + AI portrait, side by side
function HumanAgentDuo({ agents }) {
  // Use Aria-like portrait (Emma) paired with a silhouette person
  const aria = agents[1] || agents[0]; // Emma
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 28, padding: '20px 0' }}>
      {/* Human silhouette figure */}
      <div style={{ position: 'relative', width: 180, height: 240 }}>
        <svg viewBox="0 0 180 240" width="180" height="240">
          <defs>
            <linearGradient id="humanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.88 0.02 240)"/>
              <stop offset="100%" stopColor="oklch(0.75 0.04 240)"/>
            </linearGradient>
          </defs>
          {/* head */}
          <ellipse cx="90" cy="55" rx="32" ry="36" fill="oklch(0.78 0.05 50)"/>
          {/* hair */}
          <path d="M58 52 Q 62 22 90 20 Q 118 22 122 52 Q 112 40 90 40 Q 68 40 58 52 Z" fill="oklch(0.30 0.03 30)"/>
          {/* body / polo */}
          <path d="M40 100 Q 50 90 90 92 Q 130 90 140 100 L 150 240 L 30 240 Z" fill="url(#humanGrad)"/>
          {/* collar */}
          <path d="M76 94 L 90 110 L 104 94 Z" fill="#fff"/>
          {/* name badge */}
          <rect x="108" y="130" width="18" height="24" rx="2" fill="#fff" stroke="var(--line-2)"/>
          <rect x="110" y="135" width="14" height="2" fill="var(--slate-2)"/>
          <rect x="110" y="140" width="10" height="1.5" fill="var(--slate-2)"/>
          {/* eyes */}
          <ellipse cx="80" cy="58" rx="2" ry="2" fill="#1a1a1d"/>
          <ellipse cx="100" cy="58" rx="2" ry="2" fill="#1a1a1d"/>
          {/* mouth */}
          <path d="M82 74 Q 90 78 98 74" stroke="oklch(0.45 0.08 20)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 10px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 999,
          fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)',
        }}>Your ops manager</div>
      </div>

      {/* Plus sign */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)',
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--ink)', color: 'var(--paper)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 500,
        boxShadow: '0 8px 24px -8px rgba(10,10,11,0.3)',
      }}>+</div>

      {/* AI portrait */}
      <div style={{ position: 'relative', width: 180, height: 240 }}>
        <svg viewBox="0 0 180 240" width="180" height="240" style={{ position: 'absolute', inset: 0 }}>
          {/* Scaled-up portrait-style */}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'end center' }}>
          <AgentPortraitH agent={aria} size={180} />
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 10px', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 999,
          fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--good)', animation: 'pulseDot 1.8s infinite' }}/>
          Your AI hire
        </div>
      </div>
    </div>
  );
}

function Hero({ agents, variant = 'roster' }) {
  return (
    <section id="top" style={{ paddingTop: 72, paddingBottom: 120, position: 'relative', overflow: 'hidden' }}>
      {/* Facility blueprint backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
        <FacilityBackdropH />
      </div>
      {/* brand glow */}
      <div aria-hidden style={{
        position: 'absolute', top: -200, right: -200,
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(107,123,255,0.16), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="wrap" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <RevealH>
            <div className="section-eyebrow" style={{ marginBottom: 32, justifyContent: 'center', display: 'inline-flex' }}>
              AI staffing for facility management
            </div>
          </RevealH>
          <RevealH delay={80}>
            <h1 className="display-xxl" style={{ marginTop: 8 }}>
              The FM industry just got a new kind of worker.<br/>
              <span style={{ color: 'var(--brand-ink)' }}>Meet your AI team.</span>
            </h1>
          </RevealH>
          <RevealH delay={160}>
            <p className="lede" style={{ marginTop: 32, fontSize: 20, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
              You have your staff. You have your contractors. Now meet the third kind of employee, one that works every shift, never burns out, and costs a fraction of a full-time hire.
            </p>
          </RevealH>
          <RevealH delay={240}>
            <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn btn-primary" href={ARIA_URL_H} style={{ height: 52, fontSize: 16 }}>
                Meet Aria, she'll walk you through everything <ArrowRightH />
              </a>
              <a className="btn btn-ghost" href="#agents" style={{ height: 52, fontSize: 16 }}>
                See the full team
              </a>
            </div>
          </RevealH>
        </div>
        <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'stretch' }}>
          <RevealH delay={300}>
            <div className="card" style={{ padding: 28, height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>On shift right now</div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Your AI team</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="live-dot" />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--slate)' }}>6 on · 0 offline</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {agents.map((a, i) => (
                  <div key={a.id} style={{
                    padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 12,
                    animation: `rosterIn .6s ease ${i * 0.08}s backwards`,
                  }}>
                    <AgentPortraitH agent={a} size={80} rounded="rounded" />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>{a.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.03em', textTransform: 'uppercase', marginTop: 2 }}>{a.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`@keyframes rosterIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
            </div>
          </RevealH>
          <RevealH delay={360}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <LiveTicker />
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                padding: '20px 18px', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 16,
              }}>
                <HeroStat k="24/7" v="Monitored by our 40-person ops team" />
                <HeroStat k="< 5 wks" v="From kickoff to production agent" />
                <HeroStat k="20 to 30" v="Agents in a full-roster deployment" />
              </div>
            </div>
          </RevealH>
        </div>
      </div>
    </section>
  );
}

function HeroOrbit({ agents }) {
  const radius = 190;
  const cx = 220, cy = 220;
  const positions = agents.map((_, i) => {
    const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  return (
    <div style={{ position: 'relative', width: 440, height: 440, margin: '0 auto' }}>
      <svg width="440" height="440" style={{ position: 'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--line-2)" strokeDasharray="2 5" />
        <circle cx={cx} cy={cy} r={radius - 60} fill="none" stroke="var(--line)" strokeDasharray="2 5" />
        {positions.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--line)" strokeDasharray="2 4" opacity="0.6" />
        ))}
      </svg>
      <div style={{
        position: 'absolute', left: cx - 70, top: cy - 70, width: 140, height: 140, borderRadius: '50%',
        background: 'linear-gradient(180deg, var(--brand-wash), #fff)',
        border: '1px solid #DFE3FF', display: 'grid', placeItems: 'center', textAlign: 'center',
        boxShadow: '0 20px 40px -20px rgba(107,123,255,0.35)',
      }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--brand-ink)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your ops</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 2 }}>6 agents</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--slate)' }}>on shift</div>
        </div>
      </div>
      {agents.map((a, i) => (
        <div key={a.id} style={{
          position: 'absolute', left: positions[i].x - 36, top: positions[i].y - 36,
          animation: `orbitFloat 4s ease-in-out ${i * 0.3}s infinite alternate`,
        }}>
          <AgentPortraitH agent={a} size={72} />
          <div style={{ position: 'absolute', top: 76, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>{a.name}</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{a.role.split(' ').slice(0, 2).join(' ')}</div>
          </div>
        </div>
      ))}
      <style>{`@keyframes orbitFloat { to { transform: translateY(-4px); } }`}</style>
    </div>
  );
}

function HeroStat({ k, v }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{k}</div>
      <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.4, marginTop: 6 }}>{v}</div>
    </div>
  );
}

window.F19Hero = { Hero };
