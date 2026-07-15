/**
 * WorkflowGlyphs — three abstract concept glyphs for the Frame workflow.
 * No tech-stack reveals; each one visualizes a step:
 *   01 · Conversation — concentric ripples expanding (the dialogue)
 *   02 · Synthesis    — scattered points converging into a lattice (composition)
 *   03 · Published    — a frame outline drawing in around a focal node (live)
 */

const STROKE_NAVY = 'rgba(30, 42, 74, 0.85)'
const STROKE_NAVY_FAINT = 'rgba(30, 42, 74, 0.35)'
const FILL_TAUPE = 'rgba(110, 99, 85, 0.7)'

/* ── Step 01 · Conversation ── */
export function ConversationGlyph({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        @keyframes wgRipple {
          0%   { r: 6; opacity: 0; stroke-width: 1.5; }
          15%  { opacity: 0.7; }
          90%  { r: 38; opacity: 0; stroke-width: 0.4; }
          100% { r: 38; opacity: 0; stroke-width: 0.4; }
        }
        @keyframes wgCenter {
          0%, 100% { transform: scale(1); }
          12%      { transform: scale(1.18); }
          24%      { transform: scale(1); }
        }
        .wg-conv .wg-ripple {
          fill: none;
          stroke: ${STROKE_NAVY};
          animation: wgRipple 2.4s ease-out infinite;
          transform-box: fill-box;
        }
        .wg-conv .wg-ripple-2 { animation-delay: 0.8s; }
        .wg-conv .wg-ripple-3 { animation-delay: 1.6s; }
        .wg-conv .wg-center {
          fill: ${STROKE_NAVY};
          transform-origin: 40px 40px;
          transform-box: fill-box;
          animation: wgCenter 2.4s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 80 80" className="wg-conv w-full h-auto" aria-hidden="true">
        <circle className="wg-ripple wg-ripple-1" cx="40" cy="40" r="6" />
        <circle className="wg-ripple wg-ripple-2" cx="40" cy="40" r="6" />
        <circle className="wg-ripple wg-ripple-3" cx="40" cy="40" r="6" />
        <circle className="wg-center" cx="40" cy="40" r="4.5" />
      </svg>
    </div>
  )
}

/* ── Step 02 · Synthesis ── */
export function SynthesisGlyph({ className = '' }: { className?: string }) {
  // 12 scattered start positions converging to a tight 3x3 lattice
  const targets = [
    { sx: 14, sy: 18, tx: 32, ty: 32 },
    { sx: 64, sy: 14, tx: 40, ty: 32 },
    { sx: 12, sy: 62, tx: 48, ty: 32 },
    { sx: 70, sy: 64, tx: 32, ty: 40 },
    { sx: 18, sy: 36, tx: 40, ty: 40 },
    { sx: 60, sy: 38, tx: 48, ty: 40 },
    { sx: 30, sy: 12, tx: 32, ty: 48 },
    { sx: 50, sy: 70, tx: 40, ty: 48 },
    { sx: 8,  sy: 44, tx: 48, ty: 48 },
  ]
  return (
    <div className={className}>
      <style>{`
        @keyframes wgConverge {
          0%, 25%   { cx: var(--sx); cy: var(--sy); opacity: 0.4; }
          55%, 75%  { cx: var(--tx); cy: var(--ty); opacity: 1; }
          100%      { cx: var(--sx); cy: var(--sy); opacity: 0.4; }
        }
        .wg-synth .wg-mote {
          fill: ${STROKE_NAVY};
          animation: wgConverge 4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
      <svg viewBox="0 0 80 80" className="wg-synth w-full h-auto" aria-hidden="true">
        {targets.map((d, i) => (
          <circle
            key={i}
            className="wg-mote"
            cx={d.sx}
            cy={d.sy}
            r="2"
            style={{
              ['--sx' as string]: `${d.sx}`,
              ['--sy' as string]: `${d.sy}`,
              ['--tx' as string]: `${d.tx}`,
              ['--ty' as string]: `${d.ty}`,
              animationDelay: `${i * 0.06}s`,
            } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  )
}

/* ── A working tool — a module/app with a control that switches on (live) ── */
export function ToolGlyph({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        @keyframes wgToggle {
          0%, 22%  { transform: translateX(0); }
          48%, 82% { transform: translateX(11px); }
          100%     { transform: translateX(0); }
        }
        @keyframes wgToggleOn {
          0%, 22%, 100% { opacity: 0.18; }
          48%, 82%      { opacity: 0.85; }
        }
        .wg-tool .wg-knob {
          fill: ${STROKE_NAVY};
          animation: wgToggle 3.2s ease-in-out infinite;
          transform-box: fill-box;
        }
        .wg-tool .wg-track-on {
          fill: ${STROKE_NAVY};
          animation: wgToggleOn 3.2s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 80 80" className="wg-tool w-full h-auto" aria-hidden="true">
        {/* Module body */}
        <rect x="16" y="16" width="48" height="48" rx="5" fill="none" stroke={STROKE_NAVY} strokeWidth="1.4" />
        {/* Header divider + window controls */}
        <line x1="16" y1="29" x2="64" y2="29" stroke={STROKE_NAVY_FAINT} strokeWidth="1" />
        <circle cx="22" cy="22.5" r="1.3" fill={FILL_TAUPE} />
        <circle cx="27" cy="22.5" r="1.3" fill={FILL_TAUPE} />
        {/* A line of content */}
        <line x1="23" y1="38" x2="45" y2="38" stroke={FILL_TAUPE} strokeWidth="1.4" strokeLinecap="round" />
        {/* Toggle — track, the "on" fill that glows, and the sliding knob */}
        <rect x="23" y="46" width="23" height="9" rx="4.5" fill="none" stroke={STROKE_NAVY_FAINT} strokeWidth="1.2" />
        <rect className="wg-track-on" x="23" y="46" width="23" height="9" rx="4.5" opacity="0.18" />
        <circle className="wg-knob" cx="28" cy="50.5" r="3.2" />
      </svg>
    </div>
  )
}

/* ── Step 03 · Published ── */
export function PublishedGlyph({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        @keyframes wgFrameDraw {
          0%, 10% { stroke-dashoffset: 200; }
          45%     { stroke-dashoffset: 0; }
          90%     { stroke-dashoffset: 0; }
          100%    { stroke-dashoffset: 200; }
        }
        @keyframes wgContent {
          0%, 35% { opacity: 0; transform: translateY(2px); }
          55%     { opacity: 1; transform: translateY(0); }
          90%     { opacity: 1; transform: translateY(0); }
          100%    { opacity: 0; transform: translateY(2px); }
        }
        @keyframes wgLivePulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
        .wg-pub .wg-frame {
          fill: none;
          stroke: ${STROKE_NAVY};
          stroke-width: 1.4;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: wgFrameDraw 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .wg-pub .wg-content-line {
          stroke: ${FILL_TAUPE};
          stroke-width: 1.4;
          stroke-linecap: round;
          animation: wgContent 3.2s ease-in-out infinite;
        }
        .wg-pub .wg-live {
          fill: ${STROKE_NAVY};
          animation: wgLivePulse 1.4s ease-in-out infinite;
        }
        .wg-pub .wg-content-2 { animation-delay: 0.18s; }
        .wg-pub .wg-content-3 { animation-delay: 0.36s; }
      `}</style>
      <svg viewBox="0 0 80 80" className="wg-pub w-full h-auto" aria-hidden="true">
        {/* Frame outline */}
        <rect className="wg-frame" x="14" y="20" width="52" height="40" rx="2" />
        {/* Content lines */}
        <line className="wg-content-line wg-content-1" x1="22" y1="32" x2="50" y2="32" />
        <line className="wg-content-line wg-content-2" x1="22" y1="40" x2="58" y2="40" />
        <line className="wg-content-line wg-content-3" x1="22" y1="48" x2="44" y2="48" />
        {/* Live indicator dot */}
        <circle className="wg-live" cx="60" cy="26" r="1.8" />
        {/* Faint stroke beneath frame indicating depth */}
        <line x1="20" y1="64" x2="60" y2="64" stroke={STROKE_NAVY_FAINT} strokeWidth="0.5" />
      </svg>
    </div>
  )
}
