import { motion, useReducedMotion } from 'framer-motion'

/* The Fieldwork transformation, drawn in the briefing grammar: one person
   polishing an email becomes the same person directing a computer that
   researches, drafts, and builds under their judgment. Lines draw in,
   task cards light in sequence, dots carry the work. */

const INK = '#1e2a4a'
const PERI = '#5a6aaa'
const GOLD = '#a8802a'
const MUT = '#6e6355'

const EASE = [0.22, 1, 0.36, 1] as const

const TASKS: Array<{ x: number; label: string }> = [
  { x: 300, label: 'researches' },
  { x: 400, label: 'drafts' },
  { x: 500, label: 'builds' },
]

export default function FieldworkTransformDiagram() {
  const reduceMotion = Boolean(useReducedMotion())

  const draw = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.7, delay, ease: EASE },
        }

  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { scale: 0.7, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, delay, ease: EASE },
        }

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.55, delay, ease: EASE },
        }

  return (
    <svg
      viewBox="0 0 560 218"
      className="mt-8 hidden w-full max-w-[560px] md:block"
      aria-label="One leader moves from polishing an email with AI to directing a computer that researches, drafts, and builds"
      role="img"
    >
      {/* ── Before: one person, one chat exchange ── */}
      <motion.circle cx="95" cy="52" r="7" fill="none" stroke={INK} strokeWidth="1.6" {...pop(0.1)} />
      <motion.path d="M 95 62 L 95 96" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1.2" {...draw(0.25)} />
      <motion.g {...pop(0.4)}>
        <rect x="68" y="96" width="54" height="36" rx="4" fill="#fffdf9" stroke={INK} strokeOpacity="0.25" strokeWidth="1.1" />
        <line x1="77" y1="109" x2="113" y2="109" stroke={MUT} strokeOpacity="0.55" strokeWidth="1.4" />
        <line x1="77" y1="119" x2="102" y2="119" stroke={MUT} strokeOpacity="0.35" strokeWidth="1.4" />
      </motion.g>
      {/* the one exchange, ping-ponging */}
      {!reduceMotion && (
        <motion.circle
          r="2.6"
          cx="95"
          fill={PERI}
          initial={{ cy: 66 }}
          animate={{ cy: [66, 92, 66], opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      )}
      <motion.text
        x="95"
        y="162"
        textAnchor="middle"
        fill={MUT}
        fontSize="11"
        fontStyle="italic"
        fontFamily='"Libre Baskerville", Georgia, serif'
        {...fade(0.55)}
      >
        polishing an email
      </motion.text>

      {/* ── Fieldwork: the crossing ── */}
      <motion.path d="M 150 108 L 236 108" fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1.2" {...draw(0.7)} />
      <motion.path d="M 230 103 L 240 108 L 230 113" fill="none" stroke={GOLD} strokeOpacity="0.7" strokeWidth="1.2" {...draw(1.0)} />
      <motion.text
        x="193"
        y="93"
        textAnchor="middle"
        fill={GOLD}
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.18em"
        fontFamily="Montserrat, sans-serif"
        {...fade(0.9)}
      >
        FIELDWORK
      </motion.text>
      {!reduceMotion && (
        <motion.circle
          r="3"
          cy="108"
          initial={{ cx: 152, opacity: 0 }}
          animate={{ cx: [152, 234, 234], opacity: [0, 1, 0], fill: [INK, PERI, GOLD] }}
          transition={{ duration: 2.8, times: [0, 0.82, 1], repeat: Infinity, repeatDelay: 1.1, ease: 'linear', delay: 1.4 }}
        />
      )}

      {/* ── After: the same person, directing the work ── */}
      <motion.circle cx="400" cy="44" r="7" fill="rgba(168,128,42,0.14)" stroke={GOLD} strokeWidth="1.6" {...pop(1.1)} />
      {!reduceMotion && (
        <motion.circle
          cx="400"
          cy="44"
          r="7"
          fill="none"
          stroke={GOLD}
          initial={{ opacity: 0 }}
          animate={{ scale: [1, 1.8], opacity: [0.45, 0] }}
          style={{ transformOrigin: '400px 44px' }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: 'easeOut', delay: 2 }}
        />
      )}
      {TASKS.map((task, i) => (
        <g key={task.label}>
          <motion.path
            d={`M 400 54 L ${task.x} 104`}
            fill="none"
            stroke={PERI}
            strokeOpacity="0.4"
            strokeWidth="1.1"
            {...draw(1.25 + i * 0.12)}
          />
          {/* work traveling down, staggered like the briefing sequence */}
          {!reduceMotion && (
            <motion.circle
              r="2.4"
              fill={PERI}
              initial={{ cx: 400, cy: 56, opacity: 0 }}
              animate={{ cx: [400, task.x], cy: [56, 102], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.6, ease: 'easeIn', delay: 2 + i * 0.55 }}
            />
          )}
          <motion.g {...pop(1.4 + i * 0.12)}>
            <rect x={task.x - 36} y="104" width="72" height="42" rx="4" fill="#fffdf9" stroke={INK} strokeOpacity="0.18" strokeWidth="1.1" />
            {/* light-up loop, ic-seq style */}
            {!reduceMotion && (
              <motion.rect
                x={task.x - 36}
                y="104"
                width="72"
                height="42"
                rx="4"
                fill="none"
                stroke={PERI}
                strokeWidth="1.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 4.4, times: [0.1, 0.28, 0.5], repeat: Infinity, delay: 2.4 + i * 1.45 }}
              />
            )}
            <text
              x={task.x}
              y="130"
              textAnchor="middle"
              fill={INK}
              fontSize="10.5"
              fontStyle="italic"
              fontFamily='"Libre Baskerville", Georgia, serif'
            >
              {task.label}
            </text>
          </motion.g>
        </g>
      ))}
      <motion.text
        x="400"
        y="180"
        textAnchor="middle"
        fill={MUT}
        fontSize="11"
        fontStyle="italic"
        fontFamily='"Libre Baskerville", Georgia, serif'
        {...fade(1.8)}
      >
        directing the work, under their judgment
      </motion.text>
    </svg>
  )
}
