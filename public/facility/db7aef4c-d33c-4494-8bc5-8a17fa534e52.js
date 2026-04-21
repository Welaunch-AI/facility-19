// Animated stylized avatars + facility data-viz components
// Detailed, humanized illustrated portraits with animated data overlays

const { useEffect: useEffectV, useState: useStateV, useRef: useRefV } = React;

// Per-agent visual identity, each unique to their role/personality
const AGENT_LOOKS = {
  linda: {
    skin: '#F2D2B3', skinShade: '#E0B08A',
    hair: '#3A2416', hairHi: '#5C3821',
    hairStyle: 'long-wavy',
    eyes: '#4A3828',
    cloth: '#1E2A4A', clothAccent: '#3D4DDB',
    glasses: false,
    overlayType: 'route', // per-agent animated overlay
    accessory: null,
  },
  emma: {
    skin: '#F7DAB8', skinShade: '#E9BD92',
    hair: '#6B4028', hairHi: '#8F5A3A',
    hairStyle: 'shoulder-bob',
    eyes: '#3E2817',
    cloth: '#2D1B4E', clothAccent: '#8B5CF6',
    glasses: true,
    overlayType: 'wave',
    accessory: 'headset',
  },
  molly: {
    skin: '#D9A578', skinShade: '#B88657',
    hair: '#1F1410', hairHi: '#3A2218',
    hairStyle: 'ponytail',
    eyes: '#2A1810',
    cloth: '#0F3A36', clothAccent: '#14B8A6',
    glasses: true,
    overlayType: 'asset',
    accessory: null,
  },
  matt: {
    skin: '#E8C19A', skinShade: '#CB9F74',
    hair: '#2A1D14', hairHi: '#4A3424',
    hairStyle: 'short-crop',
    eyes: '#3C2818',
    cloth: '#3A2818', clothAccent: '#F59E0B',
    glasses: false,
    overlayType: 'price',
    accessory: 'beard',
  },
  morgan: {
    skin: '#F0C8A8', skinShade: '#DCA882',
    hair: '#C5864A', hairHi: '#E0A066',
    hairStyle: 'bob-bangs',
    eyes: '#4A2C1A',
    cloth: '#3F1D3C', clothAccent: '#EC4899',
    glasses: true,
    overlayType: 'invoice',
    accessory: null,
  },
  renee: {
    skin: '#D4956A', skinShade: '#B07448',
    hair: '#141414', hairHi: '#2A2A2A',
    hairStyle: 'curly-short',
    eyes: '#1F1410',
    cloth: '#0F2F3A', clothAccent: '#06B6D4',
    glasses: false,
    overlayType: 'fleet',
    accessory: null,
  },
};

