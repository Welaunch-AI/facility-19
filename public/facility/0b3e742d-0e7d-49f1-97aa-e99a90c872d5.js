// Agents section, expandable roster with live details

const { useState: useStateA, useEffect: useEffectA } = React;
const { Reveal: RevealA, AgentMono: AgentMonoA, ArrowRight: ArrowRightA, ARIA_URL: ARIA_URL_A } = window.F19UI;
const { AgentPortrait: AgentPortraitA, AGENT_VIZ: AGENT_VIZ_A } = window.F19Viz;

function StatusPill({ status, hue }) {
  const colors = {
    'on-shift':   { bg: 'rgba(31,138,95,0.1)',  fg: 'var(--good)',  label: 'On shift' },
    'on-call':    { bg: 'rgba(31,138,95,0.1)',  fg: 'var(--good)',  label: 'On call' },
    'indexing':   { bg: 'var(--brand-wash)',    fg: 'var(--brand-ink)', label: 'Indexing' },
    'sourcing':   { bg: 'rgba(199,122,31,0.1)', fg: 'var(--warn)',  label: 'Sourcing' },
    'following-up': { bg: 'rgba(31,138,95,0.1)',fg: 'var(--good)',  label: 'Following up' },
    'watching':   { bg: 'rgba(31,138,95,0.1)',  fg: 'var(--good)',  label: 'Watching' },
  };
  const c = colors[status] || colors['on-shift'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--f-mono)', fontSize: 11,
      padding: '4px 9px', borderRadius: 999,
      background: c.bg, color: c.fg,
      letterSpacing: '0.03em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }} />
      {c.label}
    </span>
  );
}

function AgentDrawer({ agent }) {
  const Viz = AGENT_VIZ_A[agent.id];
  const m = agent.metric;
  const metricDisplay = (m.prefix || '') + (m.value >= 1000 ? m.value.toLocaleString() : m.value) + (m.suffix || '');
  return (
    <div style={{
      padding: '32px 32px 32px 0',
      display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 40,
      borderTop: '1px solid var(--line)',
    }}>
      <div style={{ paddingLeft: 32, display: 'flex', gap: 24 }}>
        <AgentPortraitA agent={agent} size={120} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            {agent.desc}
          </p>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)' }}>Shift</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 500, marginTop: 4 }}>{agent.shift}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--slate)' }}>Connected to</div>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {agent.stack.map((s, i) => (
                  <span key={i} className="mono" style={{
                    fontSize: 10, padding: '3px 7px', borderRadius: 4,
                    background: 'var(--paper-2)', border: '1px solid var(--line)',
                    color: 'var(--ink-2)',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontFamily: 'var(--f-display)', fontSize: 28, letterSpacing: '-0.025em', fontWeight: 500, lineHeight: 1,
              color: `oklch(0.35 0.14 ${agent.hue})`,
            }}>{metricDisplay}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>{m.label}</div>
          </div>
        </div>
      </div>
      <div>
        {Viz ? <Viz /> : null}
      </div>
    </div>
  );
}

function AgentRow({ agent, open, onToggle, variant }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '80px 1.4fr 1fr 1fr auto',
          alignItems: 'center',
          gap: 24,
          padding: '24px 32px 24px 0',
          textAlign: 'left',
          borderRadius: 0,
        }}
      >
        <div style={{ paddingLeft: 32 }}>
          <AgentPortraitA agent={agent} size={56} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em' }}>{agent.name}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>
            {agent.role}
          </div>
        </div>
        <div>
          <StatusPill status={agent.status} hue={agent.hue} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--slate)' }}>
          <span className="mono" style={{ color: `oklch(0.35 0.14 ${agent.hue})`, fontWeight: 500 }}>
            {(agent.metric.prefix || '')}{agent.metric.value.toLocaleString()}{(agent.metric.suffix || '')}
          </span>
          {' '}{agent.metric.label.toLowerCase()}
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '1px solid var(--line-2)',
          display: 'grid', placeItems: 'center',
          transition: 'transform .25s ease, background .2s',
          transform: open ? 'rotate(45deg)' : 'none',
          background: open ? 'var(--ink)' : 'transparent',
          color: open ? 'var(--paper)' : 'var(--ink)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </button>
      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows .35s ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          {open && <AgentDrawer agent={agent} />}
        </div>
      </div>
    </div>
  );
}

function Agents({ agents, cardVariant = 'default' }) {
  const [open, setOpen] = useStateA('linda');
  return (
    <section id="agents" style={{ padding: '120px 0' }}>
      <div className="wrap">
        <RevealA>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 40, marginBottom: 56 }}>
            <div className="section-head">
              <div className="section-eyebrow">Meet the roster</div>
              <h2 className="display-xl">Your new back office. <span style={{ color: 'var(--slate)' }}>Already clocked in.</span></h2>
              <p className="lede" style={{ marginTop: 8 }}>
                Every agent has a name, a title, and one job. Click any row to see what they are doing right now.
              </p>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <span className="live-dot" />
                <span>6 on shift · 0 offline</span>
              </div>
              <div style={{ marginTop: 4, color: 'var(--slate-2)' }}>Updated just now</div>
            </div>
          </div>
        </RevealA>
        <RevealA delay={80}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1.4fr 1fr 1fr auto',
              gap: 24,
              padding: '14px 32px 14px 32px',
              background: 'var(--paper-2)',
              borderBottom: '1px solid var(--line)',
              fontFamily: 'var(--f-mono)',
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--slate)',
            }}>
              <div></div>
              <div>Agent</div>
              <div>Status</div>
              <div>Live metric</div>
              <div style={{ width: 32 }}></div>
            </div>
            {agents.map(a => (
              <AgentRow
                key={a.id}
                agent={a}
                open={open === a.id}
                onToggle={() => setOpen(open === a.id ? null : a.id)}
                variant={cardVariant}
              />
            ))}
          </div>
        </RevealA>
        <RevealA delay={160}>
          <div style={{
            marginTop: 40,
            display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'center',
            padding: 32,
            background: 'var(--paper-2)',
            border: '1px solid var(--line)',
            borderRadius: 16,
          }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>These aren't all our agents</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 500, marginTop: 8 }}>
                Not even close. Some clients run 20 to 30, a full network purpose-built for their operation.
              </div>
              <p style={{ color: 'var(--slate)', fontSize: 15, marginTop: 10, maxWidth: 580 }}>
                Dispatch. Procurement. QA. Compliance. AR. Scheduling. Fleet. Whatever is eating your team alive, we can build an agent for it.
              </p>
            </div>
            <a className="btn btn-primary" href={ARIA_URL_A} style={{ height: 52, justifySelf: 'end' }}>
              Ask Aria what we could build <ArrowRightA />
            </a>
          </div>
        </RevealA>
      </div>
    </section>
  );
}

window.F19Agents = { Agents };
