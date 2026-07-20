import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/* Each layer teaches on hover: the row lifts, its glyph animates, and a
   plain-language line with example artifacts expands beneath the title.
   Hover opens on desktop; tap toggles on touch. One layer open at a time. */

const LAYERS = [
  {
    number: '01',
    title: 'District context',
    detail: 'Priorities · language · local knowledge',
    long: 'Your strategic plan, board priorities, and the words your community actually uses. Loaded once, so every tool your team builds speaks like your district instead of like a vendor.',
    examples: ['Strategic plan', 'Board priorities', 'Community language'],
    mark: 'context',
  },
  {
    number: '02',
    title: 'Guardrails',
    detail: 'Data rules · review gates · boundaries',
    long: 'What data can go where, who reviews before anything ships, and the lines that never get crossed. Written before the first build, so speed never outruns judgment.',
    examples: ['Data classification', 'Review gates', 'Never-cross lines'],
    mark: 'guardrails',
  },
  {
    number: '03',
    title: 'Workflows',
    detail: 'Repeatable methods for consequential work',
    long: 'The repeatable methods behind consequential work: board-packet assembly, enrollment briefs, survey analysis. Written down plainly, so anyone can run them next month.',
    examples: ['Board packets', 'Enrollment briefs', 'Survey analysis'],
    mark: 'workflows',
  },
  {
    number: '04',
    title: 'Tools',
    detail: 'Agents · automations · working applications',
    long: 'The agents, automations, and working applications your teams build in Fieldwork, versioned and documented, with an owner named for each one.',
    examples: ['Agents', 'Automations', 'Staff-built apps'],
    mark: 'tools',
  },
  {
    number: '05',
    title: 'Ownership',
    detail: 'Files · knowledge · capability',
    long: 'Files, accounts, and know-how in district hands. If Karst stepped away tomorrow, everything here would still run on Monday.',
    examples: ['District accounts', 'Runbooks', 'Handoff record'],
    mark: 'ownership',
  },
] as const

/* Row glyphs, animated when their layer is active. Each has one idea:
   context gathers, guardrails hold the line, workflows travel, tools
   light up, ownership glints. */
