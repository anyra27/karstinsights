/**
 * ConstellationField — chaos → structure → sound-wave for the homepage
 * "measurably different rhythm" section.
 *
 * Each mote has TWO stacked animations:
 *   • Outer (cf-cycle, 18s): scattered chaos → settle to lattice → hold →
 *     disperse back to chaos. Slow, meditative loop.
 *   • Inner (cf-wave, 3.6s perpetual): vertical oscillation. Column-based
 *     animation-delay creates a traveling wave across the field.
 *
 * The two transforms compose: when dots are scattered, the wave is
 * invisible noise; when they settle into the lattice, the wave becomes a
 * coherent traveling sound wave moving left-to-right. The transformation
 * arc reads as: chaos → composed structure → rhythm in motion.
 */

const COLS = 14
const ROWS = 5
const SPACING = 42
const PAD_X = 32
const PAD_Y = 32
const VIEW_W = (COLS - 1) * SPACING + 2 * PAD_X  // 610
const VIEW_H = (ROWS - 1) * SPACING + 2 * PAD_Y  // 232
const CENTER_Y = VIEW_H / 2

interface Mote {
  i: number
  col: number
  /** Lattice position (target) */
  tx: number
  ty: number
  /** Translation delta from lattice → scatter start */
  sdx: number
  sdy: number
  /** Per-dot stagger on the cycle (s) */
  delay: number
  /** Opacity baseline (depth variation) */
  opacity: number
}

/* Deterministic pseudo-random so the field looks identical every render */
function prand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const MOTES: Mote[] = (() => {
  const motes: Mote[] = []
  let i = 0
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const tx = PAD_X + c * SPACING
      const ty = PAD_Y + r * SPACING

      // Scatter position — random within canvas, biased toward lower half
      const sx = prand(i + 1) * (VIEW_W - 40) + 20
      const sy = VIEW_H * 0.4 + prand(i + 91) * (VIEW_H * 0.7)

      motes.push({
        i,
        col: c,
        tx,
        ty,
        sdx: sx - tx,
        sdy: sy - ty,
        delay: prand(i + 51) * 0.6, // 0–0.6s stagger
        opacity: 0.7 + prand(i + 71) * 0.25, // 0.7–0.95
      })
      i++
    }
  }
  return motes
})()

/** Wave parameters */
const WAVE_DURATION = 3.6        // seconds per wave cycle
const WAVE_PER_COL_DELAY = 0.16  // seconds offset between columns (creates travel)

export default function ConstellationField({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        /* Outer cycle (18s) — chaos → settle → hold → disperse → loop */
        @keyframes cf-cycle {
          0%, 10%   { transform: translate(var(--sdx), var(--sdy)); opacity: 0; }
          22%       { transform: translate(var(--sdx), var(--sdy)); opacity: var(--op); }
          40%       { transform: translate(0, 0); opacity: var(--op); }
          88%       { transform: translate(0, 0); opacity: var(--op); }
          96%, 100% { transform: translate(var(--sdx), var(--sdy)); opacity: 0; }
        }
        /* Inner wave (3.6s perpetual) — asymmetric vertical oscillation,
           reads as an audio-style waveform once dots are aligned. */
        @keyframes cf-wave {
          0%, 100% { transform: translate(0, 0); }
          25%      { transform: translate(0, -14px); }
          50%      { transform: translate(0, 0); }
          75%      { transform: translate(0, 6px); }
        }

        .cf-cycle {
          animation-name: cf-cycle;
          animation-duration: 18s;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cf-wave {
          animation-name: cf-wave;
          animation-duration: ${WAVE_DURATION}s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .cf-mote {
          fill: url(#cf-spectrum);
        }
      `}</style>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="cf-spectrum"
            gradientUnits="userSpaceOnUse"
            x1={PAD_X}
            y1={CENTER_Y}
            x2={VIEW_W - PAD_X}
            y2={CENTER_Y}
          >
            <stop offset="0%"  stopColor="#1e2a4a" />
            <stop offset="50%" stopColor="#4a6a8a" />
            <stop offset="100%" stopColor="#4a2d5a" />
          </linearGradient>
        </defs>

        {MOTES.map((m) => (
          <g
            key={m.i}
            className="cf-cycle"
            style={{
              ['--sdx' as string]: `${m.sdx}px`,
              ['--sdy' as string]: `${m.sdy}px`,
              ['--op' as string]: m.opacity,
              animationDelay: `${m.delay}s`,
            } as React.CSSProperties}
          >
            <g
              className="cf-wave"
              style={{
                /* Negative delay = offset further into the wave cycle, so
                   each column is at a different phase. Creates a traveling
                   wave moving left → right. */
                animationDelay: `${-m.col * WAVE_PER_COL_DELAY}s`,
              }}
            >
              <circle className="cf-mote" cx={m.tx} cy={m.ty} r="2.2" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