function Defs({ uid, look }) {
  return (
    <defs>
      <radialGradient id={`skin-${uid}`} cx="0.4" cy="0.35" r="0.8">
        <stop offset="0%" stopColor={look.skin}/>
        <stop offset="60%" stopColor={look.skin}/>
        <stop offset="100%" stopColor={look.skinShade}/>
      </radialGradient>
      <linearGradient id={`cloth-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={look.cloth} stopOpacity="0.85"/>
        <stop offset="100%" stopColor={look.cloth}/>
      </linearGradient>
      <linearGradient id={`hair-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor={look.hairHi}/>
        <stop offset="100%" stopColor={look.hair}/>
      </linearGradient>
      <radialGradient id={`bg-${uid}`} cx="0.5" cy="0.5" r="0.7">
        <stop offset="0%" stopColor="#fff"/>
        <stop offset="100%" stopColor={`oklch(0.96 0.03 ${getHue(uid)})`}/>
      </radialGradient>
      <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.4"/>
      </filter>
      <clipPath id={`clip-${uid}`}>
        <rect x="0" y="0" width="200" height="240" rx="100"/>
      </clipPath>
    </defs>
  );
}
function getHue(id) {
  return { linda: 230, emma: 290, molly: 170, matt: 25, morgan: 340, renee: 190 }[id] || 230;
}

// Hair shapes — front and back for each style
function HairBack({ style, uid }) {
  const fill = `url(#hair-${uid})`;
  if (style === 'long-wavy') {
    return <path d="M38 100 Q 30 60 55 42 Q 100 20 145 42 Q 170 60 162 110 L 170 180 L 30 180 Z" fill={fill}/>;
  }
  if (style === 'shoulder-bob') {
    return <path d="M40 100 Q 38 60 58 44 Q 100 28 142 44 Q 162 60 160 100 L 160 150 L 40 150 Z" fill={fill}/>;
  }
  if (style === 'ponytail') {
    return (
      <g>
        <path d="M58 100 Q 55 58 72 44 Q 100 32 128 44 Q 145 58 142 100 Z" fill={fill}/>
        <ellipse cx="158" cy="92" rx="12" ry="26" fill={fill} transform="rotate(22 158 92)"/>
      </g>
    );
  }
  if (style === 'bob-bangs') {
    return <path d="M44 98 Q 40 60 60 44 Q 100 30 140 44 Q 160 60 156 98 L 156 130 L 44 130 Z" fill={fill}/>;
  }
  return null;
}

function HairFront({ style, uid }) {
  const fill = `url(#hair-${uid})`;
  if (style === 'long-wavy') {
    return <path d="M48 80 Q 52 40 100 36 Q 148 40 152 80 Q 140 62 120 58 Q 100 66 80 58 Q 60 62 48 80 Z" fill={fill}/>;
  }
  if (style === 'shoulder-bob') {
    return <path d="M48 84 Q 54 44 100 38 Q 146 44 152 84 Q 138 68 100 64 Q 62 68 48 84 Z" fill={fill}/>;
  }
  if (style === 'ponytail') {
    return <path d="M52 78 Q 60 42 100 38 Q 140 42 148 78 Q 130 60 100 60 Q 70 60 52 78 Z" fill={fill}/>;
  }
  if (style === 'short-crop') {
    return <path d="M54 84 Q 60 48 100 44 Q 140 48 146 84 Q 132 68 110 68 Q 90 70 70 68 Q 60 72 54 84 Z" fill={fill}/>;
  }
  if (style === 'bob-bangs') {
    // blunt bangs
    return (
      <g>
        <path d="M52 82 Q 58 44 100 40 Q 142 44 148 82 Q 136 72 122 72 L 108 78 L 92 78 L 78 72 Q 64 72 52 82 Z" fill={fill}/>
        <rect x="62" y="68" width="76" height="14" rx="6" fill={fill}/>
      </g>
    );
  }
  if (style === 'curly-short') {
    return (
      <g>
        <ellipse cx="70" cy="58" r="12" rx="12" ry="10" fill={fill}/>
        <ellipse cx="90" cy="50" rx="14" ry="11" fill={fill}/>
        <ellipse cx="110" cy="50" rx="14" ry="11" fill={fill}/>
        <ellipse cx="130" cy="58" rx="12" ry="10" fill={fill}/>
        <ellipse cx="100" cy="44" rx="14" ry="10" fill={fill}/>
        <ellipse cx="60" cy="72" rx="10" ry="9" fill={fill}/>
        <ellipse cx="140" cy="72" rx="10" ry="9" fill={fill}/>
      </g>
    );
  }
  return null;
}

// Per-agent subtle animated overlay — small glowing circuit/data lines behind
function AgentOverlay({ type, size = 1 }) {
  const s = size;
  if (type === 'route') {
    return (
      <g opacity="0.55" style={{ pointerEvents: 'none' }}>
        <path d={`M${170*s} ${60*s} Q ${185*s} ${80*s} ${170*s} ${100*s} T ${180*s} ${140*s} T ${160*s} ${180*s}`} stroke="#3D4DDB" strokeWidth="1.2" fill="none" strokeDasharray="3 3" opacity="0.6">
          <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite"/>
        </path>
        <circle cx={170*s} cy={60*s} r="3" fill="#3D4DDB"/>
        <circle cx={175*s} cy={110*s} r="3" fill="#3D4DDB"/>
        <circle cx={165*s} cy={170*s} r="3" fill="#3D4DDB">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
    );
  }
  if (type === 'wave') {
    return (
      <g opacity="0.65">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <rect key={i} x={160 + i * 5} y={100} width="3" height="20" rx="1.5" fill="#8B5CF6">
            <animate attributeName="height" values={`${10 + i*2};${30 - i*3};${15 + i*2}`} dur={`${0.8 + i*0.1}s`} repeatCount="indefinite"/>
            <animate attributeName="y" values={`${110 - i};${100 + i};${105}`} dur={`${0.8 + i*0.1}s`} repeatCount="indefinite"/>
          </rect>
        ))}
      </g>
    );
  }
  if (type === 'asset') {
    return (
      <g opacity="0.6">
        <rect x="160" y="90" width="30" height="40" rx="3" fill="none" stroke="#14B8A6" strokeWidth="1"/>
        <line x1="163" y1="98" x2="185" y2="98" stroke="#14B8A6" strokeWidth="1"/>
        <line x1="163" y1="104" x2="180" y2="104" stroke="#14B8A6" strokeWidth="1"/>
        <line x1="163" y1="110" x2="175" y2="110" stroke="#14B8A6" strokeWidth="1"/>
        <circle cx="175" cy="130" r="2" fill="#14B8A6"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
      </g>
    );
  }
  if (type === 'price') {
    return (
      <g opacity="0.65">
        <text x="162" y="100" fontFamily="var(--f-mono)" fontSize="10" fill="#F59E0B" fontWeight="600">$</text>
        <rect x="170" y="94" width="20" height="4" fill="#F59E0B" opacity="0.5"/>
        <rect x="170" y="102" width="16" height="4" fill="#F59E0B" opacity="0.7"/>
        <rect x="170" y="110" width="12" height="4" fill="#F59E0B">
          <animate attributeName="width" values="12;20;14" dur="2s" repeatCount="indefinite"/>
        </rect>
        <path d="M162 120 L 175 114 L 190 106" stroke="#F59E0B" strokeWidth="1.5" fill="none"/>
        <circle cx="190" cy="106" r="2" fill="#F59E0B"/>
      </g>
    );
  }
  if (type === 'invoice') {
    return (
      <g opacity="0.6">
        <rect x="162" y="90" width="26" height="32" rx="2" fill="none" stroke="#EC4899" strokeWidth="1"/>
        <line x1="166" y1="98" x2="184" y2="98" stroke="#EC4899" strokeWidth="0.8"/>
        <line x1="166" y1="104" x2="180" y2="104" stroke="#EC4899" strokeWidth="0.8"/>
        <line x1="166" y1="110" x2="184" y2="110" stroke="#EC4899" strokeWidth="0.8"/>
        <circle cx="192" cy="88" r="4" fill="#1F8A5F"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/></circle>
      </g>
    );
  }
  if (type === 'fleet') {
    return (
      <g opacity="0.65">
        {[0,1,2].map(i => (
          <g key={i} transform={`translate(${160 + (i%2)*14}, ${90 + i*12})`}>
            <rect width="10" height="6" rx="1" fill="#06B6D4"/>
            <circle cx="2" cy="7" r="1.5" fill="#06B6D4"/>
            <circle cx="8" cy="7" r="1.5" fill="#06B6D4"/>
          </g>
        ))}
        <circle cx="190" cy="130" r="3" fill="#06B6D4">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    );
  }
  return null;
}

