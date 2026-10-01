// Tweaks panel, hero layout & agent card variants

const { useEffect: useEffectT, useState: useStateT } = React;

function TweaksPanel({ open, tweaks, onChange }) {
  if (!open) return null;
  const options = [
    {
      key: 'heroVariant',
      label: 'Hero layout',
      opts: [
        { v: 'roster', l: 'Roster + feed' },
        { v: 'duo', l: 'Human + AI' },
        { v: 'orbit', l: 'Orbit' },
      ],
    },
    {
      key: 'agentVariant',
      label: 'Agent monogram',
      opts: [
        { v: 'default', l: 'Hued wash' },
        { v: 'outline', l: 'Outline' },
        { v: 'dark', l: 'Mono dark' },
        { v: 'brand', l: 'Brand' },
      ],
    },
  ];
  return (
    <div style={{
      position: 'fixed',
      right: 20, bottom: 20,
      width: 300,
      background: '#fff',
      border: '1px solid var(--line-2)',
      borderRadius: 14,
      boxShadow: '0 24px 48px -16px rgba(10,10,11,0.25)',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 500, fontSize: 14 }}>Tweaks</span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Facility19</span>
      </div>
      <div style={{ padding: 18, display: 'grid', gap: 20 }}>
        {options.map(group => (
          <div key={group.key}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{group.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {group.opts.map(o => {
                const active = tweaks[group.key] === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => onChange({ ...tweaks, [group.key]: o.v })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid ' + (active ? 'var(--ink)' : 'var(--line-2)'),
                      background: active ? 'var(--ink)' : '#fff',
                      color: active ? 'var(--paper)' : 'var(--ink)',
                      fontSize: 12,
                      fontWeight: 500,
                      transition: 'all .15s',
                    }}
                  >{o.l}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Main App =====
const { AGENTS, METRICS, CAPABILITIES, STEPS, TESTIMONIALS } = window.F19;
const { Nav, Footer, AriaBubble } = window.F19UI;
const { Hero } = window.F19Hero;
const { MetricsBand, TechStack, ThreeKinds, HowItWorks, Capabilities } = window.F19Sections;
const { Agents } = window.F19Agents;
const { Testimonials, BuildInHouse, Pricing, FinalCTA } = window.F19More;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "roster",
  "agentVariant": "default"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useStateT(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useStateT(false);

  useEffectT(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const onChange = (next) => {
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  return (
    <React.Fragment>
      <Nav />
      <Hero agents={AGENTS} variant={tweaks.heroVariant} />
      <MetricsBand metrics={METRICS} />
      <TechStack />
      <ThreeKinds />
      <Agents agents={AGENTS} cardVariant={tweaks.agentVariant} />
      <HowItWorks steps={STEPS} />
      <Capabilities items={CAPABILITIES} />
      <Testimonials items={TESTIMONIALS} />
      <BuildInHouse />
      <FinalCTA />
      <Footer />
      <AriaBubble />
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} onChange={onChange} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
