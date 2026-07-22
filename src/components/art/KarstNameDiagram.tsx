import { motion, useReducedMotion } from 'framer-motion'

/* The name, drawn: a karst in section. Strata draw in below a surface
   line; water enters at a sink, works down through the stone, travels
   the hidden channel, and rises as a spring — structure shaped from
   below, read at the surface. Briefing grammar, light register. */

const INK = '#1e2a4a'
const STONE = 'rgba(110,99,85,0.4)'
const WATER = '#2d5a5a'
const SPRING = '#2fa8a0'
const MUT = '#6e6355'

const EASE = [0.22, 1, 0.36, 1] as const

/* the water's whole journey: sink → down through strata → along the
   channel → up the conduit → out at the spring */
const JOURNEY: Array<[number, number]> = [
  [128, 96],
  [148, 150],
  [186, 196],
  [238, 240],
  [292, 282],
  [338, 296],
  [388, 268],
  [420, 210],
  [436, 150],
  [440, 96],
]

const journeyPath = `M ${JOURNEY.map(([x, y]) => `${x} ${y}`).join(' L ')}`

export default function KarstNameDiagram() {
  const reduceMotion = Boolean(useReducedMotion())

  const draw = (delay: number, duration = 1) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration, delay, ease: EASE },
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

  return (
    <svg
      viewBox="0 0 520 360"
      className="w-full max-w-[520px]"
      role="img"
      aria-label="A karst landscape in cross-section: water enters the stone at a sink, carves a hidden channel through the strata, and emerges at the surface as a spring"
    >
      {/* the surface — one continuous line with a standing tower */}
      <motion.path
        d="M 24 96 L 118 96 Q 128 96 138 96 L 196 96 L 224 60 L 252 60 L 274 96 L 430 96 Q 440 96 450 96 L 496 96"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        {...draw(0.1, 1.2)}
      />

      {/* strata — the stone below, drawn in sequence */}
      {[148, 194, 238, 280, 318].map((y, i) => (
        <motion.path
          key={y}
          d={`M 24 ${y} C 120 ${y - 7}, 200 ${y + 7}, 300 ${y - 4} S 460 ${y + 5}, 496 ${y - 2}`}
          fill="none"
          stroke={STONE}
          strokeWidth="1"
          {...draw(0.35 + i * 0.12, 1.1)}
        />
      ))}

      {/* the hidden channel the water has carved */}
      <motion.path
        d={journeyPath}
        fill="none"
        stroke={WATER}
        strokeOpacity="0.32"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        {...draw(1.1, 1.4)}
      />

      {/* water working the stone — dots loop the whole journey */}
      {!reduceMotion &&
        [0, 2.4, 4.8].map((offset) => (
          <motion.circle
            key={offset}
            r="3"
            fill={WATER}
            initial={{ cx: JOURNEY[0][0], cy: JOURNEY[0][1], opacity: 0 }}
            animate={{
              cx: JOURNEY.map(([x]) => x),
              cy: JOURNEY.map(([, y]) => y),
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 7.2,
              delay: 1.8 + offset,
              repeat: Infinity,
              repeatDelay: 0,
              ease: 'linear',
            }}
          />
        ))}

      {/* the spring — where the structure below reads at the surface */}
      <motion.circle cx="440" cy="92" r="3.4" fill={SPRING} {...fade(1.6)} />
      {!reduceMotion && (
        <motion.circle
          cx="440"
          cy="92"
          r="4"
          fill="none"
          stroke={SPRING}
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
          style={{ transformOrigin: '440px 92px' }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.1, ease: 'easeOut', delay: 2.2 }}
        />
      )}

      {/* the sink — where the water enters */}
      <motion.circle cx="128" cy="92" r="2.6" fill={WATER} fillOpacity="0.75" {...fade(1.3)} />

      {/* micro-labels */}
      <motion.g {...fade(1.9)}>
        <text
          x="128"
          y="338"
          textAnchor="start"
          fill={MUT}
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.18em"
          fontFamily="Montserrat, sans-serif"
        >
          SHAPED FROM BELOW
        </text>
        <text
          x="440"
          y="44"
          textAnchor="end"
          fill={SPRING}
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.18em"
          fontFamily="Montserrat, sans-serif"
        >
          READ AT THE SURFACE
        </text>
      </motion.g>
    </svg>
  )
}