// Detailed humanized portrait — viewBox 200x240, portrait-style composition
function AgentPortrait({ agent, size = 160, animated = true, showOverlay = true, rounded = 'circle' }) {
  const look = AGENT_LOOKS[agent.id] || AGENT_LOOKS.linda;
  const uid = agent.id;
  const hue = getHue(uid);

  // If a real photo is available, render it inside the same frame.
  if (agent.photo) {
    return (
      <div style={{
        position: 'relative',
        width: size,
        height: rounded === 'circle' ? size : size * 1.18,
        borderRadius: rounded === 'circle' ? '50%' : 18,
        overflow: 'hidden',
        background: `radial-gradient(circle at 50% 30%, #fff, oklch(0.96 0.03 ${hue}))`,
        border: `1px solid oklch(0.92 0.05 ${hue})`,
        flexShrink: 0,
        boxShadow: rounded === 'circle' ? 'none' : `0 12px 32px -12px oklch(0.6 0.12 ${hue} / 0.25)`,
      }}>
        <img
          src={agent.photo}
          alt={agent.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 22%',
            display: 'block',
          }}
        />
        {/* Live status dot */}
        <div style={{
          position: 'absolute', top: size * 0.06, right: size * 0.06,
          width: Math.max(8, size * 0.07), height: Math.max(8, size * 0.07),
          borderRadius: '50%', background: '#1F8A5F',
          border: `2px solid #fff`,
          boxShadow: '0 0 0 1px rgba(31,138,95,0.25)',
          animation: animated ? 'pulseDot 1.8s ease-in-out infinite' : undefined,
        }}/>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: rounded === 'circle' ? size : size * 1.18,
      borderRadius: rounded === 'circle' ? '50%' : 18,
      overflow: 'hidden',
      background: `radial-gradient(circle at 50% 30%, #fff, oklch(0.96 0.03 ${hue}))`,
      border: `1px solid oklch(0.92 0.05 ${hue})`,
      flexShrink: 0,
      boxShadow: rounded === 'circle' ? 'none' : `0 12px 32px -12px oklch(0.6 0.12 ${hue} / 0.25)`,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <Defs uid={uid} look={look}/>

        {/* Backdrop grid */}
        <rect width="200" height="240" fill={`url(#bg-${uid})`}/>

        {/* Subtle grid */}
        <g opacity="0.12">
          {Array.from({length: 10}).map((_,i) => (
            <line key={`v-${i}`} x1={i*20} y1="0" x2={i*20} y2="240" stroke={`oklch(0.6 0.12 ${hue})`} strokeWidth="0.5"/>
          ))}
          {Array.from({length: 12}).map((_,i) => (
            <line key={`h-${i}`} x1="0" y1={i*20} x2="200" y2={i*20} stroke={`oklch(0.6 0.12 ${hue})`} strokeWidth="0.5"/>
          ))}
        </g>

        {/* Animated data overlay (right side) */}
        {showOverlay && animated && <AgentOverlay type={look.overlayType}/>}

        {/* Character group with breathing */}
        <g>
          {animated && (
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-1; 0,0" dur="4s" repeatCount="indefinite"/>
          )}

          {/* Shoulders / jacket */}
          <path d="M20 240 Q 20 180 55 165 Q 100 175 145 165 Q 180 180 180 240 Z" fill={`url(#cloth-${uid})`}/>
          {/* Jacket collar / zipper detail */}
          <path d="M80 170 L 100 200 L 120 170" fill="none" stroke={look.clothAccent} strokeWidth="2" opacity="0.7"/>
          <line x1="100" y1="175" x2="100" y2="240" stroke={look.clothAccent} strokeWidth="1" opacity="0.6"/>
          {/* Chest trim */}
          <path d="M32 210 L 50 200 L 55 240" fill="none" stroke={look.clothAccent} strokeWidth="1.5" opacity="0.5"/>
          <path d="M168 210 L 150 200 L 145 240" fill="none" stroke={look.clothAccent} strokeWidth="1.5" opacity="0.5"/>

          {/* Back hair */}
          <HairBack style={look.hairStyle} uid={uid}/>

          {/* Neck */}
          <path d="M82 140 L 82 175 Q 100 185 118 175 L 118 140 Z" fill={`url(#skin-${uid})`}/>
          {/* Neck shadow */}
          <path d="M82 140 L 82 165 Q 100 172 118 165 L 118 140 Z" fill={look.skinShade} opacity="0.4"/>

          {/* Head */}
          <ellipse cx="100" cy="104" rx="42" ry="48" fill={`url(#skin-${uid})`}/>
          {/* Cheek shadow */}
          <ellipse cx="68" cy="118" rx="12" ry="18" fill={look.skinShade} opacity="0.3" filter={`url(#soft-${uid})`}/>
          <ellipse cx="132" cy="118" rx="12" ry="18" fill={look.skinShade} opacity="0.3" filter={`url(#soft-${uid})`}/>
          {/* Cheek blush */}
          <ellipse cx="72" cy="122" rx="8" ry="5" fill="#E8A890" opacity="0.35"/>
          <ellipse cx="128" cy="122" rx="8" ry="5" fill="#E8A890" opacity="0.35"/>

          {/* Ears */}
          <ellipse cx="58" cy="108" rx="5" ry="9" fill={`url(#skin-${uid})`}/>
          <ellipse cx="142" cy="108" rx="5" ry="9" fill={`url(#skin-${uid})`}/>

          {/* Eyebrows */}
          <path d="M72 92 Q 80 88 88 92" stroke={look.hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M112 92 Q 120 88 128 92" stroke={look.hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* Eyes */}
          <g>
            {/* Eye whites */}
            <ellipse cx="80" cy="104" rx="6" ry="4.5" fill="#fff"/>
            <ellipse cx="120" cy="104" rx="6" ry="4.5" fill="#fff"/>
            {/* Iris */}
            <circle cx="80" cy="104" r="3.5" fill={look.eyes}>
              {animated && <animate attributeName="ry" values="3.5;3.5;3.5;0.3;3.5;3.5" keyTimes="0;0.55;0.6;0.62;0.64;1" dur="5s" repeatCount="indefinite"/>}
            </circle>
            <circle cx="120" cy="104" r="3.5" fill={look.eyes}>
              {animated && <animate attributeName="ry" values="3.5;3.5;3.5;0.3;3.5;3.5" keyTimes="0;0.55;0.6;0.62;0.64;1" dur="5s" repeatCount="indefinite"/>}
            </circle>
            {/* Pupil */}
            <circle cx="80" cy="104" r="1.5" fill="#0A0A0B"/>
            <circle cx="120" cy="104" r="1.5" fill="#0A0A0B"/>
            {/* Eye shine */}
            <circle cx="81.5" cy="102.5" r="1.2" fill="#fff"/>
            <circle cx="121.5" cy="102.5" r="1.2" fill="#fff"/>
          </g>

          {/* Nose */}
          <path d="M100 108 Q 96 120 99 126 Q 102 128 104 126" stroke={look.skinShade} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8"/>
          <ellipse cx="100" cy="127" rx="3" ry="1.5" fill={look.skinShade} opacity="0.3"/>

          {/* Mouth */}
          <path d="M90 138 Q 100 144 110 138" stroke="#B8695A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M92 139 Q 100 142 108 139" fill="#D98876" opacity="0.6"/>

          {/* Glasses */}
          {look.glasses && (
            <g>
              <circle cx="80" cy="104" r="12" fill="none" stroke="#1A1A1D" strokeWidth="2"/>
              <circle cx="120" cy="104" r="12" fill="none" stroke="#1A1A1D" strokeWidth="2"/>
              <line x1="92" y1="103" x2="108" y2="103" stroke="#1A1A1D" strokeWidth="2"/>
              {/* Lens reflection */}
              <ellipse cx="76" cy="100" rx="3" ry="4" fill="#fff" opacity="0.4"/>
              <ellipse cx="116" cy="100" rx="3" ry="4" fill="#fff" opacity="0.4"/>
            </g>
          )}

          {/* Front hair (over forehead) */}
          <HairFront style={look.hairStyle} uid={uid}/>

          {/* Headset — Emma */}
          {look.accessory === 'headset' && (
            <g>
              <path d="M56 88 Q 56 52 100 50 Q 144 52 144 88" stroke="#1A1A1D" strokeWidth="2.5" fill="none"/>
              <ellipse cx="56" cy="98" rx="6" ry="8" fill="#1A1A1D"/>
              <ellipse cx="144" cy="98" rx="6" ry="8" fill="#1A1A1D"/>
              <path d="M61 102 Q 64 130 78 140" stroke="#1A1A1D" strokeWidth="1.8" fill="none"/>
              <ellipse cx="80" cy="142" rx="3.5" ry="2.5" fill="#1A1A1D"/>
              {/* mic LED */}
              <circle cx="80" cy="142" r="1" fill="#EF4444">
                {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite"/>}
              </circle>
            </g>
          )}

          {/* Beard — Matt */}
          {look.accessory === 'beard' && (
            <path d="M70 130 Q 74 150 100 156 Q 126 150 130 130 Q 126 146 100 148 Q 74 146 70 130 Z" fill={look.hair} opacity="0.9"/>
          )}
        </g>

        {/* Live status */}
        <g transform="translate(168, 20)">
          <circle r="6" fill="#fff"/>
          <circle r="4" fill="#1F8A5F">
            {animated && <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite"/>}
          </circle>
        </g>
      </svg>
    </div>
  );
}

// ============ Facility data-viz panels (per agent) ============

// Live map with animated truck dots — big improvement
function RouteViz() {
  return (
    <div style={{ background: '#F8FAFD', borderRadius: 12, border: '1px solid var(--line)', padding: 16, height: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live dispatch · 6 techs</span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--good)' }}>↑ 38 stops</span>
      </div>
      <svg viewBox="0 0 340 160" width="100%" style={{ flex: 1, borderRadius: 8, background: '#fff', border: '1px solid var(--line-2)' }}>
        <defs>
          <pattern id="streetgrid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#E2E8F0" strokeWidth="0.5"/>
          </pattern>
          <pattern id="streetgrid2" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="340" height="160" fill="url(#streetgrid)"/>
        <rect width="340" height="160" fill="url(#streetgrid2)"/>
        {/* Highway */}
        <path d="M-10 80 Q 80 60 160 70 Q 240 80 350 60" stroke="#94A3B8" strokeWidth="6" fill="none" opacity="0.4"/>
        <path d="M-10 80 Q 80 60 160 70 Q 240 80 350 60" stroke="#FDE68A" strokeWidth="1.2" fill="none" strokeDasharray="5 5"/>
        {/* Secondary roads */}
        <path d="M60 0 L 60 160" stroke="#CBD5E1" strokeWidth="3" opacity="0.5"/>
        <path d="M220 0 L 220 160" stroke="#CBD5E1" strokeWidth="3" opacity="0.5"/>
        <path d="M0 130 L 340 130" stroke="#CBD5E1" strokeWidth="3" opacity="0.5"/>
        {/* Route path */}
        <path id="tpath" d="M30 140 Q 80 100 130 120 T 220 70 T 310 40" stroke="#3D4DDB" strokeWidth="2.5" fill="none" strokeDasharray="5 4">
          <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.5s" repeatCount="indefinite"/>
        </path>
        {/* Waypoints with labels */}
        {[
          [30, 140, '#2087', 'done'],
          [130, 120, '#2090', 'done'],
          [220, 70, '#2094', 'next'],
          [310, 40, '#2102', 'queued'],
        ].map(([x,y,id,s],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="8" fill={s === 'done' ? '#1F8A5F' : s === 'next' ? '#F59E0B' : '#fff'} stroke="#3D4DDB" strokeWidth="2"/>
            {s === 'done' && <path d={`M${x-3} ${y} l2 2 l4 -4`} stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
            {s === 'next' && <circle cx={x} cy={y} r="2.5" fill="#fff"/>}
            <rect x={x+10} y={y-8} width="32" height="12" rx="3" fill="#fff" stroke="var(--line-2)"/>
            <text x={x+14} y={y+1} fontFamily="var(--f-mono)" fontSize="7" fill="var(--ink-2)">{id}</text>
          </g>
        ))}
        {/* Moving truck */}
        <g>
          <rect x="-8" y="-4" width="16" height="8" rx="1.5" fill="#3D4DDB"/>
          <rect x="-10" y="-3" width="3" height="6" rx="1" fill="#FCD34D"/>
          <circle r="1.5" cx="-5" cy="4.5" fill="#1A1A1D"/>
          <circle r="1.5" cx="5" cy="4.5" fill="#1A1A1D"/>
          <circle r="14" fill="#3D4DDB" opacity="0.15">
            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
            <mpath href="#tpath"/>
          </animateMotion>
        </g>
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11, fontFamily: 'var(--f-mono)' }}>
        <div style={{ padding: '6px 10px', background: '#fff', borderRadius: 6, border: '1px solid var(--line)' }}>
          <div style={{ color: 'var(--slate)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ETA</div>
          <div style={{ color: 'var(--ink-2)', fontWeight: 500 }}>11:42 AM</div>
        </div>
        <div style={{ padding: '6px 10px', background: '#fff', borderRadius: 6, border: '1px solid var(--line)' }}>
          <div style={{ color: 'var(--slate)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saved</div>
          <div style={{ color: 'var(--good)', fontWeight: 500 }}>+42 min</div>
        </div>
        <div style={{ padding: '6px 10px', background: '#fff', borderRadius: 6, border: '1px solid var(--line)' }}>
          <div style={{ color: 'var(--slate)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech #</div>
          <div style={{ color: 'var(--ink-2)', fontWeight: 500 }}>14</div>
        </div>
      </div>
    </div>
  );
}

// Improved call waveform with transcript preview
function WaveViz() {
  const bars = 56;
  return (
    <div style={{ background: 'linear-gradient(180deg, #FDF4FF, #FFFFFF)', borderRadius: 12, border: '1px solid var(--line)', padding: 18, height: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#8B5CF6', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontFamily: 'var(--f-mono)' }}>EM</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Incoming call</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Site #4102 · 00:01:42</div>
          </div>
        </div>
        <span className="live-dot" />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px' }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            background: `linear-gradient(to top, #8B5CF6, #C084FC)`,
            borderRadius: 1.5,
            height: `${20 + Math.sin(i * 0.5) * 25 + Math.cos(i * 0.3) * 15 + 20}%`,
            animation: `waveFlex ${0.8 + (i % 7) * 0.15}s ease-in-out ${i * 0.03}s infinite alternate`,
          }} />
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--line-2)', borderRadius: 8, padding: 10 }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Live transcript</div>
        <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--ink-2)' }}>
          <span style={{ color: 'var(--slate)' }}>Caller: </span>"The HVAC won't cool below 78, started this morning around..."
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <span className="mono" style={{ fontSize: 10, padding: '3px 8px', background: '#EEF0FF', color: '#3D4DDB', borderRadius: 4 }}>Ticket #48213 created</span>
        <span className="mono" style={{ fontSize: 10, padding: '3px 8px', background: '#F0FDF4', color: '#1F8A5F', borderRadius: 4 }}>Tech #7 notified</span>
      </div>
      <style>{`@keyframes waveFlex { from { height: 8%; } to { height: 90%; } }`}</style>
    </div>
  );
}

// Improved asset card with equipment rendering
function AssetViz() {
  return (
    <div style={{ background: 'linear-gradient(180deg, #F0FDFA, #FFFFFF)', borderRadius: 12, border: '1px solid var(--line)', padding: 18, height: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Indexing asset</span>
        <span className="live-dot" />
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        {/* Equipment illustration */}
        <svg width="70" height="70" viewBox="0 0 70 70" style={{ flexShrink: 0, background: '#fff', borderRadius: 8, border: '1px solid var(--line-2)', padding: 4 }}>
          <rect x="8" y="14" width="54" height="44" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1"/>
          <rect x="12" y="18" width="46" height="8" fill="#64748B"/>
          <circle cx="22" cy="40" r="7" fill="#fff" stroke="#64748B" strokeWidth="1"/>
          <circle cx="22" cy="40" r="7" stroke="#14B8A6" strokeWidth="1" fill="none" strokeDasharray="3 3">
            <animateTransform attributeName="transform" type="rotate" from="0 22 40" to="360 22 40" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="48" cy="40" r="7" fill="#fff" stroke="#64748B" strokeWidth="1"/>
          <rect x="42" y="50" width="12" height="4" fill="#14B8A6"/>
          <rect x="10" y="10" width="50" height="4" fill="#0F3A36"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>Carrier 50TCQA12</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>RTU · 12.5 tons · 2019</div>
          <div className="mono" style={{ fontSize: 10, color: '#14B8A6', marginTop: 4 }}>● Site 2093 · Roof unit 3</div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 6, fontSize: 11, fontFamily: 'var(--f-mono)', flex: 1 }}>
        {[
          { l: 'Service manual', v: 'attached', s: 'done' },
          { l: 'Parts list (48 SKUs)', v: 'indexed', s: 'done' },
          { l: 'Wiring diagram v3.2', v: 'attached', s: 'done' },
          { l: 'Service history', v: 'merging', s: 'working' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 5, opacity: 0, animation: `fadeRow .4s ease ${i * 0.15}s forwards` }}>
            <span style={{ color: 'var(--ink-2)' }}>{r.l}</span>
            <span style={{ color: r.s === 'done' ? 'var(--good)' : 'var(--warn)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {r.s === 'done' ? '✓' : '◐'} {r.v}
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeRow { to { opacity: 1; } }`}</style>
    </div>
  );
}

// Improved procurement with vendor logos
function ProcureViz() {
  const quotes = [
    { v: 'Grainger', price: 1420, pct: 100, sku: 'GR-4421' },
    { v: 'HD Supply', price: 1285, pct: 90, sku: 'HD-2019' },
    { v: 'Johnstone', price: 1188, pct: 83, sku: 'JN-8834', win: true },
  ];
  return (
    <div style={{ background: 'linear-gradient(180deg, #FFFBEB, #FFFFFF)', borderRadius: 12, border: '1px solid var(--line)', padding: 18, height: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sourcing · 3-ton compressor</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--good)', fontWeight: 600 }}>−14% vs budget</span>
      </div>
      <div style={{ display: 'grid', gap: 8, flex: 1 }}>
        {quotes.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: q.win ? '#F0FDF4' : '#fff', border: `1px solid ${q.win ? '#86EFAC' : 'var(--line-2)'}`, borderRadius: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 4, background: q.win ? '#1F8A5F' : 'var(--paper-2)', color: q.win ? '#fff' : 'var(--slate)', display: 'grid', placeItems: 'center', fontSize: 10, fontFamily: 'var(--f-mono)', fontWeight: 600 }}>
              {q.v.slice(0,2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: q.win ? 'var(--good)' : 'var(--ink-2)' }}>{q.v} {q.win && '✓'}</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--slate)' }}>{q.sku}</div>
            </div>
            <div style={{ width: 80, height: 6, background: 'var(--paper-2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${q.pct}%`, height: '100%',
                background: q.win ? '#1F8A5F' : '#F59E0B',
                animation: `barGrow 1s ease ${i * 0.2}s backwards`,
                transformOrigin: 'left',
              }}/>
            </div>
            <span className="mono" style={{ fontSize: 12, fontWeight: q.win ? 600 : 400, color: q.win ? 'var(--good)' : 'var(--ink-2)', width: 52, textAlign: 'right' }}>${q.price}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--ink)', color: '#fff', borderRadius: 6 }}>
        <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>PO #10348 issued</span>
        <span className="mono" style={{ fontSize: 11, color: '#86EFAC', fontWeight: 600 }}>Saved $232</span>
      </div>
      <style>{`@keyframes barGrow { from { transform: scaleX(0); } }`}</style>
    </div>
  );
}

// Improved AR aging with invoice list
function ARViz() {
  const invoices = [
    { id: '#4421', amt: 8420, days: 9, status: 'warning' },
    { id: '#4398', amt: 12400, days: 0, status: 'paid' },
    { id: '#4402', amt: 3180, days: 3, status: 'pending' },
  ];
  return (
    <div style={{ background: 'linear-gradient(180deg, #FDF2F8, #FFFFFF)', borderRadius: 12, border: '1px solid var(--line)', padding: 18, height: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AR aging</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--good)' }}>DSO: 28d (−12d YoY)</span>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>$1.24M <span style={{ fontSize: 12, color: 'var(--slate)', fontFamily: 'var(--f-mono)' }}>outstanding</span></div>
      </div>
      <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: '#fff', border: '1px solid var(--line-2)' }}>
        {[{v:84, c:'#1F8A5F'}, {v:11, c:'#F59E0B'}, {v:4, c:'#EC4899'}, {v:1, c:'#C0392B'}].map((a, i) => (
          <div key={i} style={{ width: `${a.v}%`, background: a.c, animation: `barGrow 1s ease ${i * 0.15}s backwards`, transformOrigin: 'left' }}/>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: 9, fontFamily: 'var(--f-mono)', color: 'var(--slate)' }}>
        <span>0–30d · 84%</span>
        <span>31–60d · 11%</span>
        <span>61–90d · 4%</span>
        <span>90+ · 1%</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gap: 5 }}>
        {invoices.map((inv, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: inv.status === 'paid' ? '#1F8A5F' : inv.status === 'warning' ? '#F59E0B' : '#94A3B8' }}/>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>INV {inv.id}</span>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>${inv.amt.toLocaleString()}</span>
            <span className="mono" style={{ fontSize: 10, color: inv.status === 'warning' ? '#F59E0B' : 'var(--slate)' }}>
              {inv.status === 'paid' ? 'paid' : `${inv.days}d overdue`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Improved fleet grid with truck visual
function FleetViz() {
  const rows = 6, cols = 14;
  return (
    <div style={{ background: 'linear-gradient(180deg, #ECFEFF, #FFFFFF)', borderRadius: 12, border: '1px solid var(--line)', padding: 18, height: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fleet monitor · 142 live</span>
        <span className="mono" style={{ fontSize: 10, color: '#F59E0B' }}>1 idle &gt; 15m</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3 }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const roll = (i * 37) % 100;
          const state = roll > 95 ? 'idle' : roll > 88 ? 'pending' : 'active';
          const color = state === 'active' ? '#06B6D4' : state === 'pending' ? '#F59E0B' : '#EF4444';
          return (
            <div key={i} style={{
              borderRadius: 2,
              background: color,
              opacity: 0.85,
              position: 'relative',
              animation: state === 'active' ? `truckPulse ${2 + (i % 5) * 0.4}s ease-in-out ${(i % 7) * 0.15}s infinite alternate` : 'none',
            }}/>
          );
        })}
      </div>
      <div style={{ background: '#fff', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulseDot 1.5s infinite' }}/>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-2)', fontWeight: 600 }}>Tech #22 · Truck idle 18 min</span>
          </div>
          <span className="mono" style={{ fontSize: 9, color: 'var(--slate)' }}>calling...</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--slate)' }}>Site #1908 · job closed 20 min ago</div>
      </div>
      <style>{`@keyframes truckPulse { from { opacity: 0.4; } to { opacity: 0.95; } }`}</style>
    </div>
  );
}

const AGENT_VIZ = {
  linda: RouteViz,
  emma: WaveViz,
  molly: AssetViz,
  matt: ProcureViz,
  morgan: ARViz,
  renee: FleetViz,
};

// Facility silhouette backdrop
function FacilityBackdrop() {
  return (
    <svg viewBox="0 0 1440 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
      <defs>
        <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.88 0.04 240)" strokeWidth="0.5"/>
        </pattern>
        <linearGradient id="bp-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--paper)" stopOpacity="0"/>
          <stop offset="100%" stopColor="var(--paper)" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width="1440" height="400" fill="url(#blueprint-grid)"/>
      <g stroke="oklch(0.78 0.05 240)" fill="none" strokeWidth="1">
        <rect x="80" y="200" width="220" height="200"/>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <rect key={`o-${r}-${c}`} x={100 + c * 32} y={220 + r * 32} width="20" height="20"/>
          ))
        )}
        <polygon points="380,240 380,400 680,400 680,240 530,200"/>
        <line x1="380" y1="240" x2="680" y2="240"/>
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={`w-${i}`} x={400 + i * 70} y="300" width="40" height="100"/>
        ))}
        <rect x="760" y="260" width="260" height="140"/>
        <circle cx="820" cy="240" r="20"/>
        <circle cx="880" cy="240" r="20"/>
        <rect x="810" y="240" width="80" height="20"/>
        <rect x="940" y="200" width="30" height="60"/>
        <rect x="985" y="220" width="25" height="40"/>
        <rect x="1080" y="150" width="120" height="250"/>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <rect key={`t-${r}-${c}`} x={1095 + c * 26} y={165 + r * 28} width="18" height="18"/>
          ))
        )}
        <g>
          <rect x="50" y="370" width="60" height="22" fill="var(--paper)"/>
          <rect x="110" y="360" width="24" height="32" fill="var(--paper)"/>
          <circle cx="64" cy="394" r="5" fill="var(--paper)"/>
          <circle cx="96" cy="394" r="5" fill="var(--paper)"/>
          <circle cx="122" cy="394" r="5" fill="var(--paper)"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 1340,0; 1340,0" keyTimes="0;0.9;1" dur="30s" repeatCount="indefinite"/>
        </g>
      </g>
      <rect width="1440" height="400" fill="url(#bp-fade)"/>
    </svg>
  );
}

window.F19Viz = { AgentPortrait, AGENT_VIZ, FacilityBackdrop };
