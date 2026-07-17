import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

/* ── The three build artifacts for the What Your Team Builds chapter.
   Framed in the site's exemplar language (browser chrome, brass corner
   ticks, deep shadow) and animated to explain, never to wobble.
   All content is synthetic demonstration data; the section caption
   states so on-screen. ── */

const BRASS = '#a8802a'
const NAVY = '#1e2a4a'

/* ════════ Shared frame — the exemplar chrome ════════ */

function ArtifactFrame({
  url,
  chromeRight,
  children,
}: {
  url: string
  chromeRight?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[4px] border border-[#fffcf7]/14 bg-[#0e0e0c]"
      style={{
        boxShadow: '0 42px 120px -32px rgba(0,0,0,0.88), 0 0 0 1px rgba(196,154,67,0.05)',
      }}
    >
      <span
        className="pointer-events-none absolute left-0 top-0 z-10 h-8 w-8 border-l border-t border-[#c49a43]/45"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute right-0 top-0 z-10 h-8 w-8 border-r border-t border-[#c49a43]/45"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3 border-b border-[#fffcf7]/10 bg-[#151411] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-2 w-2 rounded-full bg-[#c49a43]/80" />
          <div className="h-2 w-2 rounded-full bg-[#fffcf7]/24" />
          <div className="h-2 w-2 rounded-full bg-[#fffcf7]/12" />
        </div>
        <div className="ml-2 truncate font-mono text-[10px] text-[#fffcf7]/34 md:text-[11px]">{url}</div>
        {chromeRight && (
          <div className="ml-auto hidden shrink-0 font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fffcf7]/38 sm:block">
            {chromeRight}
          </div>
        )}
      </div>
      <div className="bg-[#fffcf7] text-[#1a1816]">{children}</div>
    </div>
  )
}

/* ════════ 01 · Dashboard — a working surface, ported from the
   Fieldwork exemplar: views and periods actually swap the read ════════ */

type ViewKey = 'overview' | 'attendance' | 'facilities'
type PeriodKey = 'year' | 'q90' | 'd30'
type Trend = 'up' | 'down' | 'flat'
type Status = 'good' | 'watch' | 'ready'

interface DashView {
  nav: string
  title: string
  kpis: Array<[string, string, string]>
  barsLabel: string
  bars: Array<[string, number, string]>
  rows: Array<[string, string, Trend, Status, string]>
  read: string
}

const DASH: Record<ViewKey, DashView> = {
  overview: {
    nav: 'Overview',
    title: 'Where the district stands',
    kpis: [
      ['Students on track', '81%', '+4.2 this year'],
      ['Daily attendance', '92.8%', 'Early signal'],
      ['Open facilities requests', '37', 'Down 12 this month'],
      ['Board items ready', '04', 'Study session Thu'],
    ],
    barsLabel: 'Requests by category',
    bars: [
      ['HVAC', 74, '34'],
      ['Grounds', 48, '22'],
      ['Electrical', 39, '18'],
      ['Plumbing', 30, '14'],
      ['Other', 26, '12'],
    ],
    rows: [
      ['Sierra Vista Middle', 'Attendance recovering', 'up', 'good', 'Steady'],
      ['Creekside Elementary', 'Chronic absence, gr. 2', 'down', 'watch', 'Watch'],
      ['North High', 'Work orders cleared', 'up', 'good', 'Steady'],
      ['District office', 'Enrollment brief drafted', 'flat', 'ready', 'Ready'],
    ],
    read:
      'attendance recovered at both middle schools, the facilities backlog is down for a third straight month, and four items are board-ready.',
  },
  attendance: {
    nav: 'Attendance',
    title: 'Attendance, read plainly',
    kpis: [
      ['Daily attendance', '92.8%', '+1.1 since fall'],
      ['Chronic absence', '11.4%', 'Down 2.3 this year'],
      ['Sites above 93%', '9 of 14', 'Up from 6'],
      ['Students reconnected', '212', 'Since October'],
    ],
    barsLabel: 'Chronic absence by grade band',
    bars: [
      ['TK-2', 62, '14%'],
      ['3-5', 44, '10%'],
      ['6-8', 52, '12%'],
      ['9-12', 40, '9%'],
    ],
    rows: [
      ['Sierra Vista Middle', 'Recovery holding 8 weeks', 'up', 'good', 'Steady'],
      ['Creekside Elementary', 'Gr. 2 cohort flagged', 'down', 'watch', 'Watch'],
      ['Delta Vista Middle', 'Outreach cycle working', 'up', 'good', 'Steady'],
      ['North High', 'Seniors drift after lunch', 'flat', 'watch', 'Watch'],
    ],
    read:
      'the recovery is real at the middle schools; the remaining concentration is one second-grade cohort and senior afternoons.',
  },
  facilities: {
    nav: 'Facilities',
    title: 'Facilities, this week',
    kpis: [
      ['Open requests', '37', 'Down 12 this month'],
      ['Median time to close', '3.2d', 'Was 9 days'],
      ['Aging past 30 days', '05', 'All parts-blocked'],
      ['Sites fully clear', '6', 'Of 14'],
    ],
    barsLabel: 'Open requests by category',
    bars: [
      ['HVAC', 74, '14'],
      ['Electrical', 46, '9'],
      ['Grounds', 38, '7'],
      ['Plumbing', 24, '4'],
      ['Other', 18, '3'],
    ],
    rows: [
      ['North High', 'Backlog cleared', 'up', 'good', 'Steady'],
      ['Sierra Vista Middle', '2 HVAC parts on order', 'flat', 'watch', 'Watch'],
      ['Creekside Elementary', 'Playground resurface set', 'up', 'ready', 'Ready'],
      ['Transportation yard', 'Lift inspection due', 'flat', 'watch', 'Watch'],
    ],
    read: 'close time fell from nine days to three; everything aging past thirty days is parts-blocked, not process-blocked.',
  },
}

const PERIODS: Record<PeriodKey, { chip: string; label: string; a: string; b: string; ticks: Array<[string, number]> }> = {
  year: {
    chip: 'This year',
    label: 'Momentum across the year',
    a: 'M8 118 C 60 112, 100 104, 150 96 S 250 76, 310 60 S 390 36, 412 30',
    b: 'M8 124 C 60 120, 100 116, 150 110 S 250 98, 310 88 S 390 70, 412 64',
    ticks: [
      ['AUG', 8],
      ['OCT', 108],
      ['JAN', 208],
      ['MAR', 308],
      ['MAY', 396],
    ],
  },
  q90: {
    chip: '90 days',
    label: 'Momentum · last 90 days',
    a: 'M8 96 C 70 92, 130 88, 200 76 S 340 52, 412 40',
    b: 'M8 108 C 70 106, 130 102, 200 96 S 340 80, 412 72',
    ticks: [
      ['FEB', 8],
      ['MAR', 145],
      ['APR', 282],
      ['MAY', 396],
    ],
  },
  d30: {
    chip: '30 days',
    label: 'Momentum · last 30 days',
    a: 'M8 78 C 60 80, 120 72, 190 68 S 330 54, 412 50',
    b: 'M8 92 C 60 94, 120 90, 190 86 S 330 76, 412 70',
    ticks: [
      ['WK 1', 8],
      ['WK 2', 140],
      ['WK 3', 272],
      ['WK 4', 388],
    ],
  },
}

const SPARKS: Record<Trend, string> = {
  up: 'M2 12 L14 11 L26 9 L38 8 L50 5 L58 3',
  down: 'M2 6 L14 7 L26 9 L38 8 L50 11 L58 12',
  flat: 'M2 10 L14 9 L26 9 L38 7 L50 6 L58 6',
}

const STATUS_STYLES: Record<Status, string> = {
  good: 'text-[#2d5a5a] border-[#2d5a5a]/35',
  watch: 'text-[#a54731] border-[#a54731]/30',
  ready: 'text-[#a8802a] border-[#a8802a]/40',
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
      {children}
    </div>
  )
}

export function DashboardArtifact() {
  const [view, setView] = useState<ViewKey>('overview')
  const [period, setPeriod] = useState<PeriodKey>('year')
  const reduceMotion = Boolean(useReducedMotion())
  const v = DASH[view]
  const p = PERIODS[period]
  const drawDuration = reduceMotion ? 0 : 1.1

  return (
    <ArtifactFrame url="built-with-karst / district-overview" chromeRight="Executive read · Week 14">
      <div className="grid md:grid-cols-[152px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden border-r border-[#1a1816]/10 px-4 py-5 md:block">
          <div className="mb-2.5 font-label text-[8px] font-bold uppercase tracking-[0.26em] text-[#6e6355]/70">
            Views
          </div>
          <div className="grid gap-0.5">
            {(Object.keys(DASH) as ViewKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`rounded-[3px] border-l-2 px-2.5 py-1.5 text-left font-label text-[11px] transition-colors ${
                  view === key
                    ? 'border-[#1e2a4a] bg-[#1e2a4a]/[0.06] font-semibold text-[#1a1816]'
                    : 'border-transparent font-medium text-[#1a1816]/60 hover:bg-[#1e2a4a]/[0.04] hover:text-[#1a1816]'
                }`}
              >
                {DASH[key].nav}
              </button>
            ))}
          </div>
          <div className="mb-2.5 mt-5 font-label text-[8px] font-bold uppercase tracking-[0.26em] text-[#6e6355]/70">
            Sites
          </div>
          <div className="grid gap-1 px-2.5" aria-hidden="true">
            {['All sites · 14', 'Middle · 3', 'High · 2'].map((s) => (
              <span key={s} className="font-label text-[10px] text-[#6e6355]/85">
                {s}
              </span>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="grid gap-3.5 p-4 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: easeStandard }}
                className="font-label text-[15px] font-semibold text-[#1a1816] md:text-[16px]"
              >
                {v.title}
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-1.5">
              {(Object.keys(PERIODS) as PeriodKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`rounded-[3px] border px-2.5 py-1.5 font-label text-[8.5px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    period === key
                      ? 'border-[#1e2a4a] text-[#1a1816]'
                      : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
                  }`}
                >
                  {PERIODS[key].chip}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile view switcher */}
          <div className="flex gap-1.5 md:hidden">
            {(Object.keys(DASH) as ViewKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`rounded-[3px] border px-2.5 py-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  view === key ? 'border-[#1e2a4a] text-[#1a1816]' : 'border-[#1a1816]/12 text-[#6e6355]'
                }`}
              >
                {DASH[key].nav}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5">
            {v.kpis.map(([label, value, note], i) => (
              <motion.div
                key={`${view}-${label}`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.05, ease: easeStandard }}
                className="rounded-[3px] border border-[#1a1816]/10 px-3.5 py-3"
              >
                <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                  {label}
                </div>
                <div className="mt-1 font-label text-[22px] font-extrabold tracking-[-0.01em] text-[#1a1816] md:text-[26px]">
                  {value}
                </div>
                <div className="mt-0.5 font-body text-[11px] font-medium text-[#a8802a]">{note}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart + bars */}
          <div className="grid gap-2.5 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3">
              <PanelLabel>{p.label}</PanelLabel>
              <svg viewBox="0 0 420 156" width="100%" aria-hidden="true">
                <g stroke="rgba(30,42,74,0.08)" strokeWidth="1">
                  <line x1="0" y1="30" x2="420" y2="30" />
                  <line x1="0" y1="68" x2="420" y2="68" />
                  <line x1="0" y1="106" x2="420" y2="106" />
                </g>
                <motion.path
                  key={`area-${period}`}
                  d={`${p.a} L 412 132 L 8 132 Z`}
                  fill="rgba(30,42,74,0.05)"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: easeStandard }}
                />
                <motion.path
                  key={`a-${period}`}
                  d={p.a}
                  fill="none"
                  stroke={NAVY}
                  strokeWidth="2"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: drawDuration, ease: easeStandard }}
                />
                <motion.path
                  key={`b-${period}`}
                  d={p.b}
                  fill="none"
                  stroke={BRASS}
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: drawDuration, delay: reduceMotion ? 0 : 0.12, ease: easeStandard }}
                />
                <g fill="rgba(110,99,85,0.7)" fontFamily="Montserrat, sans-serif" fontSize="8" letterSpacing="1.5">
                  {p.ticks.map(([label, x]) => (
                    <text key={label} x={x} y={150}>
                      {label}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
            <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3">
              <PanelLabel>{v.barsLabel}</PanelLabel>
              {v.bars.map(([label, width, countLabel], i) => (
                <div key={`${view}-${label}`} className="my-2 grid grid-cols-[74px_minmax(0,1fr)_30px] items-center gap-2.5">
                  <span className="truncate font-label text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#1a1816]/70">
                    {label}
                  </span>
                  <motion.i
                    initial={reduceMotion ? false : { width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.08 + i * 0.06, ease: easeStandard }}
                    className="block h-1.5 rounded-[2px]"
                    style={{
                      background:
                        i === v.bars.length - 1
                          ? 'rgba(30,42,74,0.22)'
                          : 'linear-gradient(90deg, rgba(30,42,74,0.75), rgba(30,42,74,0.45))',
                    }}
                  />
                  <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{countLabel}</b>
                </div>
              ))}
            </div>
          </div>

          {/* Site signals table */}
          <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3">
            <PanelLabel>Site signals</PanelLabel>
            <div
              className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_58px] items-center gap-3 pb-1.5 font-label text-[8px] font-bold uppercase tracking-[0.2em] text-[#6e6355]/70 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_64px_58px]"
              aria-hidden="true"
            >
              <span>Site</span>
              <span>Signal</span>
              <span className="hidden sm:block">Trend</span>
              <span>Status</span>
            </div>
            {v.rows.map(([site, signal, trend, status, statusLabel], i) => (
              <motion.div
                key={`${view}-${site}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: reduceMotion ? 0 : i * 0.05 }}
                className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_58px] items-center gap-3 border-t border-[#1a1816]/[0.06] py-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_64px_58px]"
              >
                <span className="truncate font-label text-[11px] font-semibold text-[#1a1816]">{site}</span>
                <span className="truncate font-body text-[11.5px] text-[#1a1816]/65">{signal}</span>
                <svg viewBox="0 0 60 16" className="hidden h-4 w-[60px] sm:block" aria-hidden="true">
                  <path
                    d={SPARKS[trend]}
                    fill="none"
                    stroke={status === 'watch' ? '#a54731' : NAVY}
                    strokeWidth="1.5"
                  />
                </svg>
                <em
                  className={`rounded-[3px] border px-1 py-1 text-center font-label text-[8px] font-bold not-italic uppercase tracking-[0.1em] ${STATUS_STYLES[status]}`}
                >
                  {statusLabel}
                </em>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={view}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l-2 border-[#a8802a] pl-3.5 font-body text-[12px] leading-relaxed text-[#1a1816]/70 md:text-[13px]"
            >
              <strong className="font-label font-semibold text-[#1a1816]">The read:</strong> {v.read}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </ArtifactFrame>
  )
}

/* ════════ 02 · Presentation — the board deck, staged as a deck ════════ */

export function PresentationArtifact() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <div className="relative">
      {/* the sheets behind — this is a deck, not a page */}
      <div
        aria-hidden="true"
        className="absolute inset-x-5 -bottom-2.5 top-5 rounded-[4px] bg-[#fffcf7]/[0.07] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-2.5 -bottom-1 top-2.5 rounded-[4px] bg-[#fffcf7]/[0.16] shadow-[0_22px_60px_rgba(0,0,0,0.4)]"
      />
      <div className="relative">
        <ArtifactFrame url="built-with-karst / board-study-session" chromeRight="Presenting · Slide 04 of 12">
          <motion.div
            className="flex min-h-[360px] flex-col px-6 pb-5 pt-8 md:min-h-[440px] md:px-14 md:pb-8 md:pt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}
          >
            <motion.div
              variants={{
                hidden: { opacity: reduceMotion ? 1 : 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
              }}
              className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]"
            >
              Enrollment &amp; facilities · Study session
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeStandard } },
              }}
              className="mb-auto mt-4 max-w-[22ch] font-headline text-[26px] font-light leading-[1.14] tracking-[-0.01em] text-[#1a1816] md:text-[40px]"
            >
              Should we consolidate the two middle-school feeder patterns{' '}
              <span className="font-editorial italic text-[#6e6355]">next fall?</span>
            </motion.div>

            <div className="mt-7 grid items-center gap-6 md:mt-10 md:grid-cols-[1.25fr_1fr] md:gap-12">
              <motion.div
                variants={{
                  hidden: { opacity: reduceMotion ? 1 : 0 },
                  visible: { opacity: 1, transition: { duration: 0.4 } },
                }}
              >
                <PanelLabel>Enrollment by feeder · five years</PanelLabel>
                <svg viewBox="0 0 320 118" width="100%" aria-hidden="true">
                  <g stroke="rgba(30,42,74,0.1)" strokeWidth="1">
                    <line x1="0" y1="28" x2="320" y2="28" />
                    <line x1="0" y1="58" x2="320" y2="58" />
                    <line x1="0" y1="88" x2="320" y2="88" />
                  </g>
                  <motion.path
                    d="M10 40 C 70 44, 130 52, 190 62 S 290 82, 310 88"
                    fill="none"
                    stroke={NAVY}
                    strokeWidth="2"
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: reduceMotion ? 0 : 1.3, delay: reduceMotion ? 0 : 0.25, ease: easeStandard }}
                  />
                  <motion.path
                    d="M10 62 C 70 60, 130 56, 190 50 S 290 36, 310 32"
                    fill="none"
                    stroke={BRASS}
                    strokeWidth="1.6"
                    strokeDasharray="3 5"
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: reduceMotion ? 0 : 1.3, delay: reduceMotion ? 0 : 0.45, ease: easeStandard }}
                  />
                  <motion.circle
                    cx="310"
                    cy="88"
                    r="3"
                    fill={NAVY}
                    initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: reduceMotion ? 0 : 1.5 }}
                  />
                  <motion.circle
                    cx="310"
                    cy="32"
                    r="3"
                    fill={BRASS}
                    initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: reduceMotion ? 0 : 1.7 }}
                  />
                  <motion.g
                    fill="rgba(110,99,85,0.85)"
                    fontFamily="Montserrat, sans-serif"
                    fontSize="7.5"
                    fontWeight="600"
                    letterSpacing="1"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.6 }}
                  >
                    <text x="238" y="104">FEEDER A</text>
                    <text x="240" y="24">FEEDER B</text>
                  </motion.g>
                </svg>
              </motion.div>
              <div className="grid content-center gap-3 font-body text-[13px] text-[#1a1816]/70 md:text-[14px]">
                {[
                  'Enrollment trend by feeder, five years, with the inflection named.',
                  'Transportation and staffing implications, costed both ways.',
                  'A recommendation the room can accept, amend, or decline.',
                ].map((point) => (
                  <motion.span
                    key={point}
                    variants={{
                      hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 8 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeStandard } },
                    }}
                    className="block border-l-2 border-[#a8802a] pl-3.5"
                  >
                    {point}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: reduceMotion ? 1 : 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
              }}
              className="mt-8 flex items-baseline justify-between gap-3 border-t border-[#1a1816]/10 pt-4 font-label text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#6e6355] md:mt-12 md:text-[9.5px]"
            >
              <span>
                <b className="font-semibold text-[#1a1816]">KARST</b> · Board study session
              </span>
              <span className="hidden md:block">Evidence attached · Recommendation on slide 12</span>
              <span className="flex items-center gap-2">
                <span className="flex gap-1" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full ${i === 3 ? 'bg-[#a8802a]' : 'bg-[#1a1816]/15'}`}
                    />
                  ))}
                </span>
                04 / 12
              </span>
            </motion.div>
          </motion.div>
        </ArtifactFrame>
      </div>
    </div>
  )
}

/* ════════ 03 · Application — a live submit, then the system responds ════════ */

const APP_STEPS = [
  ['01', 'Routed to the right trades lead. No forwarding chain.'],
  ['02', 'Joins the operating workflow with a real timeline.'],
  ['03', 'Counts on the district dashboard the moment it lands.'],
] as const

export function ApplicationArtifact() {
  const [submitted, setSubmitted] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const submit = () => {
    setSubmitted(true)
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setSubmitted(false), 7000)
  }

  return (
    <ArtifactFrame url="built-with-karst / facilities-requests" chromeRight="Staff-facing app">
      <div className="flex items-center justify-between gap-4 border-b border-[#1a1816]/10 bg-[#f6f4ec] px-5 py-3 md:px-7">
        <span className="flex items-center gap-2.5 font-label text-[10.5px] font-semibold text-[#1a1816] md:text-[11.5px]">
          <i className="h-2 w-2 rounded-full bg-[#1e2a4a]" aria-hidden="true" />
          Site facilities request
        </span>
        <span className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6e6355] md:text-[10px]">
          M. Alvarez · Sierra Vista Middle
        </span>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: easeStandard }}
            className="overflow-hidden"
          >
            <div className="mx-5 mt-4 rounded-[3px] border border-[#2d5a5a]/35 bg-[#2d5a5a]/[0.06] px-4 py-3 font-body text-[13px] text-[#2d5a5a] md:mx-7">
              Request <strong className="font-label font-semibold">#4127</strong> submitted. Routed to the
              trades lead, on the dashboard now.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-7">
        <div className="grid content-start gap-3.5">
          {(
            [
              ['Site', 'Sierra Vista Middle'],
              ['Location', 'Room 214 · Science wing'],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="grid gap-1.5">
              <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#6e6355]">
                {label}
              </span>
              <span className="rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-3.5 py-2.5 font-body text-[13.5px] text-[#1a1816]">
                {value}
              </span>
            </div>
          ))}
          <div className="grid gap-1.5">
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#6e6355]">
              Category
            </span>
            <span className="flex flex-wrap gap-2">
              {['HVAC', 'Electrical', 'Plumbing', 'Grounds'].map((chip, i) => (
                <i
                  key={chip}
                  className={`rounded-[3px] border px-3 py-2 font-label text-[9.5px] font-semibold uppercase tracking-[0.14em] not-italic ${
                    i === 0
                      ? 'border-[#a8802a] bg-[#a8802a]/[0.08] text-[#1a1816]'
                      : 'border-[#1a1816]/12 text-[#6e6355]'
                  }`}
                >
                  {chip}
                </i>
              ))}
            </span>
          </div>
          <div className="grid gap-1.5">
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#6e6355]">
              Details
            </span>
            <span className="min-h-[64px] rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-3.5 py-2.5 font-body text-[13.5px] leading-[1.55] text-[#1a1816]">
              No cooling since Tuesday morning. Two afternoon classes relocated. Unit hums but the fan
              never engages.
            </span>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={submitted}
            className="mt-1 inline-block justify-self-start rounded-[3px] bg-[#1a1816] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6] transition-all duration-300 hover:-translate-y-px hover:bg-[#0e0e0c] disabled:translate-y-0 disabled:opacity-45"
          >
            {submitted ? 'Submitted' : 'Submit request'}
          </button>
          <span className="font-body text-[11px] italic text-[#6e6355]/80">
            Try it. The submission is a demonstration; nothing is sent.
          </span>
        </div>

        <div className="grid content-center gap-4 border-t border-[#1a1816]/10 pt-6 md:border-l md:border-t-0 md:pl-9 md:pt-0">
          <div className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#a8802a] md:text-[10px]">
            What one submission does
          </div>
          {APP_STEPS.map(([number, text], i) => (
            <motion.div
              key={number}
              animate={
                submitted && !reduceMotion
                  ? { opacity: 1, x: 0 }
                  : submitted
                    ? { opacity: 1 }
                    : { opacity: 0.55, x: 0 }
              }
              initial={false}
              transition={{ duration: 0.45, delay: submitted && !reduceMotion ? 0.5 + i * 0.55 : 0, ease: easeStandard }}
              className="flex gap-3.5 font-body text-[13.5px] leading-[1.55]"
              style={{ color: 'rgba(26,24,22,0.72)' }}
            >
              <motion.i
                animate={submitted ? { color: BRASS } : { color: 'rgba(110,99,85,0.6)' }}
                transition={{ duration: 0.45, delay: submitted && !reduceMotion ? 0.5 + i * 0.55 : 0 }}
                className="pt-0.5 font-label text-[10px] font-bold not-italic tracking-[0.14em]"
              >
                {number}
              </motion.i>
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    </ArtifactFrame>
  )
}
