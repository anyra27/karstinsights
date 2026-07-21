import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* Option A — the Fieldwork diagram re-anchored on the PARTNERSHIP and the
   PEOPLE, not the production machine. Your team starts at one capability
   line; beside a Karst partner, through protected build time, they rise to
   a higher one and begin producing working systems the district keeps.
   The FIELDWORK toggle shows what the partnership adds: off, the team holds
   at the baseline; on, the partner joins, the team rises, the builds flow. */

const INK = '#1e2a4a'
const TEAL = '#2d5a5a'
const GOLD = '#a8802a'
const MUT = '#6e6355'

const EASE = [0.22, 1, 0.36, 1] as const
const FLOW = 3.2

/* Geometry — a rise from the baseline (low) to the capable line (high) */
const BASE_Y = 300
const TOP_Y = 132
const TEAM = { x: 110, y: BASE_Y }
const PARTNER = { x: 430, y: 232 }
const ARRIVE = { x: 660, y: TOP_Y }
const FINAL = { x: 1092, y: TOP_Y }

/* Waypoints a rising team member travels: team → up past the partner →
   the capable line → along it to working systems */
const RISE: Array<[number, number]> = [
  [168, BASE_Y],
  [300, 286],
  [PARTNER.x, 244],
  [548, 176],
  [ARRIVE.x - 20, TOP_Y],
]
const RUN: Array<[number, number]> = [
  [ARRIVE.x + 26, TOP_Y],
  [FINAL.x - 34, TOP_Y],
]

function smallCaps(x: number, y: number, text: string, fill: string = INK) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={fill}
      fontSize="11"
      fontWeight="700"
      letterSpacing="0.16em"
      fontFamily="Montserrat, sans-serif"
    >
      {text}
    </text>
  )
}

function subCaption(x: number, y: number, text: string) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={MUT}
      fontSize="13"
      fontStyle="italic"
      fontFamily='"Libre Baskerville", Georgia, serif'
    >
      {text}
    </text>
  )
}

/* head + shoulders person glyph */
function Person({ cx, cy, r, stroke, opacity = 1 }: { cx: number; cy: number; r: number; stroke: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy - r * 0.5} r={r * 0.4} fill="none" stroke={stroke} strokeWidth="1.6" />
      <path
        d={`M ${cx - r * 0.8} ${cy + r * 0.9} Q ${cx} ${cy - r * 0.1} ${cx + r * 0.8} ${cy + r * 0.9}`}
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  )
}

