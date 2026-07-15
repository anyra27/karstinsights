/**
 * StandardGlyphs — three small living beats for "The Standard" band, in the
 * main karst.build capability-card language (dots and hairlines resolving
 * into real work). One per column; each demonstrates its claim:
 *
 *   Built      — raw data dots assemble into a finished artifact
 *   Present    — that artifact goes in front of the room (draft → board)
 *   Capacity   — the capability transfers to the district and STAYS (brass)
 *
 * Pure CSS keyframes, calm ~7s loops, settled states under reduced motion.
 */

const NAVY = 'rgba(30, 42, 74, 0.85)'
const NAVY_SOFT = 'rgba(30, 42, 74, 0.42)'
const NAVY_FAINT = 'rgba(30, 42, 74, 0.16)'
const TAUPE = 'rgba(110, 99, 85, 0.5)'
const TEAL = 'rgba(45, 90, 90, 0.9)'
const BRASS = 'rgba(168, 128, 42, 0.95)'

const REDUCE = (p: string) => `@media (prefers-reduced-motion: reduce){ .${p} *{ animation: none !important } }`

const WRAP = 'w-full max-w-[180px] mx-auto mb-5'

/* ── Built, not browsed — raw dots assemble into a finished artifact ── */
export function BuiltGlyph({ className = '' }: { className?: string }) {
  return (
    <div className={`${WRAP} ${className}`}>
      <style>{`
        @keyframes sgBuiltDot { 0%,6%{opacity:.12} 14%,90%{opacity:1} 98%,100%{opacity:.12} }
        @keyframes sgBuiltFlow { 0%,10%{stroke-dashoffset:24;opacity:0} 16%{opacity:1} 26%,92%{stroke-dashoffset:0;opacity:1} 99%,100%{stroke-dashoffset:24;opacity:0} }
        @keyframes sgBuiltBar { 0%,28%{transform:scaleY(0)} 46%,92%{transform:scaleY(1)} 100%{transform:scaleY(0)} }
        @keyframes sgBuiltKpi { 0%,52%{opacity:0;transform:scale(.3)} 62%,92%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(.3)} }
        .sg-built .b-dot{ animation: sgBuiltDot 7s ease-in-out infinite }
        .sg-built .b-flow{ stroke-dasharray:24; animation: sgBuiltFlow 7s ease-in-out infinite }
        .sg-built .b-bar{ transform-box:fill-box; transform-origin:bottom; animation: sgBuiltBar 7s cubic-bezier(.4,0,.2,1) infinite }
        .sg-built .b-kpi{ transform-box:fill-box; transform-origin:center; animation: sgBuiltKpi 7s ease-in-out infinite }
        ${REDUCE('sg-built')}
      `}</style>
      <svg viewBox="0 0 200 76" className="sg-built w-full h-auto" aria-hidden="true">
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <circle key={`${r}-${c}`} className="b-dot" cx={14 + c * 11} cy={26 + r * 12} r="1.7" fill={TAUPE} style={{ animationDelay: `${(r * 3 + c) * 0.06}s` }} />
          )),
        )}
        <line className="b-flow" x1="58" y1="42" x2="80" y2="42" stroke={NAVY_SOFT} strokeWidth="1" />
        <rect x="92" y="14" width="94" height="54" rx="2.5" fill="none" stroke={NAVY} strokeWidth="1.3" />
        <line x1="92" y1="26" x2="186" y2="26" stroke={NAVY_FAINT} strokeWidth="1" />
        {[
          { x: 108, h: 18 },
          { x: 124, h: 28 },
          { x: 140, h: 22 },
          { x: 156, h: 34 },
        ].map((b, i) => (
          <rect key={b.x} className="b-bar" x={b.x} y={62 - b.h} width="8" height={b.h} fill={NAVY_SOFT} style={{ animationDelay: `${0.5 + i * 0.1}s` }} />
        ))}
        <circle className="b-kpi" cx="172" cy="34" r="3" fill={TEAL} />
      </svg>
    </div>
  )
}

