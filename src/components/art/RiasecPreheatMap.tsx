/**
 * RiasecPreheatMap — ported VERBATIM from the Financial Literacy Studio's
 * Self-Knowledge Inventory (slide 2-3) so the studios-site preview matches
 * the real module exactly. Geometry, colors, wedges, rings, labels, legend
 * are unchanged; the only difference is data comes in as plain props
 * (energizers/drainers id arrays) instead of the useDeliverable hook —
 * nothing is read or saved on this public surface.
 */
import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

type RiasecDomain = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

/* Activity → RIASEC domain map (mirrors EnergyDrainPicker) */
const ACTIVITY_DOMAIN: Record<string, RiasecDomain> = {
  'dissect-a-problem': 'I',
  'build-with-hands': 'R',
  'lead-a-discussion': 'E',
  'open-ended-project': 'A',
  'follow-clear-steps': 'C',
  'help-someone-stuck': 'S',
  'research-deep-dive': 'I',
  'persuade-audience': 'E',
  'organize-data': 'C',
  'physical-outdoor': 'R',
  'make-something': 'A',
  'teach-explain': 'S',
  'rapid-iteration': 'I',
  'plan-logistics': 'C',
  'navigate-ambiguity': 'A',
}

const DOMAINS: { key: RiasecDomain; name: string }[] = [
  { key: 'I', name: 'Investigative' },
  { key: 'A', name: 'Artistic' },
  { key: 'S', name: 'Social' },
  { key: 'E', name: 'Enterprising' },
  { key: 'C', name: 'Conventional' },
  { key: 'R', name: 'Realistic' },
]

const VIEW_W = 480
const VIEW_H = 400
const CENTER_X = VIEW_W / 2
const CENTER_Y = VIEW_H / 2
const OUTER_MAX = 130
const INNER_MAX = 70

function vertex(i: number, radius: number) {
  const angle = (i * 60 - 90) * (Math.PI / 180)
  return { x: CENTER_X + radius * Math.cos(angle), y: CENTER_Y + radius * Math.sin(angle) }
}

export default function RiasecPreheatMap({
  energizers,
  drainers,
}: {
  energizers: string[]
  drainers: string[]
}) {
  const prefersReducedMotion = useReducedMotion()

  const counts = useMemo(() => {
    const energy: Record<RiasecDomain, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    const drain: Record<RiasecDomain, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    for (const id of energizers) {
      const d = ACTIVITY_DOMAIN[id]
      if (d) energy[d]++
    }
    for (const id of drainers) {
      const d = ACTIVITY_DOMAIN[id]
      if (d) drain[d]++
    }
    return { energy, drain }
  }, [energizers, drainers])

  const MAX = 3
  const totalSorted = energizers.length + drainers.length

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto overflow-visible"
        aria-label="Energy and drain across RIASEC domains"
      >
        {/* Background rings */}
        {[0.33, 0.66, 1.0].map((t, i) => (
          <polygon
            key={i}
            points={DOMAINS.map((_, idx) => {
              const v = vertex(idx, OUTER_MAX * t)
              return `${v.x},${v.y}`
            }).join(' ')}
            fill="none"
            stroke="rgb(110 99 85 / 0.18)"
            strokeWidth="1"
            strokeDasharray={i === 2 ? undefined : '2,4'}
          />
        ))}

        {/* Spokes */}
        {DOMAINS.map((_, i) => {
          const outer = vertex(i, OUTER_MAX)
          return (
            <line
              key={i}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgb(110 99 85 / 0.16)"
              strokeWidth="1"
            />
          )
        })}

        {/* Energizer wedges (outward, emerald) */}
        {DOMAINS.map(({ key }, i) => {
          const count = counts.energy[key]
          if (count === 0) return null
          const t = Math.min(count / MAX, 1)
          const next = (i + 1) % 6

          const v1 = vertex(i, OUTER_MAX * t)
          const v2 = vertex(next, OUTER_MAX * t)
          const c1 = vertex(i, 6)
          const c2 = vertex(next, 6)

          const path = `M ${c1.x} ${c1.y} L ${v1.x} ${v1.y} L ${v2.x} ${v2.y} L ${c2.x} ${c2.y} Z`

          return (
            <motion.path
              key={`e-${key}`}
              d={path}
              fill="rgb(27 106 89 / 0.32)"
              stroke="rgb(27 106 89 / 0.65)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: easeStandard }}
              style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
            />
          )
        })}

        {/* Drainer wedges (inward, amber) */}
        {DOMAINS.map(({ key }, i) => {
          const count = counts.drain[key]
          if (count === 0) return null
          const t = Math.min(count / MAX, 1)
          const r = INNER_MAX * t

          const v = vertex(i, r)

          return (
            <motion.circle
              key={`d-${key}`}
              cx={v.x}
              cy={v.y}
              r={4 + count}
              fill="rgb(165 71 49 / 0.25)"
              stroke="rgb(165 71 49 / 0.55)"
              strokeWidth="1.2"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.06, ease: easeStandard }}
            >
              <title>
                {count} drain{count === 1 ? '' : 's'}
              </title>
            </motion.circle>
          )
        })}

        {/* Outer dots + labels */}
        {DOMAINS.map(({ key, name }, i) => {
          const v = vertex(i, OUTER_MAX)
          const isTop = i === 0
          const isBottom = i === 3
          const labelRadius = OUTER_MAX + (isTop || isBottom ? 22 : 28)
          const label = vertex(i, labelRadius)
          const isLeft = i === 4 || i === 5
          const textAnchor = isTop || isBottom ? 'middle' : isLeft ? 'end' : 'start'
          return (
            <g key={key}>
              <circle cx={v.x} cy={v.y} r="3.5" fill="rgb(110 99 85 / 0.6)" />
              <text
                x={label.x}
                y={label.y}
                textAnchor={textAnchor}
                className="font-label tracking-[0.15em] uppercase font-semibold"
                style={{ fontSize: '12px', fill: 'rgb(58 54 50)' }}
              >
                {key}
              </text>
              <text
                x={label.x}
                y={label.y + 13}
                textAnchor={textAnchor}
                className="font-label tracking-[0.15em] uppercase"
                style={{ fontSize: '8.5px', fill: 'rgb(110 99 85)' }}
              >
                {name}
              </text>
            </g>
          )
        })}

        {/* Center marker */}
        <circle cx={CENTER_X} cy={CENTER_Y} r="3" fill="rgb(27 106 89 / 0.6)" />
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs font-label">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700/40 border border-emerald-700/60" />
          <span className="text-on-surface-variant tracking-wide">Energizers (outward)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700/30 border border-amber-700/55" />
          <span className="text-on-surface-variant tracking-wide">Drains (inner)</span>
        </span>
      </div>

      {totalSorted === 0 && (
        <p className="text-center mt-4 font-body italic text-sm text-on-surface-variant/60">
          Go back to the energy sort to fill in your map.
        </p>
      )}
    </div>
  )
}

/** Top 2 energizing domains, for the slide headline. */
export function topEnergyDomains(energizers: string[]): RiasecDomain[] {
  const counts: Record<RiasecDomain, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  for (const id of energizers) {
    const d = ACTIVITY_DOMAIN[id]
    if (d) counts[d]++
  }
  return (Object.entries(counts) as [RiasecDomain, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([d]) => d)
}

export const DOMAIN_FULL_NAME: Record<RiasecDomain, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}
