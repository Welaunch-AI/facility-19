// Shared primitives: Nav, Footer, Aria bubble, helpers

const { useEffect, useState, useRef, useMemo } = React;

const ARIA_URL = '/talk-to-aria';
const BOOK_URL = 'https://cal.com/aviral-bhutani-facility19/discovery-call';

function Wordmark({ size = 22 }) {
  return (
    <span className="nav-logo-mark" style={{ fontSize: size, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <img src={(window.__resources && window.__resources.f19Mark) || "assets/facility19-mark.png"} alt="" style={{ height: size * 1.9, width: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
      <span style={{ display: 'inline-flex' }}><span>Facility</span><span className="nineteen">19</span></span>
    </span>
  );
}

function ArrowRight({ size = 14 }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '') + (open ? ' is-open' : '')}>
      <div className="wrap nav-inner">
        <a className="nav-logo" href="#top" aria-label="Facility19" onClick={close}>
          <Wordmark />
        </a>
        <div className="nav-links">
          <a href="#agents">Team</a>
          <a href="#how">How it works</a>
          <a href="#proof">Proof</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-cta">
          <a className="btn btn-ghost nav-cta-book" href={BOOK_URL} target="_blank" rel="noreferrer" style={{ height: 40 }}>Book a call</a>
          <a className="btn btn-primary" href={ARIA_URL} style={{ height: 40 }}>
            Meet Aria <ArrowRight />
          </a>
        </div>
        <button
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={'nav-burger-icon' + (open ? ' open' : '')}>
            <span /><span /><span />
          </span>
        </button>
      </div>
      <div className={'nav-mobile' + (open ? ' show' : '')} aria-hidden={!open}>
        <div className="nav-mobile-inner">
          <a href="#agents" onClick={close}>Team</a>
          <a href="#how" onClick={close}>How it works</a>
          <a href="#proof" onClick={close}>Proof</a>
          <a href="#pricing" onClick={close}>Pricing</a>
          <a href="#contact" onClick={close}>Contact</a>
          <div className="nav-mobile-ctas">
            <a className="btn btn-ghost" href={BOOK_URL} target="_blank" rel="noreferrer" onClick={close}>Book a call</a>
            <a className="btn btn-primary" href={ARIA_URL} onClick={close}>
              Meet Aria <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 120, paddingTop: 72, paddingBottom: 56, background: 'var(--paper)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Wordmark size={26} />
          <p style={{ marginTop: 18, maxWidth: 360, color: 'var(--slate)', fontSize: 15, lineHeight: 1.55 }}>
            America's first AI staffing company built for facility management. Deployed, monitored, and maintained by a 40-person operations team.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <span className="live-dot" />
            <span className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>Systems operational · 99.98% uptime</span>
          </div>
        </div>
        <FooterCol title="Product" items={[
          { l: 'Meet the team', h: '#agents' },
          { l: 'How it works', h: '#how' },
          { l: 'Pricing', h: '#pricing' },
        ]}/>
        <FooterCol title="Company" items={[
          { l: 'Proof', h: '#proof' },
          { l: 'Contact', h: '#contact' },
        ]}/>
        <FooterCol title="Get started" items={[
          { l: 'Meet Aria →', h: ARIA_URL, ext: false },
          { l: 'Book a call →', h: BOOK_URL, ext: true },
        ]}/>
      </div>
      <div className="wrap" style={{ marginTop: 72, paddingTop: 28, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--slate)' }}>
        <span>© 2026 ARB Global LLC · Facility19</span>
        <span className="mono" style={{ letterSpacing: '0.06em' }}>v3.2 · Built in America</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
        {items.map((it, i) => (
          <li key={i}>
            <a href={it.h} target={it.ext ? '_blank' : undefined} rel={it.ext ? 'noreferrer' : undefined} style={{ fontSize: 14, color: 'var(--ink-2)' }}>{it.l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If already in viewport, reveal immediately (avoids hero being stuck invisible).
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    if (rect.top < vh * 0.95) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    // Safety fallback: reveal after 1.2s no matter what.
    const t = setTimeout(() => el.classList.add('in'), 1200);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, as: As = 'div', ...rest }) {
  const ref = useReveal();
  return (
    <As ref={ref} className={'reveal ' + (rest.className || '')} style={{ transitionDelay: `${delay}ms`, ...(rest.style || {}) }}>
      {children}
    </As>
  );
}

function Counter({ to = 0, prefix = '', suffix = '', duration = 1400, decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(to * eased);
            if (t < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const display = val >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(decimals);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// Monogram, still used in some spots (pricing etc.)
function AgentMono({ agent, size = 56, live = true, variant = 'default' }) {
  const common = {
    width: size, height: size,
    borderRadius: variant === 'square' ? 12 : '50%',
    display: 'grid', placeItems: 'center',
    fontFamily: 'var(--f-display)', fontWeight: 600,
    fontSize: size * 0.34,
    letterSpacing: '-0.02em',
    position: 'relative',
    flexShrink: 0,
  };
  const styles = {
    default: {
      background: `oklch(0.96 0.02 ${agent.hue})`,
      color: `oklch(0.35 0.14 ${agent.hue})`,
      border: `1px solid oklch(0.92 0.04 ${agent.hue})`,
    },
    dark: { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' },
    outline: { background: '#fff', color: `oklch(0.35 0.14 ${agent.hue})`, border: `1.5px solid oklch(0.82 0.1 ${agent.hue})` },
    brand: { background: 'var(--brand-wash)', color: 'var(--brand-ink)', border: '1px solid #DFE3FF' },
  };
  const s = styles[variant] || styles.default;
  return (
    <div style={{ ...common, ...s }}>
      <span>{agent.mono}</span>
      {live && (
        <span style={{
          position: 'absolute', right: -2, bottom: -2,
          width: 12, height: 12, borderRadius: '50%',
          background: 'var(--good)', border: '2px solid var(--paper)',
        }} />
      )}
    </div>
  );
}

// Persistent floating Aria chat bubble
function AriaBubble() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 60 }}>
      {open && (
        <div className="card" style={{
          position: 'absolute', right: 0, bottom: 76,
          width: 320, padding: 20,
          background: '#fff', borderRadius: 16,
          boxShadow: '0 24px 48px -16px rgba(10,10,11,0.25)',
          animation: 'ariaUp .25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(145deg, var(--brand-wash), #fff)',
              border: '1px solid #DFE3FF',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--f-display)', fontWeight: 600, color: 'var(--brand-ink)',
            }}>AR</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Hi, I'm Aria.</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>The front door at Facility19</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            Tell me what's breaking. I'll match you with the right agent, walk you through how it connects to your stack, and show you what operators in your situation have done.
          </p>
          <a className="btn btn-primary" href={ARIA_URL} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            Start the conversation <ArrowRight />
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Talk to Aria"
        style={{
          height: 56, padding: '0 22px 0 18px',
          borderRadius: 999,
          background: 'var(--ink)', color: 'var(--paper)',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 12px 32px -8px rgba(10,10,11,0.35)',
          fontWeight: 500, fontSize: 14,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(145deg, oklch(0.75 0.1 260), oklch(0.6 0.14 270))',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--f-display)', fontSize: 13, fontWeight: 600, color: '#fff',
          boxShadow: '0 0 0 3px rgba(107,123,255,0.35)',
        }}>AR</span>
        <span>{open ? 'Close' : 'Ask Aria'}</span>
      </button>
      <style>{`@keyframes ariaUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

window.F19UI = { Nav, Footer, Wordmark, ArrowRight, Reveal, Counter, AgentMono, useReveal, AriaBubble, ARIA_URL, BOOK_URL };