/* ── Presentation-ready — a draft becomes the board in front of the room ── */
export function PresentGlyph({ className = '' }: { className?: string }) {
  return (
    <div className={`${WRAP} ${className}`}>
      <style>{`
        @keyframes sgPresArrow { 0%,12%{stroke-dashoffset:24;opacity:0} 18%{opacity:1} 30%,92%{stroke-dashoffset:0;opacity:1} 99%,100%{stroke-dashoffset:24;opacity:0} }
        @keyframes sgPresLine { 0%,30%{opacity:0} 44%,92%{opacity:1} 100%{opacity:0} }
        @keyframes sgPresLive { 0%,54%{opacity:0} 62%{opacity:1} 78%,92%{opacity:.5} 100%{opacity:0} }
        @keyframes sgPresSeat { 0%,60%{opacity:0;transform:translateY(3px)} 72%,92%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(3px)} }
        .sg-pres .p-arrow{ stroke-dasharray:24; animation: sgPresArrow 7s ease-in-out infinite }
        .sg-pres .p-line{ animation: sgPresLine 7s ease-in-out infinite }
        .sg-pres .p-live{ animation: sgPresLive 7s ease-in-out infinite }
        .sg-pres .p-seat{ transform-box:fill-box; animation: sgPresSeat 7s ease-in-out infinite }
        ${REDUCE('sg-pres')}
      `}</style>
      <svg viewBox="0 0 200 76" className="sg-pres w-full h-auto" aria-hidden="true">
        {/* the draft */}
        <rect x="12" y="22" width="34" height="32" rx="2" fill="none" stroke={TAUPE} strokeWidth="1.1" />
        <line x1="18" y1="30" x2="40" y2="30" stroke={TAUPE} strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="36" x2="36" y2="36" stroke={TAUPE} strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="42" x2="40" y2="42" stroke={TAUPE} strokeWidth="1" strokeLinecap="round" />
        {/* the move */}
        <line className="p-arrow" x1="52" y1="38" x2="72" y2="38" stroke={NAVY_SOFT} strokeWidth="1" />
        <path className="p-arrow" d="M 68 34 L 73 38 L 68 42" fill="none" stroke={NAVY_SOFT} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        {/* the board, in front of the room */}
        <rect x="82" y="8" width="104" height="50" rx="2.5" fill="none" stroke={NAVY} strokeWidth="1.3" />
        <line className="p-line" x1="92" y1="20" x2="160" y2="20" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" style={{ animationDelay: '0.1s' }} />
        <line className="p-line" x1="92" y1="30" x2="150" y2="30" stroke={TAUPE} strokeWidth="1.2" strokeLinecap="round" style={{ animationDelay: '0.25s' }} />
        <line className="p-line" x1="92" y1="38" x2="156" y2="38" stroke={TAUPE} strokeWidth="1.2" strokeLinecap="round" style={{ animationDelay: '0.4s' }} />
        <circle className="p-live" cx="176" cy="18" r="2.4" fill={TEAL} />
        {/* the room */}
        {[120, 134, 148].map((x, i) => (
          <circle key={x} className="p-seat" cx={x} cy="68" r="2.6" fill={NAVY_SOFT} style={{ animationDelay: `${0.7 + i * 0.1}s` }} />
        ))}
      </svg>
    </div>
  )
}

/* ── Capacity, in every seat — capability rises across every seat (the
   brass dots are the people; the teal rings are the capability they gain) ── */
export function CapacityGlyph({ className = '' }: { className?: string }) {
  const seats = [24, 62, 100, 138, 176]
  return (
    <div className={`${WRAP} ${className}`}>
      <style>{`
        @keyframes sgSeatRing { 0%,4%{transform:scale(0);opacity:0} 12%{opacity:1} 24%,80%{transform:scale(1);opacity:.9} 90%,100%{transform:scale(0);opacity:0} }
        .sg-cap .s-ring{ transform-box:fill-box; transform-origin:center; animation: sgSeatRing 7s ease-in-out infinite }
        ${REDUCE('sg-cap')}
      `}</style>
      <svg viewBox="0 0 200 76" className="sg-cap w-full h-auto" aria-hidden="true">
        {/* the row of seats */}
        <line x1="24" y1="38" x2="176" y2="38" stroke={NAVY_FAINT} strokeWidth="1" />
        {seats.map((x, i) => (
          <g key={x}>
            <circle className="s-ring" cx={x} cy="38" r="9" fill="none" stroke={TEAL} strokeWidth="1.4" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={x} cy="38" r="2.6" fill={BRASS} />
          </g>
        ))}
      </svg>
    </div>
  )
}
