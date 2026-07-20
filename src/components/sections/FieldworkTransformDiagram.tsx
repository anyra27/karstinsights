import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* The Fieldwork transformation at briefing scale — the run-diagram grammar
   from the Fable 5 briefing, with its toggle move: FIELDWORK off shows the
   before-world (one prompt at a time, the run a ghost); FIELDWORK on brings
   the full parallel run to life. Dots travel the run in waves. */

const INK = '#1e2a4a'
const TEAL = '#2d5a5a'
const BRONZE = '#74614a'
const GOLD = '#a8802a'
const MUT = '#6e6355'

const EASE = [0.22, 1, 0.36, 1] as const

/* Geometry */
const LEADER = { x: 90, y: 195 }
const DIRECT = { x: 340, y: 195 }
const FAN_X = 660
const FAN_YS = [63, 129, 195, 261, 327]
const CONVERGE = { x: 910, y: 195 }
const FINAL = { x: 1095, y: 195 }

/* One full wave of work through the run, in seconds */
const PERIOD = 7

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

export default function FieldworkTransformDiagram() {
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

  /* A dot that travels a straight edge once per PERIOD */
  const travel = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    start: number,
    duration: number,
    fill: string,
    r = 3.5,
  ) =>
    reduceMotion ? null : (
      <motion.circle
        r={r}
        fill={fill}
        initial={{ cx: from.x, cy: from.y, opacity: 0 }}
        animate={{
          cx: [from.x, to.x],
          cy: [from.y, to.y],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration,
          times: [0, 0.15, 0.85, 1],
          delay: 1.8 + start,
          repeat: Infinity,
          repeatDelay: PERIOD - duration,
          ease: 'easeInOut',
        }}
      />
    )

  return (
    <div className="mt-14 hidden md:block">
      {/* ══ The toggle — the briefing's move ══ */}
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
          className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${
            on ? 'bg-[#1e2a4a]' : 'bg-[#1a1816]/20'
          }`}
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
        aria-label="With Fieldwork off, a leader works one prompt at a time. With Fieldwork on, the leader directs a parallel run: researches, analyzes, drafts, builds, documents, converged by their judgment into working systems the district keeps"
      >
        {/* Shared edge: leader into the work */}
        <motion.path
          d={`M ${LEADER.x + 34} ${LEADER.y} L ${DIRECT.x - 42} ${DIRECT.y}`}
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          {...draw(0.15)}
        />

        {/* ══ The leader — constant across both worlds ══ */}
        <motion.g {...pop(0)}>
          <circle cx={LEADER.x} cy={LEADER.y} r="32" fill="none" stroke={INK} strokeWidth="1.6" />
          <circle cx={LEADER.x} cy={LEADER.y - 7} r="5.5" fill="none" stroke={INK} strokeWidth="1.6" />
          <path
            d={`M ${LEADER.x - 11} ${LEADER.y + 12} Q ${LEADER.x} ${LEADER.y - 1} ${LEADER.x + 11} ${LEADER.y + 12}`}
            fill="none"
            stroke={INK}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.g>
        <motion.g {...fade(0.4)}>
          {smallCaps(LEADER.x, LEADER.y + 62, 'THE LEADER')}
        </motion.g>

        {/* ══ BEFORE world — one prompt at a time ══ */}
        <motion.g
          animate={{ opacity: on ? 0 : 1 }}
          initial={false}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
          style={{ pointerEvents: 'none' }}
        >
          <circle cx={DIRECT.x} cy={DIRECT.y} r="28" fill="#fffdf9" stroke={INK} strokeWidth="1.5" />
          <line x1={DIRECT.x - 10} y1={DIRECT.y - 6} x2={DIRECT.x + 10} y2={DIRECT.y - 6} stroke={INK} strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={DIRECT.x - 10} y1={DIRECT.y} x2={DIRECT.x + 6} y2={DIRECT.y} stroke={INK} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={DIRECT.x - 10} y1={DIRECT.y + 6} x2={DIRECT.x + 2} y2={DIRECT.y + 6} stroke={INK} strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
          {smallCaps(DIRECT.x, DIRECT.y + 62, 'ONE PROMPT AT A TIME')}
          {!reduceMotion && !on && (
            <motion.circle
              cy={LEADER.y}
              r="3"
              fill={INK}
              initial={{ cx: LEADER.x + 38 }}
              animate={{ cx: [LEADER.x + 38, DIRECT.x - 34, LEADER.x + 38] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.g>

        {/* ══ AFTER world — the full run ══ */}
        <motion.g
          animate={{ opacity: on ? 1 : 0.07 }}
          initial={false}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
        >
          {/* Edges */}
          {FAN_YS.map((fy, i) => (
            <motion.path
              key={`out-${fy}`}
              d={`M ${DIRECT.x + 40} ${DIRECT.y} L ${FAN_X - 28} ${fy}`}
              fill="none"
              stroke={TEAL}
              strokeOpacity="0.55"
              strokeWidth="1.2"
              {...draw(0.55 + i * 0.07)}
            />
          ))}
          {FAN_YS.map((fy, i) => (
            <motion.path
              key={`in-${fy}`}
              d={`M ${FAN_X + 28} ${fy} L ${CONVERGE.x - 40} ${CONVERGE.y}`}
              fill="none"
              stroke={BRONZE}
              strokeOpacity="0.5"
              strokeWidth="1.2"
              {...draw(0.85 + i * 0.07)}
            />
          ))}
          <motion.path
            d={`M ${CONVERGE.x + 40} ${CONVERGE.y} L ${FINAL.x - 34} ${FINAL.y}`}
            fill="none"
            stroke={INK}
            strokeWidth="1.5"
            {...draw(1.2)}
          />

          {/* Traveling work — one wave per period, only while the run is on */}
          {on && (
            <>
              {travel({ x: LEADER.x + 34, y: LEADER.y }, { x: DIRECT.x - 42, y: DIRECT.y }, 0, 1.1, INK)}
              {FAN_YS.map((fy, i) =>
                travel({ x: DIRECT.x + 40, y: DIRECT.y }, { x: FAN_X - 28, y: fy }, 1.3 + i * 0.14, 1.1, TEAL, 3),
              )}
              {FAN_YS.map((fy, i) =>
                travel({ x: FAN_X + 28, y: fy }, { x: CONVERGE.x - 40, y: CONVERGE.y }, 3.1 + i * 0.14, 1.1, BRONZE, 3),
              )}
              {travel({ x: CONVERGE.x + 40, y: CONVERGE.y }, { x: FINAL.x - 34, y: FINAL.y }, 4.9, 1, GOLD)}
            </>
          )}

          {/* Directs the work */}
          <motion.g {...pop(0.45)}>
            <circle cx={DIRECT.x} cy={DIRECT.y} r="46" fill="rgba(168,128,42,0.05)" stroke="none" />
            <circle cx={DIRECT.x} cy={DIRECT.y} r="38" fill="#fffdf9" stroke={INK} strokeWidth="1.6" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4
              return (
                <line
                  key={i}
                  x1={DIRECT.x + Math.cos(a) * 8}
                  y1={DIRECT.y + Math.sin(a) * 8}
                  x2={DIRECT.x + Math.cos(a) * 16}
                  y2={DIRECT.y + Math.sin(a) * 16}
                  stroke={INK}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )
            })}
            <circle cx={DIRECT.x} cy={DIRECT.y} r="3" fill={INK} />
          </motion.g>
          {!reduceMotion && on && (
            <motion.circle
              cx={DIRECT.x}
              cy={DIRECT.y}
              r="38"
              fill="none"
              stroke={GOLD}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
              style={{ transformOrigin: `${DIRECT.x}px ${DIRECT.y}px` }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: 'easeOut', delay: 2 }}
            />
          )}
          <motion.g {...fade(0.7)}>
            {smallCaps(DIRECT.x, DIRECT.y + 70, 'DIRECTS THE WORK')}
            {subCaption(DIRECT.x, DIRECT.y + 92, 'working agentically')}
          </motion.g>

          {/* The parallel run */}
          {FAN_YS.map((fy, i) => (
            <g key={`agent-${fy}`}>
              <motion.g {...pop(0.75 + i * 0.08)}>
                <circle cx={FAN_X} cy={fy} r="24" fill="#fffdf9" stroke={TEAL} strokeWidth="1.4" />
                <line x1={FAN_X} y1={fy - 9} x2={FAN_X} y2={fy - 5} stroke={TEAL} strokeWidth="1.3" strokeLinecap="round" />
                <line x1={FAN_X} y1={fy + 5} x2={FAN_X} y2={fy + 9} stroke={TEAL} strokeWidth="1.3" strokeLinecap="round" />
                <line x1={FAN_X - 9} y1={fy} x2={FAN_X - 5} y2={fy} stroke={TEAL} strokeWidth="1.3" strokeLinecap="round" />
                <line x1={FAN_X + 5} y1={fy} x2={FAN_X + 9} y2={fy} stroke={TEAL} strokeWidth="1.3" strokeLinecap="round" />
              </motion.g>
              {reduceMotion || !on ? (
                <circle cx={FAN_X} cy={fy} r="2.6" fill={TEAL} />
              ) : (
                <motion.circle
                  cx={FAN_X}
                  cy={fy}
                  r="2.6"
                  fill={TEAL}
                  animate={{ scale: [1, 1.7, 1], opacity: [0.7, 1, 0.7] }}
                  style={{ transformOrigin: `${FAN_X}px ${fy}px` }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 2.6 + i * 0.4, ease: 'easeInOut' }}
                />
              )}
            </g>
          ))}
          <motion.g {...fade(1.3)}>
            {smallCaps(FAN_X, 393, 'RESEARCHES · ANALYZES · DRAFTS · BUILDS · DOCUMENTS', TEAL)}
          </motion.g>

          {/* Their judgment */}
          <motion.g {...pop(1.15)}>
            <circle cx={CONVERGE.x} cy={CONVERGE.y} r="38" fill="#fffdf9" stroke={BRONZE} strokeWidth="1.6" />
            <path
              d={`M ${CONVERGE.x - 15} ${CONVERGE.y - 9} h 13 m -4.5 -4.5 l 4.5 4.5 l -4.5 4.5`}
              fill="none"
              stroke={BRONZE}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${CONVERGE.x + 15} ${CONVERGE.y + 11} h -13 m 4.5 -4.5 l -4.5 4.5 l 4.5 4.5`}
              fill="none"
              stroke={BRONZE}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${CONVERGE.x - 3} ${CONVERGE.y + 1} l 3.5 3.5 l 7 -8`}
              fill="none"
              stroke={BRONZE}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
          <motion.g {...fade(1.5)}>
            {smallCaps(CONVERGE.x, CONVERGE.y + 70, 'THEIR JUDGMENT', BRONZE)}
            {subCaption(CONVERGE.x, CONVERGE.y + 92, 'review, redirect, approve')}
          </motion.g>

          {/* Working systems */}
          <motion.g {...pop(1.4)}>
            <circle cx={FINAL.x} cy={FINAL.y} r="32" fill="none" stroke={INK} strokeWidth="1.6" />
            <path
              d={`M ${FINAL.x - 11} ${FINAL.y} l 8 8 l 14 -16`}
              fill="none"
              stroke={INK}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
          <motion.g {...fade(1.7)}>
            {smallCaps(FINAL.x, FINAL.y + 62, 'WORKING SYSTEMS')}
            {subCaption(FINAL.x - 15, FINAL.y + 84, 'kept by the district')}
          </motion.g>
        </motion.g>
      </svg>
    </div>
  )
}
