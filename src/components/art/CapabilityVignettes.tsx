/**
 * CapabilityVignettes — wide animated vignettes for the Landing capability
 * cards. Each one demonstrates the artifact its card names, in the
 * dots-and-hairlines vocabulary: dots resolve into real work, never noise.
 *
 *   Dashboard — a raw export (dot table) becomes a framed dashboard
 *   Speak     — one source document fans out into three voices
 *   Concert   — three instruments sound in sequence; one answer lands (teal)
 *   Tool      — an application switches on and starts producing
 *
 * Pure CSS keyframes, deterministic, calm loops (6–8s). Base styles are the
 * SETTLED state — under prefers-reduced-motion each vignette renders its
 * finished artifact.
 */

const NAVY = 'rgba(30, 42, 74, 0.85)'
const NAVY_SOFT = 'rgba(30, 42, 74, 0.45)'
const NAVY_FAINT = 'rgba(30, 42, 74, 0.18)'
const TAUPE = 'rgba(110, 99, 85, 0.55)'
const TEAL = 'rgba(45, 90, 90, 0.9)'

const REDUCE = (prefix: string) => `
  @media (prefers-reduced-motion: reduce) {
    .${prefix} * { animation: none !important; }
  }
`

/* ── A dashboard from your own data ──
   Left: a raw export — rows of data dots, read in sequence.
   Right: the dashboard frame — bars rise, a trend line draws, the KPI lands. */