export default function FieldworkPartnershipDiagram() {
  const reduceMotion = Boolean(useReducedMotion())
  const [on, setOn] = useState(true)

  const draw = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.9, delay, ease: EASE },
        }
  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { scale: 0.82, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.6, delay, ease: EASE },
        }
  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 6 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.6, delay, ease: EASE },
        }

  /* a dot that streams a waypoint path continuously, phase-offset */
  const stream = (pts: Array<[number, number]>, start: number, fill: string, r = 3) =>
    reduceMotion ? null : (
      <motion.circle
        r={r}
        fill={fill}
        initial={{ cx: pts[0][0], cy: pts[0][1], opacity: 0 }}
        animate={{
          cx: pts.map((p) => p[0]),
          cy: pts.map((p) => p[1]),
          opacity: [0, 1, 1, 1, 0].slice(0, pts.length),
        }}
        transition={{ duration: FLOW, delay: 1.3 + start, repeat: Infinity, repeatDelay: 0, ease: 'linear' }}
      />
    )

  const risePath = `M ${RISE[0][0]} ${RISE[0][1]} C 300 300 ${PARTNER.x - 40} 268 ${PARTNER.x} 244 S 560 168 ${ARRIVE.x - 20} ${TOP_Y}`

  return (
    <div className="mt-14 hidden md:block">
      {/* toggle */}
      <motion.div className="mb-2 flex items-center justify-center gap-4" {...fade(0.2)}>
        <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-[#1e2a4a]">
          Fieldwork
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Toggle Fieldwork"
          onClick={() => setOn((v) => !v)}
          className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${on ? 'bg-[#1e2a4a]' : 'bg-[#1a1816]/20'}`}
        >
          <motion.span
            className="absolute top-1 h-5 w-5 rounded-full bg-[#fffcf7] shadow-[0_1px_3px_rgba(26,24,22,0.35)]"
            animate={{ left: on ? 34 : 4 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
          />
        </button>
        <span className="w-9 font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6e6355]">
          {on ? 'On' : 'Off'}
        </span>
      </motion.div>

      <svg
        viewBox="0 0 1180 415"
        className="w-full"
        role="img"
        aria-label="Your team starts at one capability level; beside a Karst partner, through protected build time, they rise to a higher one and produce working systems the district keeps"
      >
        {/* baseline + capable reference lines */}
        <motion.line x1="60" y1={BASE_Y} x2="300" y2={BASE_Y} stroke={INK} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 5" {...draw(0.1)} />
        <motion.line x1={ARRIVE.x - 40} y1={TOP_Y} x2={FINAL.x} y2={TOP_Y} stroke={INK} strokeOpacity="0.16" strokeWidth="1" {...draw(1.1)} />

        {/* ── the team, before ── */}
        <motion.g {...pop(0)}>
          <Person cx={TEAM.x - 22} cy={BASE_Y} r={13} stroke={INK} />
          <Person cx={TEAM.x + 6} cy={BASE_Y - 4} r={15} stroke={INK} />
          <Person cx={TEAM.x + 34} cy={BASE_Y} r={13} stroke={INK} />
        </motion.g>
        <motion.g {...fade(0.35)}>{smallCaps(TEAM.x + 6, BASE_Y + 44, 'YOUR TEAM')}</motion.g>

        {/* ── the rise (Fieldwork) ── */}
        <motion.path
          d={risePath}
          fill="none"
          stroke={TEAL}
          strokeOpacity={on ? 0.55 : 0.14}
          strokeWidth="1.4"
          style={{ transition: 'stroke-opacity 0.5s ease' }}
          {...draw(0.5)}
        />

        {/* streaming team members rising, only when Fieldwork is on */}
        {on && (
          <>
            {stream(RISE, 0, TEAL, 3.4)}
            {stream(RISE, FLOW * 0.33, TEAL, 3)}
            {stream(RISE, FLOW * 0.66, TEAL, 3)}
            {stream(RUN, 0.2, GOLD, 3.4)}
            {stream(RUN, FLOW * 0.5, GOLD, 3.4)}
          </>
        )}

        {/* the Karst partner, alongside the rise */}
        <motion.g
          animate={{ opacity: on ? 1 : 0.12 }}
          initial={false}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
        >
          <circle cx={PARTNER.x} cy={PARTNER.y} r="30" fill="#fffdf9" stroke={TEAL} strokeWidth="1.6" />
          <Person cx={PARTNER.x} cy={PARTNER.y + 2} r={15} stroke={TEAL} />
          {!reduceMotion && on && (
            <motion.circle
              cx={PARTNER.x}
              cy={PARTNER.y}
              r="30"
              fill="none"
              stroke={TEAL}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              style={{ transformOrigin: `${PARTNER.x}px ${PARTNER.y}px` }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.8, ease: 'easeOut', delay: 1.6 }}
            />
          )}
          <g>{smallCaps(PARTNER.x, PARTNER.y + 58, 'A KARST PARTNER', TEAL)}</g>
          <g>{subCaption(PARTNER.x, PARTNER.y + 80, 'protected build time, in the workday')}</g>
        </motion.g>

        {/* ── arrival: the same team, now capable ── */}
        <motion.g {...pop(1.15)}>
          <Person cx={ARRIVE.x - 12} cy={TOP_Y} r={13} stroke={INK} />
          <Person cx={ARRIVE.x + 16} cy={TOP_Y - 4} r={15} stroke={INK} />
          <Person cx={ARRIVE.x + 44} cy={TOP_Y} r={13} stroke={INK} />
        </motion.g>
        <motion.g {...fade(1.35)}>
          {smallCaps(ARRIVE.x + 16, TOP_Y - 30, 'BUILDING AGENTICALLY')}
        </motion.g>

        {/* run line to working systems */}
        <motion.line x1={ARRIVE.x + 60} y1={TOP_Y} x2={FINAL.x - 34} y2={TOP_Y} stroke={INK} strokeWidth="1.5" {...draw(1.3)} />

        {/* ── working systems ── */}
        <motion.g {...pop(1.5)}>
          <circle cx={FINAL.x} cy={TOP_Y} r="32" fill="none" stroke={INK} strokeWidth="1.6" />
          <path
            d={`M ${FINAL.x - 11} ${TOP_Y} l 8 8 l 14 -16`}
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
        <motion.g {...fade(1.7)}>
          {smallCaps(FINAL.x, TOP_Y + 62, 'WORKING SYSTEMS')}
          {subCaption(FINAL.x - 15, TOP_Y + 84, 'kept by the district')}
        </motion.g>
      </svg>
    </div>
  )
}
