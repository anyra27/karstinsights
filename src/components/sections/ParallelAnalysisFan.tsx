import { motion, useReducedMotion } from 'framer-motion'

/* The Ultracode briefing's scale field, in the site's grammar: one question
   node fans into a wide matrix of parallel checks that shimmer in waves —
   the amount of looking that puts a read within reach. Cream ground, thin
   strokes, no frame. Decorative on mobile, so hidden there. */

const INK = '#1e2a4a'
const TEAL = '#2d5a5a'
const BRIGHT = '#2fa8a0'
const MUT = '#6e6355'

const EASE = [0.22, 1, 0.36, 1] as const

/* Field geometry */
const COLS = 19
const ROWS = 8
const X0 = 300
const XSTEP = 45
const Y0 = 44
const YSTEP = 21
const NODE = { x: 150, y: Y0 + ((ROWS - 1) * YSTEP) / 2 }

/* Deterministic per-cell character — no randomness, stable across renders */
function cell(c: number, r: number) {
  const h = (c * 31 + r * 17 + ((c * r) % 5) * 11) % 100
  const tone = h % 4
  const fill = tone === 0 ? INK : tone === 1 ? TEAL : tone === 2 ? BRIGHT : INK
  const base = tone === 3 ? 0.14 : tone === 0 ? 0.5 : 0.42
  const rr = 2 + ((h >> 2) % 3) * 0.45
  const shimmers = h % 5 !== 1
  return { fill, base, rr, shimmers }
}

export default function ParallelAnalysisFan() {
  const reduceMotion = Boolean(useReducedMotion())

  const draw = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.8, delay, ease: EASE },
        }
  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { scale: 0.8, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, delay, ease: EASE },
        }
  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 6 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, delay, ease: EASE },
        }

  /* fan lines land on the field's left column, spread across the rows */
  const fanRows = [0, 1.5, 3, 4, 5.5, 7]

  return (
    <svg
      viewBox="0 0 1160 260"
      className="mx-auto mb-14 mt-4 hidden w-full max-w-[1160px] md:block"
      role="img"
      aria-label="One question fans out into a wide field of parallel checks, the scale of analysis that puts this read within reach"
    >
      {/* the question node — starburst with a soft halo */}
      <motion.g {...pop(0)}>
        <circle cx={NODE.x} cy={NODE.y} r="34" fill="rgba(30,42,74,0.045)" stroke="none" />
        <circle cx={NODE.x} cy={NODE.y} r="26" fill="#fffdf9" stroke={INK} strokeWidth="1.6" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={NODE.x + Math.cos(a) * 6}
              y1={NODE.y + Math.sin(a) * 6}
              x2={NODE.x + Math.cos(a) * 12}
              y2={NODE.y + Math.sin(a) * 12}
              stroke={INK}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )
        })}
        <circle cx={NODE.x} cy={NODE.y} r="2.4" fill={INK} />
      </motion.g>
      <motion.g {...fade(0.35)}>
        <text
          x={NODE.x}
          y={NODE.y + 62}
          textAnchor="middle"
          fill={INK}
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.16em"
          fontFamily="Montserrat, sans-serif"
        >
          YOUR QUESTION
        </text>
      </motion.g>

      {/* fan lines into the field */}
      {fanRows.map((fr, i) => (
        <motion.path
          key={fr}
          d={`M ${NODE.x + 28} ${NODE.y} L ${X0 - 18} ${Y0 + fr * YSTEP}`}
          fill="none"
          stroke={TEAL}
          strokeOpacity="0.4"
          strokeWidth="1.1"
          {...draw(0.25 + i * 0.06)}
        />
      ))}

      {/* dots streaming the fan, feeding the field */}
      {!reduceMotion &&
        fanRows.map((fr, i) => (
          <motion.circle
            key={`s-${fr}`}
            r="2.4"
            fill={TEAL}
            initial={{ cx: NODE.x + 28, cy: NODE.y, opacity: 0 }}
            animate={{
              cx: [NODE.x + 28, X0 - 18],
              cy: [NODE.y, Y0 + fr * YSTEP],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 1.6,
              delay: 1.2 + i * 0.5,
              repeat: Infinity,
              repeatDelay: fanRows.length * 0.5 - 1.6 + 1.4,
              ease: 'linear',
            }}
          />
        ))}

      {/* the field — columns fade in left to right, then shimmer in waves */}
      {Array.from({ length: COLS }, (_, c) => (
        <motion.g
          key={c}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true, margin: '-60px' },
                transition: { duration: 0.5, delay: 0.45 + c * 0.045, ease: EASE },
              })}
        >
          {Array.from({ length: ROWS }, (_, r) => {
            const { fill, base, rr, shimmers } = cell(c, r)
            const cx = X0 + c * XSTEP
            const cy = Y0 + r * YSTEP
            return shimmers && !reduceMotion ? (
              <motion.circle
                key={r}
                cx={cx}
                cy={cy}
                r={rr}
                fill={fill}
                initial={{ opacity: base }}
                animate={{ opacity: [base, Math.min(base + 0.45, 0.9), base] }}
                transition={{
                  duration: 3.2,
                  delay: c * 0.14 + (r % 4) * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: 'easeInOut',
                }}
              />
            ) : (
              <circle key={r} cx={cx} cy={cy} r={rr} fill={fill} opacity={base} />
            )
          })}
        </motion.g>
      ))}

      {/* the read, under the field */}
      <motion.g {...fade(1.4)}>
        <text
          x={(X0 + X0 + (COLS - 1) * XSTEP) / 2}
          y="248"
          textAnchor="middle"
          fill={MUT}
          fontSize="13"
          fontStyle="italic"
          fontFamily='"Libre Baskerville", Georgia, serif'
        >
          your question, weighed against the whole picture at once
        </text>
      </motion.g>
    </svg>
  )
}