function LayerParticles({ type, active, reduceMotion }: { type: (typeof LAYERS)[number]['mark']; active: boolean; reduceMotion: boolean }) {
  const animate = active && !reduceMotion

  if (type === 'context') {
    const points: Array<[number, number, number]> = [
      [8, 22, 1.5], [18, 12, 1], [27, 25, 1.2], [38, 8, 1.4],
      [48, 19, 1], [61, 10, 1.2], [72, 24, 1.5], [84, 15, 1],
    ]
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        {points.map(([cx, cy, r], index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={cy}
            r={r}
            fill={index === 4 ? '#2fa8a0' : 'rgba(26,24,22,0.42)'}
            animate={
              animate
                ? { x: (48 - cx) * 0.28, y: (19 - cy) * 0.28, opacity: 1 }
                : { x: 0, y: 0, opacity: index === 4 ? 1 : 0.75 }
            }
            transition={{ duration: 0.6, delay: animate ? index * 0.04 : 0, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
    )
  }

  if (type === 'guardrails') {
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        <motion.path
          d="M17 5v22M75 5v22"
          stroke="rgba(45,90,90,0.52)"
          strokeWidth="1"
          animate={animate ? { stroke: 'rgba(45,90,90,0.95)', strokeWidth: 1.4 } : { stroke: 'rgba(45,90,90,0.52)', strokeWidth: 1 }}
          transition={{ duration: 0.4 }}
        />
        {[28, 40, 52, 64].flatMap((cx, xi) =>
          [11, 21].map((cy, yi) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="1.35"
              fill="rgba(26,24,22,0.46)"
              animate={animate ? { y: 16 - cy, opacity: 0.9 } : { y: 0, opacity: 0.75 }}
              transition={{ duration: 0.5, delay: animate ? (xi * 2 + yi) * 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}
            />
          )),
        )}
        <motion.circle
          cx="52"
          cy="11"
          r="2.2"
          fill="#2fa8a0"
          animate={animate ? { y: 5, scale: 1.25 } : { y: 0, scale: 1 }}
          style={{ transformOrigin: '52px 11px' }}
          transition={{ duration: 0.5, delay: animate ? 0.2 : 0 }}
        />
      </svg>
    )
  }

  if (type === 'workflows') {
    const points: Array<[number, number]> = [[8, 22], [20, 18], [32, 20], [44, 11], [56, 14], [68, 9], [82, 13]]
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        <motion.path
          d="M8 22L20 18l12 2 12-9 12 3 12-5 14 4"
          fill="none"
          stroke="rgba(26,24,22,0.18)"
          strokeWidth="1"
          animate={animate ? { stroke: 'rgba(45,90,90,0.55)', pathLength: 1 } : { stroke: 'rgba(26,24,22,0.18)' }}
          initial={false}
          transition={{ duration: 0.5 }}
        />
        {points.map(([cx, cy], index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={cy}
            r={index === 3 ? 2.3 : 1.45}
            fill={index === 3 ? '#2fa8a0' : 'rgba(26,24,22,0.48)'}
            animate={animate ? { scale: [1, 1.5, 1], opacity: 1 } : { scale: 1, opacity: 0.8 }}
            transition={
              animate
                ? { duration: 0.45, delay: index * 0.07, ease: 'easeOut' }
                : { duration: 0.3 }
            }
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>
    )
  }

  if (type === 'tools') {
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        {[10, 20, 30].flatMap((cx, xi) =>
          [9, 16, 23].map((cy, yi) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="1.3"
              fill="rgba(26,24,22,0.4)"
              animate={animate ? { opacity: [0.4, 1, 0.55] } : { opacity: 0.7 }}
              transition={animate ? { duration: 0.6, delay: (xi + yi) * 0.06 } : { duration: 0.3 }}
            />
          )),
        )}
        <motion.path
          d="M39 16h13"
          stroke="rgba(26,24,22,0.2)"
          animate={animate ? { stroke: 'rgba(45,90,90,0.7)' } : { stroke: 'rgba(26,24,22,0.2)' }}
          transition={{ duration: 0.4, delay: animate ? 0.15 : 0 }}
        />
        <motion.rect
          x="57" y="7" width="10" height="18" rx="1" fill="none"
          stroke="rgba(26,24,22,0.36)"
          animate={animate ? { stroke: 'rgba(26,24,22,0.65)' } : { stroke: 'rgba(26,24,22,0.36)' }}
          transition={{ duration: 0.4 }}
        />
        <motion.rect
          x="72" y="10" width="11" height="15" rx="1" fill="none"
          stroke="rgba(45,90,90,0.58)"
          animate={animate ? { stroke: 'rgba(45,90,90,1)', strokeWidth: 1.4 } : { stroke: 'rgba(45,90,90,0.58)', strokeWidth: 1 }}
          transition={{ duration: 0.4, delay: animate ? 0.25 : 0 }}
        />
        <motion.circle
          cx="77.5" cy="17.5" r="2" fill="#2fa8a0"
          animate={animate ? { scale: [1, 1.6, 1.2] } : { scale: 1 }}
          transition={{ duration: 0.55, delay: animate ? 0.3 : 0 }}
          style={{ transformOrigin: '77.5px 17.5px' }}
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
      <motion.path
        d="M46 3l28 9v11l-28 7-28-7V12l28-9Z"
        fill="none"
        stroke="rgba(26,24,22,0.24)"
        animate={animate ? { stroke: 'rgba(26,24,22,0.6)' } : { stroke: 'rgba(26,24,22,0.24)' }}
        transition={{ duration: 0.45 }}
      />
      <motion.path
        d="M18 12l28 8 28-8M46 20v10"
        fill="none"
        stroke="rgba(45,90,90,0.38)"
        animate={animate ? { stroke: 'rgba(45,90,90,0.9)' } : { stroke: 'rgba(45,90,90,0.38)' }}
        transition={{ duration: 0.45, delay: animate ? 0.1 : 0 }}
      />
      {([[31, 13], [40, 15.5], [52, 14.5], [60, 12.5], [46, 20]] as Array<[number, number]>).map(([cx, cy], index) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={index === 4 ? 2.5 : 1.3}
          fill={index === 4 ? '#2fa8a0' : 'rgba(26,24,22,0.5)'}
          animate={animate ? { scale: [1, 1.45, 1], opacity: 1 } : { scale: 1, opacity: 0.85 }}
          transition={animate ? { duration: 0.5, delay: 0.12 + index * 0.06 } : { duration: 0.3 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  )
}

/* ── Expanded-layer scenes — an opened layer plays its mechanism in the
   briefing grammar: strokes draw in, elements pop staggered, then a quiet
   loop keeps it alive. Koi palette. ── */
const SC_BRIGHT = '#2fa8a0'
const SC_PERI = '#5a6aaa'
const SC_INK = 'rgba(26,24,22,0.4)'
const SC_EASE = [0.22, 1, 0.36, 1] as const

function LayerScene({ type, reduceMotion }: { type: (typeof LAYERS)[number]['mark']; reduceMotion: boolean }) {
  const draw = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.7, delay, ease: SC_EASE },
        }
  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.45, delay, ease: SC_EASE },
        }

  if (type === 'context') {
    /* scattered sources converge into one loaded center */
    const pts: Array<[number, number]> = [
      [24, 22], [62, 12], [104, 26], [150, 10], [196, 22],
      [38, 100], [96, 106], [168, 100],
    ]
    return (
      <svg viewBox="0 0 220 120" className="h-[104px] w-[196px]" aria-hidden="true">
        {pts.map(([x, y], i) => (
          <motion.line
            key={`l-${i}`}
            x1={x} y1={y} x2={110} y2={60}
            stroke={SC_PERI} strokeOpacity="0.35" strokeWidth="1"
            {...draw(0.2 + i * 0.06)}
          />
        ))}
        {pts.map(([x, y], i) => (
          <motion.circle key={`d-${i}`} cx={x} cy={y} r="2.2" fill={SC_INK} {...pop(i * 0.05)} style={{ transformOrigin: `${x}px ${y}px` }} />
        ))}
        <motion.circle cx="110" cy="60" r="4.5" fill={SC_BRIGHT} {...pop(0.75)} style={{ transformOrigin: '110px 60px' }} />
        {!reduceMotion && (
          <motion.circle
            cx="110" cy="60" r="4.5" fill="none" stroke={SC_BRIGHT} strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            style={{ transformOrigin: '110px 60px' }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeOut', delay: 1.2 }}
          />
        )}
      </svg>
    )
  }

  if (type === 'guardrails') {
    /* the rails draw; work streams safely between them */
    return (
      <svg viewBox="0 0 220 120" className="h-[104px] w-[196px]" aria-hidden="true">
        <motion.path d="M70 14v92" fill="none" stroke={SC_PERI} strokeOpacity="0.55" strokeWidth="1.4" {...draw(0.1)} />
        <motion.path d="M150 14v92" fill="none" stroke={SC_PERI} strokeOpacity="0.55" strokeWidth="1.4" {...draw(0.25)} />
        <motion.path d="M58 14h24M138 14h24M58 106h24M138 106h24" fill="none" stroke={SC_INK} strokeWidth="1" {...draw(0.45)} />
        {[92, 110, 128].map((x, i) =>
          reduceMotion ? (
            <circle key={x} cx={x} cy={60} r={i === 1 ? 3 : 2.2} fill={i === 1 ? SC_BRIGHT : SC_INK} />
          ) : (
            <motion.circle
              key={x}
              cx={x}
              r={i === 1 ? 3 : 2.2}
              fill={i === 1 ? SC_BRIGHT : SC_INK}
              initial={{ cy: 8, opacity: 0 }}
              animate={{ cy: [8, 112], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.6,
                times: [0, 0.15, 0.85, 1],
                delay: 0.8 + i * 0.7,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: 'linear',
              }}
            />
          ),
        )}
      </svg>
    )
  }

  if (type === 'workflows') {
    /* the method draws once; the work travels it forever */
    const wpts: Array<[number, number]> = [[16, 88], [64, 64], [112, 76], [160, 36], [204, 46]]
    return (
      <svg viewBox="0 0 220 120" className="h-[104px] w-[196px]" aria-hidden="true">
        <motion.path
          d="M16 88L64 64l48 12 48-40 44 10"
          fill="none" stroke={SC_PERI} strokeOpacity="0.5" strokeWidth="1.2"
          {...draw(0.1)}
        />
        {wpts.map(([x, y], i) => (
          <motion.circle
            key={x}
            cx={x} cy={y} r={i === 3 ? 3.4 : 2.4}
            fill={i === 3 ? SC_BRIGHT : '#fffdf9'}
            stroke={i === 3 ? SC_BRIGHT : SC_INK}
            strokeWidth="1.2"
            {...pop(0.4 + i * 0.09)}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
        {!reduceMotion && (
          <motion.circle
            r="2.8"
            fill={SC_BRIGHT}
            initial={{ cx: 16, cy: 88, opacity: 0 }}
            animate={{
              cx: wpts.map(([x]) => x),
              cy: wpts.map(([, y]) => y),
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{ duration: 3, delay: 1.1, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' }}
          />
        )}
      </svg>
    )
  }

  if (type === 'tools') {
    /* parts light in sequence and become working applications */
    return (
      <svg viewBox="0 0 220 120" className="h-[104px] w-[196px]" aria-hidden="true">
        {[26, 46, 66].flatMap((x, xi) =>
          [34, 60, 86].map((y, yi) => (
            <motion.circle
              key={`${x}-${y}`}
              cx={x} cy={y} r="2.4" fill={SC_INK}
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: [0.35, 1, 0.45] },
                    transition: { duration: 2.4, delay: (xi + yi) * 0.18, repeat: Infinity, repeatDelay: 0.8 },
                  })}
            />
          )),
        )}
        <motion.path d="M84 60h34m-6-5 6 5-6 5" fill="none" stroke={SC_PERI} strokeOpacity="0.7" strokeWidth="1.2" {...draw(0.5)} />
        <motion.rect x="132" y="30" width="30" height="60" rx="2" fill="#fffdf9" stroke={SC_INK} strokeWidth="1.2" {...pop(0.8)} style={{ transformOrigin: '147px 60px' }} />
        <motion.rect x="172" y="42" width="34" height="48" rx="2" fill="#fffdf9" stroke={SC_BRIGHT} strokeWidth="1.3" {...pop(0.95)} style={{ transformOrigin: '189px 66px' }} />
        <motion.circle cx="189" cy="66" r="3" fill={SC_BRIGHT} {...pop(1.15)} style={{ transformOrigin: '189px 66px' }} />
        {!reduceMotion && (
          <motion.circle
            cx="189" cy="66" r="3" fill="none" stroke={SC_BRIGHT} strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
            style={{ transformOrigin: '189px 66px' }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut', delay: 1.5 }}
          />
        )}
      </svg>
    )
  }

  /* ownership — everything settles into the district's vessel */
  return (
    <svg viewBox="0 0 220 120" className="h-[104px] w-[196px]" aria-hidden="true">
      <motion.path
        d="M110 34l64 18v22l-64 16-64-16V52l64-18Z"
        fill="none" stroke={SC_INK} strokeWidth="1.2"
        {...draw(0.1)}
      />
      <motion.path d="M46 52l64 16 64-16M110 68v22" fill="none" stroke={SC_PERI} strokeOpacity="0.6" strokeWidth="1" {...draw(0.4)} />
      {([[84, 58], [102, 62], [122, 61], [138, 57]] as Array<[number, number]>).map(([x, y], i) =>
        reduceMotion ? (
          <circle key={x} cx={x} cy={y} r="2.2" fill={SC_INK} />
        ) : (
          <motion.circle
            key={x}
            cx={x} r="2.2" fill={SC_INK}
            initial={{ cy: 10, opacity: 0 }}
            animate={{ cy: y, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 + i * 0.14, ease: SC_EASE }}
          />
        ),
      )}
      <motion.circle cx="110" cy="78" r="3" fill={SC_BRIGHT} {...pop(1.2)} style={{ transformOrigin: '110px 78px' }} />
      {!reduceMotion && (
        <motion.circle
          cx="110" cy="78" r="3" fill="none" stroke={SC_BRIGHT} strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          style={{ transformOrigin: '110px 78px' }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeOut', delay: 1.6 }}
        />
      )}
    </svg>
  )
}

export default function OperatingKitDiagram() {
  const reduceMotion = Boolean(useReducedMotion())
  const [active, setActive] = useState<number | null>(null)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-90px' }}
      className="relative overflow-hidden rounded-[3px] border border-[#1a1816]/12 bg-[#fffdf9] shadow-[0_24px_70px_-30px_rgba(26,24,22,0.35)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_8%,rgba(45,90,90,0.06),transparent_31%)]"
      />

      <div className="relative flex items-center justify-between border-b border-[#1a1816]/10 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.6 },
              visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.6 } },
            }}
            className="h-2 w-2 rounded-full bg-[#2fa8a0] shadow-[0_0_14px_rgba(47,168,160,0.5)]"
          />
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#6e6355]">
            District AI Operating Kit
          </span>
        </div>
        <span className="hidden font-label text-[8px] uppercase tracking-[0.26em] text-[#6e6355]/70 sm:block">
          District-owned
        </span>
      </div>

      <div className="relative p-5 md:p-7">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4 px-1">
          <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#2d5a5a]">
            Assembled through Fieldwork
          </p>
          <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#6e6355]/60">
            Hover a layer · 01—05
          </p>
        </div>

        <div className="relative">
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { scaleY: reduceMotion ? 1 : 0 },
              visible: {
                scaleY: 1,
                transition: { duration: reduceMotion ? 0 : 1.25, delay: reduceMotion ? 0 : 0.18 },
              },
            }}
            className="absolute bottom-5 left-[26px] top-5 z-10 w-px origin-top bg-gradient-to-b from-[#5a6aaa]/70 via-[#5a6aaa]/30 to-[#5a6aaa]/5 md:left-[32px]"
          />

          <ol className="relative space-y-2" onMouseLeave={() => setActive(null)}>
            {LAYERS.map((layer, index) => {
              const isActive = active === index
              return (
                <motion.li
                  key={layer.number}
                  custom={index}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: reduceMotion ? 0 : index % 2 === 0 ? 26 : -26,
                      y: reduceMotion ? 0 : 10,
                    },
                    visible: (order: number) => ({
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        duration: reduceMotion ? 0 : 0.78,
                        delay: reduceMotion ? 0 : 0.12 + order * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }),
                  }}
                  onMouseEnter={() => setActive(index)}
                  className={`relative overflow-hidden rounded-[2px] border transition-colors duration-300 ${
                    isActive
                      ? 'border-[#2d5a5a]/45 bg-[#2fa8a0]/[0.04]'
                      : 'border-[#1a1816]/10 bg-white'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-[3px] transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-70'
                    } bg-gradient-to-b from-[#2fa8a0]/15 via-[#2fa8a0]/70 to-[#2fa8a0]/15`}
                  />
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => setActive(isActive ? null : index)}
                    className="grid min-h-[76px] w-full grid-cols-[36px_1fr] items-center gap-4 px-3 py-3.5 text-left md:min-h-[84px] md:grid-cols-[44px_1fr_auto] md:px-4"
                  >
                    <span
                      className={`relative z-20 flex h-7 w-7 items-center justify-center rounded-full border bg-[#fffdf9] font-label text-[8px] tracking-[0.1em] transition-all duration-300 md:h-8 md:w-8 ${
                        isActive
                          ? 'border-[#2d5a5a] text-[#2d5a5a] shadow-[0_0_14px_rgba(45,90,90,0.3)]'
                          : 'border-[#2d5a5a]/50 text-[#2d5a5a]/85'
                      }`}
                    >
                      {layer.number}
                    </span>
                    <span>
                      <span
                        className={`block font-headline text-[15px] font-medium transition-colors duration-300 md:text-[16px] ${
                          isActive ? 'text-[#1a1816]' : 'text-[#1a1816]/88'
                        }`}
                      >
                        {layer.title}
                      </span>
                      <span className="mt-1 block font-body text-[11px] leading-relaxed text-[#6e6355] md:text-[12px]">
                        {layer.detail}
                      </span>
                    </span>
                    <span aria-hidden="true" className="hidden text-[#6e6355]/70 md:block">
                      <LayerParticles type={layer.mark} active={isActive} reduceMotion={reduceMotion} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={reduceMotion ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-3 px-3 pb-4 pl-[52px] pr-4 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:pl-[60px] md:pr-6">
                          <div className="grid gap-3">
                            <p className="max-w-[52ch] font-body text-[12px] leading-[1.7] text-[#6e6355] md:text-[12.5px]">
                              {layer.long}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {layer.examples.map((example, ei) => (
                                <motion.span
                                  key={example}
                                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.15 + ei * 0.07 }}
                                  className="rounded-[2px] border border-[#2d5a5a]/30 bg-[#2d5a5a]/[0.06] px-2.5 py-1 font-label text-[8px] uppercase tracking-[0.14em] text-[#2d5a5a]"
                                >
                                  {example}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                          <div className="hidden md:block" aria-hidden="true">
                            <LayerScene type={layer.mark} reduceMotion={reduceMotion} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.88 },
          },
        }}
        className="relative grid gap-3 border-t border-[#1a1816]/10 bg-[#1a1816]/[0.03] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center md:px-7"
      >
        <p className="font-editorial text-[15px] italic text-[#2d5a5a]">
          One operating layer. Ready to keep evolving.
        </p>
        <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#6e6355]/70">
          Maintained by Karst
        </p>
      </motion.div>
    </motion.div>
  )
}
