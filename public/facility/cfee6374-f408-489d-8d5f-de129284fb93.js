// Cases, Testimonials, Pricing, Build-in-house, CTA

const { Reveal: RevealP, ArrowRight: ArrowRightP, ARIA_URL: ARIA_URL_P, BOOK_URL: BOOK_URL_P } = window.F19UI;

function Cases({ cases }) {
  return (
    <section id="cases" style={{ padding: '120px 0', background: 'var(--paper-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <RevealP>
          <div className="section-head">
            <div className="section-eyebrow">Case studies</div>
            <h2 className="display-xl">Real operations. <span style={{ color: 'var(--slate)' }}>Real numbers.</span></h2>
          </div>
        </RevealP>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 72 }}>
          {cases.map((c, i) => (
            <RevealP key={i} delay={i * 80}>
              <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: `oklch(0.96 0.02 ${220 + i * 50})`,
                    border: `1px solid oklch(0.92 0.04 ${220 + i * 50})`,
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 12,
                    color: `oklch(0.35 0.14 ${220 + i * 50})`,
                  }}>{c.co.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{c.co}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 20 }}>
                  {c.scale}
                </div>
                <blockquote style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 20, lineHeight: 1.35,
                  letterSpacing: '-0.015em',
                  color: 'var(--ink)',
                  flex: 1,
                }}>
                  “{c.quote}”
                </blockquote>
                <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                , {c.cite}
                </div>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px dashed var(--line-2)', display: 'grid', gap: 12 }}>
                  {c.stats.map((s, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--slate)' }}>{s.k}</span>
                      <span style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 500, color: 'var(--brand-ink)', letterSpacing: '-0.01em' }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealP>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }) {
  return (
    <section id="testimonials" style={{ padding: '120px 0' }}>
      <div className="wrap">
        <RevealP>
          <div className="section-head" style={{ marginBottom: 64 }}>
            <div className="section-eyebrow">In their words</div>
            <h2 className="display-xl">Operators who have been in FM <span style={{ color: 'var(--slate)' }}>for decades.</span></h2>
          </div>
        </RevealP>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {items.map((t, i) => (
            <RevealP key={i} delay={i * 80}>
              <div style={{ padding: '8px 0' }}>
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none" style={{ opacity: 0.25 }}>
                  <path d="M0 22V13C0 6 3 1.3 9.1 0l1.5 3C6 4.6 3.5 7.5 3.3 11h3.8V22H0zm16.9 0V13c0-7 3-11.7 9.1-13l1.5 3c-4.6 1.6-7 4.5-7.3 8h3.8V22h-7.1z" fill="var(--ink)"/>
                </svg>
                <blockquote style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 22, lineHeight: 1.35,
                  letterSpacing: '-0.015em',
                  marginTop: 12,
                  maxWidth: 380,
                }}>
                  {t.q}
                </blockquote>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.who}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: '0.04em', marginTop: 2 }}>{t.where}</div>
                </div>
              </div>
            </RevealP>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildInHouse() {
  return (
    <section style={{ padding: '40px 0 120px' }}>
      <div className="wrap">
        <div className="card" style={{
          padding: '56px 64px',
          display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56,
          background: '#fff',
          alignItems: 'center',
        }}>
          <div>
            <div className="section-eyebrow">Can't we just build this in-house?</div>
            <h2 className="display-l" style={{ marginTop: 18 }}>
              You could. <span style={{ color: 'var(--slate)' }}>Or you could talk to Aria this afternoon.</span>
            </h2>
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6, marginTop: 20, maxWidth: 540 }}>
              To build this yourself you need an AI engineer, a systems integrator, a QA team, and someone to manage it 24/7, then do it all again when your stack changes. We already have the team.
            </p>
            <a className="btn btn-primary" href={ARIA_URL_P} style={{ marginTop: 28 }}>
              Tell Aria what's breaking <ArrowRightP />
            </a>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { k: 'AI engineer', v: 'Included' },
              { k: 'Systems integrator', v: 'Included' },
              { k: '24/7 monitoring (40-person team)', v: 'Included' },
              { k: 'Ongoing QA & prompt tuning', v: 'Included' },
              { k: 'Stack drift absorption', v: 'Included' },
              { k: 'Time to your first working agent', v: '< 5 weeks' },
            ].map((it, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px',
                background: 'var(--paper-2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--ink-2)' }}>{it.k}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--good)', letterSpacing: '0.04em' }}>
                  ✓ {it.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '$5K',
      per: '/ month',
      for: '5 agents minimum. Prove the model works on your operation.',
      feats: [
        '5 production agents',
        'Wired into your existing stack',
        'Weekly performance review',
        'Monitored by our 40-person ops team',
      ],
      cta: 'Start with 5 agents',
      href: ARIA_URL_P,
      variant: 'ghost',
    },
    {
      name: 'Operation',
      price: '$20K',
      per: '/ month',
      for: '20 agents. A full roster running your back office.',
      feats: [
        '20 production agents',
        'Unlimited platform integrations',
        'Dedicated ops lead',
        'Quarterly roadmap review',
        'Custom agents on request',
      ],
      cta: 'Scope your roster with Aria',
      href: ARIA_URL_P,
      variant: 'primary',
      highlight: true,
    },
    {
      name: 'Network',
      price: 'Custom',
      per: '',
      for: '30+ agents. Full back-office replacement.',
      feats: [
        'Agent network, purpose-built',
        'Deep stack integrations',
        'Embedded ops team',
        'SOC 2 · enterprise agreements',
        'Executive sponsor',
      ],
      cta: 'Talk to the team',
      href: BOOK_URL_P,
      variant: 'ghost',
    },
  ];
  return (
    <section id="pricing" style={{ padding: '120px 0', background: 'var(--paper-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <RevealP>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 20, marginBottom: 56 }}>
            <div className="section-head">
              <div className="section-eyebrow">Pricing</div>
              <h2 className="display-xl">Priced like a hire. <span style={{ color: 'var(--slate)' }}>Not like software.</span></h2>
              <p className="lede" style={{ marginTop: 8 }}>
                Most operations land between Operation and Network. Aria will scope yours in a two-minute conversation.
              </p>
            </div>
          </div>
        </RevealP>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {tiers.map((t, i) => (
            <RevealP key={t.name} delay={i * 80}>
              <div className="card" style={{
                padding: 32,
                height: '100%',
                display: 'flex', flexDirection: 'column',
                background: t.highlight ? 'var(--ink)' : '#fff',
                color: t.highlight ? 'var(--paper)' : 'var(--ink)',
                borderColor: t.highlight ? 'var(--ink)' : 'var(--line)',
                position: 'relative',
              }}>
                {t.highlight && (
                  <span className="mono" style={{
                    position: 'absolute', top: 24, right: 24,
                    fontSize: 10, padding: '4px 8px', borderRadius: 4,
                    background: 'var(--brand)', color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>Most chosen</span>
                )}
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: t.highlight ? 'rgba(255,255,255,0.7)' : 'var(--slate)', marginTop: 6, minHeight: 20 }}>
                  {t.for}
                </div>
                <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: 38, letterSpacing: '-0.03em', fontWeight: 500 }}>{t.price}</span>
                  <span className="mono" style={{ fontSize: 12, color: t.highlight ? 'rgba(255,255,255,0.6)' : 'var(--slate)' }}>{t.per}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0', display: 'grid', gap: 12 }}>
                  {t.feats.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                      <span style={{ color: t.highlight ? 'var(--brand)' : 'var(--brand-ink)', flexShrink: 0, marginTop: 2 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span style={{ color: t.highlight ? 'rgba(255,255,255,0.88)' : 'var(--ink-2)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className={'btn ' + (t.variant === 'primary' ? 'btn-brand' : 'btn-ghost')}
                  href={t.href}
                  target={t.href.startsWith('/') ? undefined : '_blank'}
                  rel="noreferrer"
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    justifyContent: 'center',
                    ...(t.variant === 'ghost' && t.highlight ? { background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' } : {}),
                  }}
                >
                  {t.cta} <ArrowRightP />
                </a>
              </div>
            </RevealP>
          ))}
        </div>
        <RevealP>
          <p className="mono" style={{ textAlign: 'center', fontSize: 12, color: 'var(--slate)', marginTop: 40, letterSpacing: '0.04em' }}>
            All plans include setup, integration, monitoring, and weekly iteration by the Facility19 ops team.
          </p>
        </RevealP>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" style={{ padding: '120px 0 60px' }}>
      <div className="wrap">
        <RevealP>
          <div style={{
            position: 'relative',
            padding: '80px 72px',
            borderRadius: 24,
            background: 'linear-gradient(160deg, var(--ink) 0%, #15151F 100%)',
            color: 'var(--paper)',
            overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(107,123,255,0.4), transparent 70%)',
            }} />
            <div style={{ position: 'relative', maxWidth: 760 }}>
              <div className="section-eyebrow" style={{ color: 'var(--brand)' }}>
                Two minutes with Aria
              </div>
              <h2 className="display-xl" style={{ marginTop: 20, lineHeight: 1.05 }}>
                Your team is good. <span style={{ color: 'var(--slate-2)' }}>Aria makes them unstoppable.</span>
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.55, marginTop: 24, color: 'rgba(255,255,255,0.76)', maxWidth: 620 }}>
                Tell Aria what is breaking in your operation. She matches you with the right agent, explains how it wires into your stack, and walks you through what it costs, right now.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
                <a className="btn btn-brand" href={ARIA_URL_P} style={{ height: 52, fontSize: 16 }}>
                  Talk to Aria, free, no sign-up <ArrowRightP />
                </a>
                <a className="btn btn-ghost" href={BOOK_URL_P} target="_blank" rel="noreferrer" style={{ height: 52, fontSize: 16, background: 'rgba(255,255,255,0.06)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Book a 30-min call
                </a>
              </div>
              <div style={{ marginTop: 48, display: 'flex', gap: 32, flexWrap: 'wrap', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                <span>· No pitch deck</span>
                <span>· No CRM form</span>
                <span>· No three-week waiting game</span>
              </div>
            </div>
          </div>
        </RevealP>
      </div>
    </section>
  );
}

window.F19More = { Cases, Testimonials, BuildInHouse, Pricing, FinalCTA };