export function DashboardVignette({ className = '' }: { className?: string }) {
  const rows = [0, 1, 2, 3]
  const cols = [0, 1, 2, 3, 4]
  const bars = [
    { x: 142, h: 26 },
    { x: 162, h: 38 },
    { x: 182, h: 20 },
    { x: 202, h: 44 },
    { x: 222, h: 33 },
  ]
  return (
    <div className={className}>
      <style>{`
        @keyframes cvDashRow {
          0%, 2%   { opacity: 0.12; }
          7%, 93%  { opacity: 1; }
          99%, 100% { opacity: 0.12; }
        }
        @keyframes cvDashFlow {
          0%, 7%   { stroke-dashoffset: 26; opacity: 0; }
          11%      { opacity: 1; }
          18%, 93% { stroke-dashoffset: 0; opacity: 1; }
          99%, 100% { stroke-dashoffset: 26; opacity: 0; }
        }
        @keyframes cvDashBar {
          0%, 12%  { transform: scaleY(0); }
          28%, 94% { transform: scaleY(1); }
          100%     { transform: scaleY(0); }
        }
        @keyframes cvDashSpark {
          0%, 22%  { stroke-dashoffset: 130; }
          42%, 95% { stroke-dashoffset: 0; }
          100%     { stroke-dashoffset: 130; }
        }
        @keyframes cvDashKpi {
          0%, 40%  { opacity: 0; transform: scale(0.4); }
          48%, 94% { opacity: 1; transform: scale(1); }
          100%     { opacity: 0; transform: scale(0.4); }
        }
        .cv-dash .cvd-row { animation: cvDashRow 7.5s ease-in-out infinite; }
        .cv-dash .cvd-flow {
          stroke-dasharray: 26; stroke-dashoffset: 0;
          animation: cvDashFlow 7.5s ease-in-out infinite;
        }
        .cv-dash .cvd-bar {
          transform: scaleY(1); transform-box: fill-box; transform-origin: bottom;
          animation: cvDashBar 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .cv-dash .cvd-spark {
          stroke-dasharray: 130; stroke-dashoffset: 0;
          animation: cvDashSpark 7.5s ease-in-out infinite;
        }
        .cv-dash .cvd-kpi {
          transform-box: fill-box; transform-origin: center;
          animation: cvDashKpi 7.5s ease-in-out infinite;
        }
        ${REDUCE('cv-dash')}
      `}</style>
      <svg viewBox="0 0 280 100" className="cv-dash w-full h-auto" aria-hidden="true">
        {/* the raw export — unframed rows of data */}
        {rows.map((r) => (
          <g key={r} className="cvd-row" style={{ animationDelay: `${r * 0.22}s` }}>
            {cols.map((c) => (
              <circle key={c} cx={26 + c * 15} cy={31 + r * 13} r="1.7" fill={TAUPE} />
            ))}
          </g>
        ))}
        {/* the handoff */}
        <line className="cvd-flow" x1="98" y1="50" x2="122" y2="50" stroke={NAVY_SOFT} strokeWidth="1" />
        {/* the dashboard */}
        <rect x="132" y="16" width="116" height="68" rx="3" fill="none" stroke={NAVY} strokeWidth="1.3" />
        <line x1="132" y1="28" x2="248" y2="28" stroke={NAVY_FAINT} strokeWidth="1" />
        <circle cx="138.5" cy="22" r="1.2" fill={TAUPE} />
        <circle cx="143.5" cy="22" r="1.2" fill={TAUPE} />
        {bars.map((b, i) => (
          <rect
            key={b.x}
            className="cvd-bar"
            x={b.x}
            y={78 - b.h}
            width="9"
            height={b.h}
            fill={NAVY_SOFT}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <polyline
          className="cvd-spark"
          points="140,56 158,48 176,52 194,38 212,42 230,32"
          fill="none"
          stroke={NAVY}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle className="cvd-kpi" cx="230" cy="32" r="3" fill={TEAL} />
      </svg>
    </div>
  )
}

/* ── Write once. Speak everywhere ──
   One source document; three hairlines fan out; three voices appear. */
export function SpeakVignette({ className = '' }: { className?: string }) {
  const docs = [
    { y: 12, lines: [19, 24] },
    { y: 38, lines: [19, 24] },
    { y: 64, lines: [19, 24] },
  ]
  const paths = [
    'M 86 50 C 122 50, 132 23, 174 23',
    'M 86 50 L 174 50',
    'M 86 50 C 122 50, 132 75, 174 75',
  ]
  return (
    <div className={className}>
      <style>{`
        @keyframes cvSpkSrc {
          0%, 2%   { opacity: 0; }
          8%, 90%  { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        @keyframes cvSpkPath {
          0%, 8%   { stroke-dashoffset: 100; }
          26%, 93% { stroke-dashoffset: 0; }
          99%, 100% { stroke-dashoffset: 100; }
        }
        @keyframes cvSpkDoc {
          0%, 20%  { opacity: 0; transform: translateX(-3px); }
          30%, 93% { opacity: 1; transform: translateX(0); }
          99%, 100% { opacity: 0; transform: translateX(-3px); }
        }
        .cv-speak .cvs-src { animation: cvSpkSrc 7s ease-in-out infinite; }
        .cv-speak .cvs-path {
          stroke-dasharray: 100; stroke-dashoffset: 0;
          animation: cvSpkPath 7s ease-in-out infinite;
        }
        .cv-speak .cvs-doc {
          transform-box: fill-box;
          animation: cvSpkDoc 7s ease-in-out infinite;
        }
        ${REDUCE('cv-speak')}
      `}</style>
      <svg viewBox="0 0 280 100" className="cv-speak w-full h-auto" aria-hidden="true">
        {/* the one set of figures */}
        <g className="cvs-src">
          <rect x="36" y="24" width="50" height="52" rx="2.5" fill="none" stroke={NAVY} strokeWidth="1.3" />
          <line x1="44" y1="36" x2="74" y2="36" stroke={NAVY_SOFT} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="44" y1="45" x2="78" y2="45" stroke={TAUPE} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="44" y1="53" x2="70" y2="53" stroke={TAUPE} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="44" y1="61" x2="76" y2="61" stroke={TAUPE} strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {/* the fan */}
        {paths.map((d, i) => (
          <path
            key={d}
            className="cvs-path"
            d={d}
            fill="none"
            stroke={NAVY_SOFT}
            strokeWidth="1"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
        {/* the three voices */}
        {docs.map((doc, i) => (
          <g key={doc.y} className="cvs-doc" style={{ animationDelay: `${i * 0.16}s` }}>
            <rect x="176" y={doc.y} width="66" height="22" rx="2" fill="none" stroke={NAVY} strokeWidth="1.1" />
            <line
              x1="183" y1={doc.y + 8.5} x2={183 + doc.lines[1]} y2={doc.y + 8.5}
              stroke={NAVY_SOFT} strokeWidth="1.2" strokeLinecap="round"
            />
            <line
              x1="183" y1={doc.y + 14.5} x2={183 + doc.lines[0] + 28} y2={doc.y + 14.5}
              stroke={TAUPE} strokeWidth="1.1" strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── The right intelligence for the question ──
   Three instruments sound in sequence; their lines meet; the answer lands teal. */
export function ConcertVignette({ className = '' }: { className?: string }) {
  const nodes = [
    { cy: 24, r: 5 },
    { cy: 50, r: 6.5 },
    { cy: 76, r: 5.5 },
  ]
  return (
    <div className={className}>
      <style>{`
        @keyframes cvCncPulse {
          0%, 6%   { r: var(--r0); opacity: 0; }
          12%      { opacity: 0.55; }
          30%, 100% { r: calc(var(--r0) + 13px); opacity: 0; }
        }
        @keyframes cvCncRoute {
          0%, 6%   { stroke-dashoffset: 120; }
          28%, 93% { stroke-dashoffset: 0; }
          99%, 100% { stroke-dashoffset: 120; }
        }
        @keyframes cvCncAnswer {
          0%, 38%  { opacity: 0; transform: scale(0.3); }
          47%, 93% { opacity: 1; transform: scale(1); }
          99%, 100% { opacity: 0; transform: scale(0.3); }
        }
        @keyframes cvCncRing {
          0%, 44%  { r: 8; opacity: 0; }
          50%      { opacity: 0.5; }
          74%, 100% { r: 19; opacity: 0; }
        }
        .cv-concert .cvc-pulse { fill: none; stroke: ${NAVY_SOFT}; stroke-width: 1; animation: cvCncPulse 6.5s ease-out infinite; }
        .cv-concert .cvc-route {
          stroke-dasharray: 120; stroke-dashoffset: 0;
          animation: cvCncRoute 6.5s ease-in-out infinite;
        }
        .cv-concert .cvc-answer {
          transform-box: fill-box; transform-origin: center;
          animation: cvCncAnswer 6.5s ease-in-out infinite;
        }
        .cv-concert .cvc-ring { fill: none; stroke: ${TEAL}; stroke-width: 1; animation: cvCncRing 6.5s ease-out infinite; }
        ${REDUCE('cv-concert')}
      `}</style>
      <svg viewBox="0 0 280 100" className="cv-concert w-full h-auto" aria-hidden="true">
        {/* the instruments */}
        {nodes.map((n, i) => (
          <g key={n.cy}>
            <circle cx="52" cy={n.cy} r={n.r} fill="none" stroke={NAVY} strokeWidth="1.3" />
            <circle cx="52" cy={n.cy} r="1.8" fill={NAVY_SOFT} />
            <circle
              className="cvc-pulse"
              cx="52"
              cy={n.cy}
              r={n.r}
              style={{ ['--r0' as string]: `${n.r}px`, animationDelay: `${i * 0.35}s` } as React.CSSProperties}
            />
          </g>
        ))}
        {/* the routes, in concert */}
        <path className="cvc-route" d="M 60 24 C 110 24, 130 46, 162 49" fill="none" stroke={NAVY_SOFT} strokeWidth="1" style={{ animationDelay: '0s' }} />
        <path className="cvc-route" d="M 61 50 L 162 50" fill="none" stroke={NAVY_SOFT} strokeWidth="1" style={{ animationDelay: '0.35s' }} />
        <path className="cvc-route" d="M 60 76 C 110 76, 130 54, 162 51" fill="none" stroke={NAVY_SOFT} strokeWidth="1" style={{ animationDelay: '0.7s' }} />
        <line className="cvc-route" x1="166" y1="50" x2="216" y2="50" stroke={NAVY} strokeWidth="1.2" style={{ animationDelay: '1s' }} />
        {/* the answer */}
        <circle className="cvc-answer" cx="228" cy="50" r="7" fill={TEAL} />
        <circle className="cvc-ring" cx="228" cy="50" r="8" />
      </svg>
    </div>
  )
}

/* ── A working tool, not a demonstration ──
   An application window: the switch flips on, and the tool starts producing. */
export function ToolVignette({ className = '' }: { className?: string }) {
  const miniBars = [
    { x: 155, h: 14 },
    { x: 169, h: 22 },
    { x: 183, h: 17 },
    { x: 197, h: 26 },
  ]
  return (
    <div className={className}>
      <style>{`
        @keyframes cvTlKnob {
          0%, 10%  { transform: translateX(0); }
          22%, 92% { transform: translateX(13px); }
          100%     { transform: translateX(0); }
        }
        @keyframes cvTlTrack {
          0%, 10%  { opacity: 0.12; }
          22%, 92% { opacity: 0.8; }
          100%     { opacity: 0.12; }
        }
        @keyframes cvTlLine {
          0%, 24%  { opacity: 0; }
          36%, 90% { opacity: 1; }
          98%, 100% { opacity: 0; }
        }
        @keyframes cvTlBar {
          0%, 30%  { transform: scaleY(0); }
          48%, 90% { transform: scaleY(1); }
          98%, 100% { transform: scaleY(0); }
        }
        .cv-tool .cvt-knob {
          transform-box: fill-box;
          animation: cvTlKnob 6s ease-in-out infinite;
          transform: translateX(13px);
        }
        .cv-tool .cvt-track { animation: cvTlTrack 6s ease-in-out infinite; opacity: 0.8; }
        .cv-tool .cvt-line { animation: cvTlLine 6s ease-in-out infinite; }
        .cv-tool .cvt-bar {
          transform: scaleY(1); transform-box: fill-box; transform-origin: bottom;
          animation: cvTlBar 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        ${REDUCE('cv-tool')}
      `}</style>
      <svg viewBox="0 0 280 100" className="cv-tool w-full h-auto" aria-hidden="true">
        {/* the application */}
        <rect x="60" y="14" width="160" height="72" rx="4" fill="none" stroke={NAVY} strokeWidth="1.3" />
        <line x1="60" y1="28" x2="220" y2="28" stroke={NAVY_FAINT} strokeWidth="1" />
        <circle cx="68" cy="21" r="1.3" fill={TAUPE} />
        <circle cx="74" cy="21" r="1.3" fill={TAUPE} />
        {/* the switch */}
        <rect x="74" y="42" width="27" height="11" rx="5.5" fill="none" stroke={NAVY_SOFT} strokeWidth="1.1" />
        <rect className="cvt-track" x="74" y="42" width="27" height="11" rx="5.5" fill={NAVY_SOFT} opacity="0.8" />
        <circle className="cvt-knob" cx="80.5" cy="47.5" r="3.6" fill={NAVY} />
        <line className="cvt-line" x1="74" y1="64" x2="118" y2="64" stroke={TAUPE} strokeWidth="1.3" strokeLinecap="round" style={{ animationDelay: '0.1s' }} />
        <line className="cvt-line" x1="74" y1="72" x2="106" y2="72" stroke={TAUPE} strokeWidth="1.3" strokeLinecap="round" style={{ animationDelay: '0.25s' }} />
        {/* the work it produces */}
        <line x1="140" y1="40" x2="140" y2="78" stroke={NAVY_FAINT} strokeWidth="0.8" />
        {miniBars.map((b, i) => (
          <rect
            key={b.x}
            className="cvt-bar"
            x={b.x}
            y={78 - b.h}
            width="8"
            height={b.h}
            fill={NAVY_SOFT}
            style={{ animationDelay: `${0.12 * i}s` }}
          />
        ))}
        <line className="cvt-line" x1="154" y1="46" x2="196" y2="46" stroke={NAVY_SOFT} strokeWidth="1.3" strokeLinecap="round" style={{ animationDelay: '0.4s' }} />
      </svg>
    </div>
  )
}
