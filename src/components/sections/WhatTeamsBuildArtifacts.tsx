import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'
import mirrorPoolImage from '../../assets/mirror-pool.webp'
import slotCanyonImage from '../../assets/slot-canyon.webp'
import fishSchoolImage from '../../assets/fish-school.webp'

/* ── The three build artifacts for the What Your Team Builds chapter.
   Each maps to work Karst actually delivers: raw district exports
   processed with AI into an early-warning dashboard, one set of figures
   recomposed per audience, and a working tool the staff build that feeds
   a live dashboard. The AI does the analysis and helps build the tools;
   it is never shown as an agent living inside a shipped app. All content
   is synthetic demonstration data; the section caption states so. ── */

/* Data-ink palette, matched to the live Strategic/CTE dashboards further
   down the page so the mocks read as the same product family. Blues and
   greens carry the positive story; amber is the watch color; red is
   reserved for the single most acute signal on any surface. */
export const TEAL = '#0f4c4c'
export const TEAL_BRIGHT = '#2d8a8a'
export const SEA = '#2d5f8f'
export const DEEP_SEA = '#1e3a5f'
export const GREEN = '#10B981'
export const AMBER = '#a66a06'
export const RED = '#b91c1c'

/* ════════ Type-stream — text that writes itself in, instantly under
   reduced motion ════════ */

function useTypeStream(text: string, active: boolean, charsPerSecond = 110) {
  const reduceMotion = Boolean(useReducedMotion())
  /* Progress is keyed to the text it belongs to, so a new text derives to
     zero without a synchronous reset inside the effect. */
  const [progress, setProgress] = useState<{ key: string; n: number }>({ key: '', n: 0 })

  useEffect(() => {
    if (!active) return
    if (reduceMotion) {
      const t = setTimeout(() => setProgress({ key: text, n: text.length }), 0)
      return () => clearTimeout(t)
    }
    const step = 3
    const interval = setInterval(() => {
      setProgress((current) => {
        const n = current.key === text ? current.n : 0
        if (n >= text.length) {
          clearInterval(interval)
          return current
        }
        return { key: text, n: Math.min(text.length, n + step) }
      })
    }, (1000 * step) / charsPerSecond)
    return () => clearInterval(interval)
  }, [text, active, reduceMotion, charsPerSecond])

  const visible = active && progress.key === text ? progress.n : 0
  return { shown: text.slice(0, visible), done: visible >= text.length }
}

function StreamedRead({ label, text, active }: { label: string; text: string; active: boolean }) {
  const { shown, done } = useTypeStream(text, active)
  return (
    <p className="min-h-[3.4em] border-l-2 border-[#a8802a] pl-3.5 font-body text-[12px] leading-relaxed text-[#1a1816]/70 md:text-[13px]">
      <strong className="font-label font-semibold text-[#1a1816]">{label}</strong> {shown}
      {active && !done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#a8802a]" aria-hidden="true" />
      )}
    </p>
  )
}

/* ════════ Shared frame — the exemplar chrome, expandable to full screen ════════ */

function ChromeBar({
  url,
  chromeRight,
  actionLabel,
  actionIcon,
  onAction,
}: {
  url: string
  chromeRight?: string
  actionLabel: string
  actionIcon: 'expand' | 'close'
  onAction: () => void
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#fffcf7]/10 bg-[#151411] px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        <div className="h-2 w-2 rounded-full bg-[#c49a43]/80" />
        <div className="h-2 w-2 rounded-full bg-[#fffcf7]/24" />
        <div className="h-2 w-2 rounded-full bg-[#fffcf7]/12" />
      </div>
      <div className="ml-2 truncate font-mono text-[10px] text-[#fffcf7]/34 md:text-[11px]">{url}</div>
      <div className="ml-auto flex shrink-0 items-center gap-4">
        {chromeRight && (
          <span className="hidden font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fffcf7]/38 md:block">
            {chromeRight}
          </span>
        )}
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fffcf7]/48 transition-colors hover:text-[#fffcf7] md:text-[10px]"
        >
          {actionLabel}
          {actionIcon === 'expand' ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M3 1H1V3M7 1H9V3M3 9H1V7M7 9H9V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export function ArtifactFrame({
  url,
  chromeRight,
  children,
}: {
  url: string
  chromeRight?: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  return (
    <>
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
        <ChromeBar
          url={url}
          chromeRight={chromeRight}
          actionLabel="Expand"
          actionIcon="expand"
          onAction={() => setIsOpen(true)}
        />
        <div className="bg-[#fffcf7] text-[#1a1816]">{children}</div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className="absolute inset-0 bg-[#0e0e0c]/75"
              style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              aria-hidden="true"
            />
            <motion.div
              className="relative flex w-full flex-col overflow-hidden rounded-[4px] border border-[#fffcf7]/14 bg-[#0e0e0c]"
              style={{
                maxWidth: 'min(96vw, 1500px)',
                maxHeight: 'min(94vh, 1100px)',
                boxShadow: '0 50px 120px -30px rgba(0,0,0,0.55), 0 12px 28px rgba(0,0,0,0.18)',
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 12 }}
              transition={{ duration: 0.28, ease: easeStandard }}
            >
              <ChromeBar
                url={url}
                chromeRight={chromeRight}
                actionLabel="Close"
                actionIcon="close"
                onAction={() => setIsOpen(false)}
              />
              <div className="min-h-0 flex-1 overflow-y-auto bg-[#fffcf7] text-[#1a1816]">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
      {children}
    </div>
  )
}

/* ════════ 01 · Dashboards — a season of raw exports, processed with AI
   into an early-warning picture. Chart language: gradient ink, soft
   colored glow, rounded caps, dot-grid fields, tabular numerals, and a
   floating read card on hover. All numbers and site names invented. ════════ */

const SOURCE_FILES: Array<[string, string]> = [
  ['attendance.xlsx', '18,600 rows'],
  ['grades · D/F list', '6,900 marks'],
  ['discipline.xlsx', '22,400 rows'],
  ['roster · demographics', '18,600 students'],
]

const PANEL =
  'relative rounded-[12px] border border-white/60 bg-white/85 backdrop-blur-none md:bg-white/45 md:backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(26,24,22,0.04),0_14px_36px_-24px_rgba(26,24,22,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_5px_rgba(26,24,22,0.05),0_24px_48px_-24px_rgba(15,76,76,0.4)]'

/* Dot-grid field behind every chart — the drafting-table texture */
const DOT_FIELD: React.CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(26,24,22,0.07) 1px, transparent 1px)',
  backgroundSize: '14px 14px',
}

/* Shared SVG ink: vertical gradients + soft glow per hue */
function ChartDefs() {
  const stops: Array<[string, string, string]> = [
    ['gradTealBright', '#39a49c', '#2b8a84'],
    ['gradTeal', '#1f7272', '#135c5c'],
    ['gradAmber', '#c08a26', '#a26f10'],
    ['gradRed', '#cd574b', '#b13f34'],
    ['gradSea', '#4478aa', '#31608f'],
    ['gradGreen', '#25c493', '#12a377'],
  ]
  return (
    <defs>
      {stops.map(([id, from, to]) => (
        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      ))}
      <linearGradient id="gradSeaArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(74,127,181,0.35)" />
        <stop offset="1" stopColor="rgba(74,127,181,0)" />
      </linearGradient>
      <linearGradient id="gradSeaStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2d8a8a" />
        <stop offset="1" stopColor="#1e3a5f" />
      </linearGradient>
      <filter id="inkGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f4c4c" floodOpacity="0.14" />
      </filter>
      <filter id="lineGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2d5f8f" floodOpacity="0.18" />
      </filter>
    </defs>
  )
}

/* Floating read card that surfaces over a chart on hover */
function HoverCard({
  show,
  color,
  title,
  body,
}: {
  show: boolean
  color: string
  title: string
  body: string
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: easeStandard }}
          className="pointer-events-none absolute right-3 top-3 z-10 w-[210px] rounded-[5px] border border-[#1a1816]/[0.08] bg-[#fffdf9]/95 px-3.5 py-3 shadow-[0_2px_4px_rgba(26,24,22,0.06),0_18px_40px_-16px_rgba(26,24,22,0.35)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
            <span className="font-label text-[13px] font-extrabold tabular-nums tracking-[-0.01em] text-[#1a1816]">
              {title}
            </span>
          </div>
          <p className="mt-1.5 font-body text-[11px] leading-[1.55] text-[#1a1816]/65">{body}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type LensKey = 'cliff' | 'early' | 'watchlist'
type ChartKind = 'columns' | 'curve' | 'ranked'
type StatTone = 'good' | 'watch'

interface Lens {
  tab: string
  title: string
  stats: Array<[string, string, string, StatTone]>
  chart: ChartKind
  chartLabel: string
  read: string
}

const LENSES: Record<LensKey, Lens> = {
  cliff: {
    tab: 'The cliff',
    title: 'Where attendance turns into failure',
    stats: [
      ['Cliff edge', 'Below 90%', 'Risk doubles here', 'watch'],
      ['On track above 90%', '86%', 'Most of the district', 'good'],
    ],
    chart: 'columns',
    chartLabel: 'Course-failure rate by attendance band',
    read:
      'The pattern hides in the join. Below 90 percent attendance, course-failure rates roughly double; below 85, most of a cohort is failing something. Above the line, outcomes hold strong, which is why protecting attendance protects everything else.',
  },
  early: {
    tab: 'Early signal',
    title: 'The flag that shows up in week four',
    stats: [
      ['Earliest reliable flag', 'Week 4', 'First-month absences', 'good'],
      ['2+ early absences', '5× risk', 'Vs a clean first month', 'watch'],
    ],
    chart: 'curve',
    chartLabel: 'Year-end chronic absence by first-month absences',
    read:
      'The strongest predictor is the earliest one. A student with two or more absences in the first month is five times more likely to end the year chronically absent. That is a list a principal can act on in September, not one they read in June.',
  },
  watchlist: {
    tab: 'Watchlist',
    title: 'Named, ranked, and reachable',
    stats: [
      ['Flagged this fall', '412', 'Across 14 sites', 'watch'],
      ['Reconnected by winter', '243', 'Outreach is working', 'good'],
    ],
    chart: 'ranked',
    chartLabel: 'Flagged students by site · highest need first',
    read:
      'The dashboard ends where the work starts: a ranked, de-identified watchlist the district can turn back into real names on its own side. Each flag carries why it fired, so outreach is targeted, not district-wide.',
  },
}

const TONE_TEXT: Record<StatTone, string> = {
  good: 'text-[#0d9268]',
  watch: 'text-[#a66a06]',
}

/* A rect with only its top corners rounded, safe to height-animate */
function TopRoundRect({
  x,
  width,
  baseY,
  height,
  fill,
  filter,
  opacity,
  delay,
  reduceMotion,
}: {
  x: number
  width: number
  baseY: number
  height: number
  fill: string
  filter?: string
  opacity: number
  delay: number
  reduceMotion: boolean
}) {
  const r = Math.min(5, width / 2)
  return (
    <motion.path
      initial={reduceMotion ? false : { d: `M ${x} ${baseY} L ${x} ${baseY} L ${x + width} ${baseY} L ${x + width} ${baseY} Z`, opacity: 0 }}
      animate={{
        d: `M ${x} ${baseY} L ${x} ${baseY - height + r} Q ${x} ${baseY - height} ${x + r} ${baseY - height} L ${x + width - r} ${baseY - height} Q ${x + width} ${baseY - height} ${x + width} ${baseY - height + r} L ${x + width} ${baseY} Z`,
        opacity,
      }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: easeStandard }}
      fill={fill}
      filter={filter}
    />
  )
}

/* Column chart — the cliff */
const CLIFF_COLS: Array<[string, number, string, string, string, string]> = [
  ['95–100%', 6, '6%', 'url(#gradTealBright)', TEAL_BRIGHT, 'Near-perfect attendance: failure is rare.'],
  ['90–94%', 14, '14%', 'url(#gradTeal)', TEAL, 'Still holding. This is the line to defend.'],
  ['85–89%', 31, '31%', 'url(#gradAmber)', AMBER, 'The edge. Risk has already doubled.'],
  ['Below 85%', 58, '58%', 'url(#gradRed)', RED, 'Most of this cohort is failing something.'],
]

function CliffColumns({ reduceMotion }: { reduceMotion: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = 64
  const W = 360
  const H = 190
  const pad = 30
  const baseY = H - 26
  const colW = 52
  const gap = (W - pad * 2 - colW * CLIFF_COLS.length) / (CLIFF_COLS.length - 1)
  return (
    <div className="relative">
      <HoverCard
        show={hover !== null}
        color={hover !== null ? CLIFF_COLS[hover][4] : TEAL}
        title={hover !== null ? `${CLIFF_COLS[hover][2]} fail a course` : ''}
        body={hover !== null ? CLIFF_COLS[hover][5] : ''}
      />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" onMouseLeave={() => setHover(null)}>
        <ChartDefs />
        {/* hairline grid + right-edge scale */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} y1={baseY - (baseY - 18) * f} x2={W - pad} y2={baseY - (baseY - 18) * f} stroke="rgba(26,24,22,0.05)" strokeWidth="1" />
        ))}
        <line x1={pad} y1={baseY} x2={W - pad} y2={baseY} stroke="rgba(26,24,22,0.14)" strokeWidth="1" />
        {CLIFF_COLS.map(([label, val, tag, grad, solid], i) => {
          const x = pad + i * (colW + gap)
          const h = ((baseY - 22) * val) / max
          const dim = hover !== null && hover !== i
          return (
            <g
              key={label}
              onMouseEnter={() => setHover(i)}
              style={{ opacity: dim ? 0.32 : 1, transition: 'opacity 0.25s ease', cursor: 'default' }}
            >
              <rect x={x - gap / 2} y={8} width={colW + gap} height={H - 8} fill="transparent" />
              <TopRoundRect
                x={x}
                width={colW}
                baseY={baseY}
                height={h}
                fill={grad}
                filter="url(#inkGlow)"
                opacity={1}
                delay={0.1 + i * 0.09}
                reduceMotion={reduceMotion}
              />
              {/* baseline tick */}
              <line x1={x + colW / 2} y1={baseY} x2={x + colW / 2} y2={baseY + 4} stroke="rgba(26,24,22,0.25)" strokeWidth="1" />
              <motion.text
                x={x + colW / 2}
                y={baseY - h - 9}
                textAnchor="middle"
                fill={solid}
                fontFamily="Montserrat, sans-serif"
                fontSize={hover === i ? 13.5 : 12}
                fontWeight="800"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.5 + i * 0.09 }}
                style={{ fontVariantNumeric: 'tabular-nums', transition: 'font-size 0.2s ease' }}
              >
                {tag}
              </motion.text>
              <text
                x={x + colW / 2}
                y={baseY + 17}
                textAnchor="middle"
                fill="rgba(110,99,85,0.9)"
                fontFamily="Montserrat, sans-serif"
                fontSize="8.5"
                fontWeight="600"
                letterSpacing="0.5"
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* Area + line curve — gradient stroke, glow, hover values */
const EARLY_PTS: Array<[string, number, string]> = [
  ['0', 9, '9%'],
  ['1', 17, '17%'],
  ['2', 34, '34%'],
  ['3–4', 52, '52%'],
  ['5+', 71, '71%'],
]

function EarlyCurve({ reduceMotion }: { reduceMotion: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 360
  const H = 190
  const pad = 30
  const baseY = H - 26
  const topY = 20
  const max = 80
  const stepX = (W - pad * 2) / (EARLY_PTS.length - 1)
  const pts = EARLY_PTS.map(([, v], i) => {
    const x = pad + i * stepX
    const y = baseY - ((baseY - topY) * v) / max
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const area = `${line} L ${pts[pts.length - 1][0]} ${baseY} L ${pts[0][0]} ${baseY} Z`
  return (
    <div className="relative">
      <HoverCard
        show={hover !== null}
        color={hover === 2 ? AMBER : SEA}
        title={hover !== null ? `${EARLY_PTS[hover][2]} chronic by June` : ''}
        body={
          hover !== null
            ? `${EARLY_PTS[hover][0]} absence${EARLY_PTS[hover][0] === '1' ? '' : 's'} in the first month. ${hover >= 2 ? 'Past the turn: outreach now.' : 'Inside the safe range.'}`
            : ''
        }
      />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true" onMouseLeave={() => setHover(null)}>
        <ChartDefs />
        {[0.33, 0.66].map((f) => (
          <line key={f} x1={pad} y1={baseY - (baseY - topY) * f} x2={W - pad} y2={baseY - (baseY - topY) * f} stroke="rgba(26,24,22,0.05)" strokeWidth="1" />
        ))}
        <line x1={pad} y1={baseY} x2={W - pad} y2={baseY} stroke="rgba(26,24,22,0.14)" strokeWidth="1" />
        <motion.path
          d={area}
          fill="url(#gradSeaArea)"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.5 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="url(#gradSeaStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.15, ease: easeStandard }}
        />
        {pts.map(([x, y], i) => {
          const active = hover === i
          const inflection = i === 2
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={x - stepX / 2} y={8} width={stepX} height={H - 8} fill="transparent" />
              {inflection && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="none"
                  stroke={AMBER}
                  strokeWidth="1"
                  strokeOpacity="0.45"
                  initial={reduceMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.35 }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={active ? 6 : inflection ? 4.5 : 3.2}
                fill={inflection ? AMBER : '#fffcf7'}
                stroke={inflection ? AMBER : SEA}
                strokeWidth="2"
                initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.75 + i * 0.09 }}
                style={{ transition: 'r 0.2s ease' }}
              />
              {(active || (inflection && hover === null)) && (
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fill={inflection ? AMBER : SEA}
                  fontFamily="Montserrat, sans-serif"
                  fontSize="11.5"
                  fontWeight="800"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {EARLY_PTS[i][2]}
                </text>
              )}
            </g>
          )
        })}
        <g fill="rgba(110,99,85,0.9)" fontFamily="Montserrat, sans-serif" fontSize="8.5" fontWeight="600" letterSpacing="0.5">
          {EARLY_PTS.map(([label], i) => (
            <text key={label} x={pad + i * stepX} y={baseY + 17} textAnchor="middle">
              {label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}

/* Ranked bars — gradient ink, end dot, hover why */
const RANKED_SITES: Array<[string, number, string, boolean, string]> = [
  ['Harbor View High', 88, '96', true, 'Fri afternoons drive it'],
  ['Grandview Middle', 61, '67', true, 'One grade-7 cohort'],
  ['Cedar Hollow Elem', 44, '48', false, 'Improving 6 weeks straight'],
  ['Northfield Middle', 30, '33', false, 'Outreach cycle working'],
  ['Other sites', 52, '168', false, 'Ten sites, thin tails'],
]

function RankedBars({ reduceMotion }: { reduceMotion: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  return (
    <div className="grid gap-0.5" onMouseLeave={() => setHover(null)}>
      {RANKED_SITES.map(([label, width, value, hot, why], i) => (
        <div
          key={label}
          onMouseEnter={() => setHover(i)}
          className={`grid grid-cols-[112px_minmax(0,1fr)_38px] items-center gap-3 rounded-[4px] px-2 py-2 transition-colors duration-200 ${
            hover === i ? 'bg-[#0f4c4c]/[0.05]' : ''
          }`}
        >
          <span className={`truncate font-label text-[9px] font-semibold uppercase tracking-[0.04em] transition-colors ${hover === i ? 'text-[#1a1816]' : 'text-[#1a1816]/65'}`}>
            {label}
          </span>
          <span className="relative flex h-[10px] items-center">
            <motion.i
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `${width}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.15 + i * 0.08, ease: easeStandard }}
              className="block h-[7px] rounded-full"
              style={{
                background: hot
                  ? 'linear-gradient(90deg, #a5731a, #c08a26)'
                  : 'linear-gradient(90deg, #135c5c, #2b8a84)',
                boxShadow: hot
                  ? '0 2px 6px -2px rgba(166,106,6,0.3)'
                  : '0 2px 6px -2px rgba(15,76,76,0.28)',
              }}
            />
            <motion.span
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.7 + i * 0.08 }}
              className="absolute h-[13px] w-[13px] rounded-full border-2 border-[#fffcf7]"
              style={{ left: `calc(${width}% - 7px)`, background: hot ? '#c98a1e' : '#2d8a8a', boxShadow: '0 2px 6px rgba(26,24,22,0.25)' }}
              aria-hidden="true"
            />
            {hover === i && (
              <span className="absolute left-0 top-full mt-1 font-body text-[10.5px] italic text-[#6e6355]">{why}</span>
            )}
          </span>
          <b className="text-right font-label text-[12px] font-extrabold tabular-nums text-[#1a1816]">{value}</b>
        </div>
      ))}
    </div>
  )
}

/* Radial signal meter — rounded arcs with a center numeral */
const DONUT_SEGMENTS: Array<[string, number, string, string]> = [
  ['Attendance alone', 62, '#2d8a8a', 'url(#gradTeal)'],
  ['+ Grades', 26, '#3aa8a0', 'url(#gradTealBright)'],
  ['All three signals', 12, '#4a7fb5', 'url(#gradSea)'],
]

function SignalDonut({ reduceMotion }: { reduceMotion: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const r = 36
  const c = 2 * Math.PI * r
  const gapLen = 5
  const segments = DONUT_SEGMENTS.reduce<Array<{ label: string; pct: number; solid: string; grad: string; len: number; offset: number }>>(
    (acc, [label, pct, solid, grad]) => {
      const len = (c * pct) / 100 - gapLen
      const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].len + gapLen : 0
      acc.push({ label, pct, solid, grad, len, offset })
      return acc
    },
    [],
  )
  const centerPct = hover !== null ? `${DONUT_SEGMENTS[hover][1]}%` : '62%'
  const centerLabel = hover !== null ? DONUT_SEGMENTS[hover][0] : 'Attendance alone'
  return (
    <div className="flex items-center gap-5" onMouseLeave={() => setHover(null)}>
      <div className="relative shrink-0">
        <svg viewBox="0 0 96 96" width="104" height="104" aria-hidden="true" className="-rotate-90">
          <ChartDefs />
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(26,24,22,0.06)" strokeWidth="9" />
          {segments.map(({ label, grad, len, offset }, i) => (
            <motion.circle
              key={label}
              cx="48"
              cy="48"
              r={r}
              fill="none"
              stroke={grad}
              strokeWidth={hover === i ? 12 : 9}
              strokeLinecap="round"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              onMouseEnter={() => setHover(i)}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: hover === null || hover === i ? 1 : 0.3 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.2 + i * 0.12 }}
              style={{ transition: 'stroke-width 0.2s ease' }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-label text-[19px] font-extrabold tabular-nums leading-none text-[#1a1816]">{centerPct}</span>
        </div>
      </div>
      <div className="grid gap-1.5">
        <span className="font-body text-[10.5px] italic text-[#6e6355]">{centerLabel}</span>
        {DONUT_SEGMENTS.map(([label, pct, solid], i) => (
          <button
            type="button"
            key={label}
            onMouseEnter={() => setHover(i)}
            className={`flex items-center gap-2 rounded-[4px] px-1.5 py-0.5 text-left transition-colors duration-200 ${
              hover === i ? 'bg-[#0f4c4c]/[0.05]' : ''
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: solid }} aria-hidden="true" />
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-[#1a1816]/70">
              {label}
            </span>
            <b className="font-label text-[10.5px] font-bold tabular-nums text-[#1a1816]">{pct}%</b>
          </button>
        ))}
      </div>
    </div>
  )
}

/* Mini sparkline card — fills the left rail with a second read */
function TrendSparkCard({ reduceMotion }: { reduceMotion: boolean }) {
  const d = 'M4 30 C 20 28, 34 31, 48 26 S 78 15, 96 12 S 118 8, 128 7'
  return (
    <div className={`${PANEL} px-3.5 py-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
          Reconnected · by month
        </div>
        <span className="rounded-full bg-[#10B981]/[0.12] px-2 py-0.5 font-label text-[8.5px] font-bold tabular-nums text-[#0d9268]">
          ↑ 243
        </span>
      </div>
      <svg viewBox="0 0 132 38" width="100%" height="34" aria-hidden="true" className="mt-1.5">
        <ChartDefs />
        <motion.path
          d={`${d} L 128 36 L 4 36 Z`}
          fill="url(#gradSeaArea)"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.6 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="url(#gradGreen)"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.3, ease: easeStandard }}
        />
        <motion.circle
          cx="128"
          cy="7"
          r="3.4"
          fill="#10B981"
          stroke="#fffcf7"
          strokeWidth="1.6"
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : 1.25 }}
        />
      </svg>
      <div className="mt-1 flex justify-between font-label text-[7.5px] font-semibold uppercase tracking-[0.1em] text-[#6e6355]/60">
        <span>Sep</span>
        <span>Nov</span>
        <span>Jan</span>
      </div>
    </div>
  )
}

function LensChart({ lens, reduceMotion }: { lens: Lens; reduceMotion: boolean }) {
  if (lens.chart === 'columns') return <CliffColumns reduceMotion={reduceMotion} />
  if (lens.chart === 'curve') return <EarlyCurve reduceMotion={reduceMotion} />
  return (
    <div className="grid gap-4">
      <RankedBars reduceMotion={reduceMotion} />
      <div className="border-t border-[#1a1816]/[0.07] pt-3.5">
        <div className="mb-2.5 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
          How each flag was caught
        </div>
        <SignalDonut reduceMotion={reduceMotion} />
      </div>
    </div>
  )
}

export function DashboardArtifact() {
  const [lensKey, setLensKey] = useState<LensKey>('cliff')
  const [built, setBuilt] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())
  const lens = LENSES[lensKey]

  useEffect(() => {
    const t = setTimeout(() => setBuilt(true), reduceMotion ? 0 : 1400)
    return () => clearTimeout(t)
  }, [reduceMotion])

  return (
    <ArtifactFrame url="built-with-karst / early-warning" chromeRight="Raw exports · Processed with AI">
      <div
        className="relative grid gap-4 p-4 md:p-6"
        style={{ background: 'linear-gradient(178deg, #fffcf7 0%, #fbf7ef 60%, #f8f3e9 100%)' }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(460px 340px at 16% 28%, rgba(45,138,138,0.22), transparent 70%), radial-gradient(520px 360px at 84% 58%, rgba(201,138,30,0.16), transparent 70%), radial-gradient(420px 320px at 52% 100%, rgba(74,127,181,0.15), transparent 70%)',
          }}
        />
        {/* Provenance: the pile of data becomes one picture */}
        <div className="flex flex-col gap-3 rounded-[12px] border border-white/60 bg-white/85 px-4 py-3 md:bg-white/45 md:backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_28px_-22px_rgba(26,24,22,0.3)] md:flex-row md:items-center md:gap-5">
          <div className="flex flex-wrap gap-1.5">
            {SOURCE_FILES.map(([name, count], i) => (
              <motion.span
                key={name}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.12, ease: easeStandard }}
                className="flex cursor-default items-baseline gap-1.5 rounded-[4px] border border-[#1a1816]/10 bg-[#fffcf7] px-2.5 py-1.5 shadow-[0_1px_2px_rgba(26,24,22,0.05)] transition-all duration-200 hover:-translate-y-px hover:border-[#2d8a8a]/40 hover:shadow-[0_3px_8px_rgba(15,76,76,0.12)]"
              >
                <span className="font-mono text-[10px] text-[#1a1816]/80">{name}</span>
                <span className="font-label text-[8px] uppercase tracking-[0.1em] text-[#6e6355]">{count}</span>
              </motion.span>
            ))}
          </div>
          <div className="flex items-center gap-2 md:ml-auto">
            <span className="hidden text-[#2d8a8a] md:block" aria-hidden="true">→</span>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: built ? 1 : 0.4 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#1a1816]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
              De-identified · joined · analyzed
            </motion.span>
          </div>
        </div>

        {/* Lens toggle */}
        <div className="flex gap-1.5">
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setLensKey(key)}
              className={`rounded-[4px] px-3.5 py-2 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                key === lensKey
                  ? 'bg-[#0f4c4c] text-[#f0faf8] md:bg-[#0f4c4c]/90 md:backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_10px_-4px_rgba(15,76,76,0.45)]'
                  : 'border border-white/60 bg-white/85 text-[#6e6355] md:bg-white/50 md:backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:-translate-y-px hover:bg-white/70 hover:text-[#1a1816]'
              }`}
            >
              {LENSES[key].tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={lensKey}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: built ? 1 : 0.35, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: easeStandard }}
            className="grid gap-3.5"
          >
            <div className="font-label text-[15px] font-semibold text-[#1a1816] md:text-[16px]">{lens.title}</div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
              <div className="grid content-start gap-3">
                {lens.stats.map(([label, value, note, tone]) => (
                  <div key={label} className={`${PANEL} px-3.5 py-3`}>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[2px] rounded-t-[5px]"
                      style={{
                        background:
                          tone === 'good'
                            ? 'linear-gradient(90deg, #10B981, rgba(16,185,129,0))'
                            : 'linear-gradient(90deg, #c98a1e, rgba(201,138,30,0))',
                      }}
                    />
                    <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                      {label}
                    </div>
                    <div className="mt-1 font-label text-[22px] font-extrabold tabular-nums tracking-[-0.01em] text-[#1a1816] md:text-[24px]">
                      {value}
                    </div>
                    <div className={`mt-0.5 font-body text-[11px] font-medium ${TONE_TEXT[tone]}`}>{note}</div>
                  </div>
                ))}
                <TrendSparkCard reduceMotion={reduceMotion} />
              </div>
              <div className={`${PANEL} px-4 py-3.5`}>
                <div className="pointer-events-none absolute inset-2 rounded-[4px]" style={DOT_FIELD} aria-hidden="true" />
                <div className="relative">
                  <PanelLabel>{lens.chartLabel}</PanelLabel>
                  {built && <LensChart lens={lens} reduceMotion={reduceMotion} />}
                </div>
              </div>
            </div>
            <StreamedRead label="The read:" text={lens.read} active={built} />
          </motion.div>
        </AnimatePresence>

        {/* the live pair below — this mock and those dashboards are one family */}
        <a
          href="#live-dashboards"
          className="group -mt-0.5 inline-flex items-center gap-2 justify-self-start font-body text-[12px] italic text-[#6e6355] transition-colors hover:text-[#1a1816]"
        >
          Two live dashboards, built the same way, are further down this page.
          <span className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">↓</span>
        </a>
      </div>
    </ArtifactFrame>
  )
}

/* ════════ 02 · Presentation — an eight-slide working deck in the board
   register: image plates from the Karst set, serif hero stats, an
   LCAP-style voices score-card, glyph triptychs, drawing charts, and a
   slow color-cycling accent. Recomposed per audience; click to advance.
   All figures and voices are invented; no district named. ════════ */

type Audience = 'board' | 'staff' | 'families'
type GlyphName = 'chart' | 'bus' | 'calendar' | 'survey' | 'people' | 'building' | 'seal' | 'coins' | 'compass' | 'layers'

/* The deck's accent breathes slowly through the data palette. Static
   teal under reduced motion. */
const CYCLE = [TEAL_BRIGHT, SEA, '#c49a43', TEAL_BRIGHT]

function CycleText({
  children,
  reduceMotion,
  className = '',
}: {
  children: React.ReactNode
  reduceMotion: boolean
  className?: string
}) {
  return (
    <motion.span
      className={className}
      animate={reduceMotion ? undefined : { color: CYCLE }}
      transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      style={reduceMotion ? { color: TEAL_BRIGHT } : undefined}
    >
      {children}
    </motion.span>
  )
}

/* Line glyphs in the deck's visual voice: 24×24, 1.5px stroke, drawn on
   slide entry. */
function Glyph({
  name,
  color = TEAL,
  delay = 0,
  size = 26,
  reduceMotion,
}: {
  name: GlyphName
  color?: string
  delay?: number
  size?: number
  reduceMotion: boolean
}) {
  const paths: Record<GlyphName, string[]> = {
    chart: ['M3 21h18', 'M6 21v-7', 'M11 21V10', 'M16 21v-11', 'M21 21V6'],
    bus: ['M4 5h16v11H4z', 'M4 12h16', 'M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M8 8h.01M16 8h.01'],
    calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v5', 'M16 3v5', 'M8 14h3'],
    survey: ['M6 3h12v18H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3', 'M15.5 15.5l2 2 3-3.5'],
    people: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 21a6 6 0 0 1 12 0', 'M16 10a2.5 2.5 0 1 0 0-5', 'M17 15a5 5 0 0 1 4 6'],
    building: ['M5 21V5l7-3 7 3v16', 'M3 21h18', 'M9 9h.01M13 9h.01M9 13h.01M13 13h.01', 'M10 21v-4h4v4'],
    seal: ['M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M9.5 10.2l1.8 1.8 3.2-3.6', 'M8.5 14.5L7 21l5-2.5L17 21l-1.5-6.5'],
    coins: ['M8 10a5 3 0 1 0 0-6 5 3 0 0 0 0 6z', 'M3 7v5c0 1.7 2.2 3 5 3s5-1.3 5-3V7', 'M13 11c2.8 0 5 1.3 5 3v3c0 1.7-2.2 3-5 3s-5-1.3-5-3'],
    compass: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M15.5 8.5l-2 5-5 2 2-5z', 'M12 12h.01'],
    layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5', 'M3 17l9 5 9-5'],
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" className="shrink-0">
      {paths[name].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay + i * 0.08, ease: easeStandard }}
        />
      ))}
    </svg>
  )
}

interface VoiceList {
  title: string
  items: Array<[string, string]>
}

interface DeckContent {
  label: string
  coverEyebrow: string
  coverPlain: string
  coverItalic: string
  coverNote: string
  hero: string
  heroCaption: string
  voicesEyebrow: string
  voicesTitle: string
  voicesLeft: VoiceList
  voicesRight: VoiceList
  evidencePoints: Array<[GlyphName, string]>
  quote: string
  quoteAttribution: string
  nextSteps: Array<[GlyphName, string, string]>
  closeLine: string
}

const DECKS: Record<Audience, DeckContent> = {
  board: {
    label: 'Board',
    coverEyebrow: 'Board study session · Enrollment & facilities',
    coverPlain: 'The feeder question, with the',
    coverItalic: 'evidence attached.',
    coverNote: 'Tonight: the five-year trend, what eleven hundred voices said, the costs both ways, and a recommendation the room can act on.',
    hero: 'Year 2',
    heroCaption: 'when the two feeder patterns cross.',
    voicesEyebrow: 'Community voice · 1,120 responses',
    voicesTitle: 'What we heard before tonight.',
    voicesLeft: {
      title: 'Strongest agreement',
      items: [
        ['Keep both school communities intact', '4.6'],
        ['Decide with data, not anecdote', '4.4'],
        ['Protect classroom staffing first', '4.3'],
      ],
    },
    voicesRight: {
      title: 'Sharpest concerns',
      items: [
        ['Bus ride length for the youngest', '3.9'],
        ['Start-time changes for working families', '3.7'],
        ['Losing site traditions', '3.4'],
      ],
    },
    evidencePoints: [
      ['chart', 'Enrollment trend by feeder, five years, with the inflection named.'],
      ['bus', 'Transportation and staffing implications, costed both ways.'],
      ['seal', 'A recommendation the room can accept, amend, or decline.'],
    ],
    quote: 'No decision about a school community should move faster than the community can follow it.',
    quoteAttribution: 'The commitment this study was built on',
    nextSteps: [
      ['calendar', 'Study session', 'Tonight, with the full packet attached.'],
      ['survey', 'Public comment', 'Open through the spring window.'],
      ['seal', 'Board action', 'A vote only after both readings.'],
    ],
    closeLine: 'The full packet, every figure, and both cost models are attached to this deck.',
  },
  staff: {
    label: 'Staff',
    coverEyebrow: 'Feeder study · For site staff',
    coverPlain: 'What the feeder study means',
    coverItalic: 'for your school.',
    coverNote: 'The same figures the board sees, read for staffing, timelines, and your input window.',
    hero: 'Zero',
    heroCaption: 'involuntary transfers, in every scenario.',
    voicesEyebrow: 'Staff voice · 480 responses',
    voicesTitle: 'What your colleagues said.',
    voicesLeft: {
      title: 'Strongest agreement',
      items: [
        ['Tell us early, even without answers', '4.7'],
        ['Protect prep time during any change', '4.5'],
        ['Keep teams together where possible', '4.2'],
      ],
    },
    voicesRight: {
      title: 'Sharpest concerns',
      items: [
        ['Commute changes mid-year', '3.8'],
        ['Room and materials moves', '3.6'],
        ['Split-site assignments', '3.3'],
      ],
    },
    evidencePoints: [
      ['building', 'Site-by-site enrollment, so you can find your school in the trend.'],
      ['calendar', 'The decision timeline, with the dates that affect staffing first.'],
      ['survey', 'Your input window: the site survey stays open through February.'],
    ],
    quote: 'Staff hear it first, in person, before any public agenda item posts.',
    quoteAttribution: 'The sequencing rule for this study',
    nextSteps: [
      ['survey', 'Site survey', 'Ten minutes; every response is read.'],
      ['people', 'Site meetings', 'Your principal hosts, questions welcome.'],
      ['calendar', 'Decision', 'No staffing change before the timeline says so.'],
    ],
    closeLine: 'Questions after today go to your principal or straight to the study team.',
  },
  families: {
    label: 'Families',
    coverEyebrow: 'Feeder study · A plain-language update',
    coverPlain: 'Two ways to keep both school communities',
    coverItalic: 'strong.',
    coverNote: 'What is being studied, what would never change, and how your family weighs in.',
    hero: 'Two years',
    heroCaption: 'to phase any change, with town halls first.',
    voicesEyebrow: 'Family voice · 640 responses',
    voicesTitle: 'What families told us.',
    voicesLeft: {
      title: 'Strongest agreement',
      items: [
        ['Keep my child with their friends', '4.8'],
        ['Keep the teachers we know', '4.6'],
        ['Tell us in our home language', '4.5'],
      ],
    },
    voicesRight: {
      title: 'Sharpest concerns',
      items: [
        ['Longer bus rides', '4.0'],
        ['Earlier start times', '3.8'],
        ['New pickup logistics', '3.5'],
      ],
    },
    evidencePoints: [
      ['seal', 'What stays the same either way: teachers, programs, and school names.'],
      ['bus', 'What could change: some bus routes and start times, phased in.'],
      ['people', 'How families weigh in: town halls at both schools before any vote.'],
    ],
    quote: 'Every town hall happens before the vote, not after it.',
    quoteAttribution: 'The promise attached to this study',
    nextSteps: [
      ['people', 'Town halls', 'At both schools, evenings, translated.'],
      ['survey', 'Family survey', 'Five minutes, in your home language.'],
      ['calendar', 'The vote', 'Only after every town hall has met.'],
    ],
    closeLine: 'Translated copies of every page are available at both school offices.',
  },
}

/* 06 · The cost picture — grouped gradient columns, three paths over
   three years */
const COST_YEARS = ['Year 1', 'Year 2', 'Year 3']
const COST_SERIES: Array<[string, string, string, number[]]> = [
  ['Consolidate', 'url(#gradTeal)', '#0f4c4c', [310, 40, 40]],
  ['Phase', 'url(#gradSea)', '#2d5f8f', [180, 180, 60]],
  ['Hold', 'url(#gradAmber)', '#a66a06', [140, 280, 420]],
]

function CostSlide({ reduceMotion }: { reduceMotion: boolean }) {
  const W = 560
  const H = 210
  const pad = 40
  const baseY = H - 30
  const max = 460
  const groupW = (W - pad * 2) / COST_YEARS.length
  const barW = 34
  return (
    <div className="flex min-h-[340px] flex-col justify-center px-6 py-9 md:min-h-[420px] md:px-12">
      <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
        The cost picture · three years out
      </div>
      <div className="mt-3 max-w-[26ch] font-headline text-[22px] font-light leading-[1.15] text-[#1a1816] md:text-[28px]">
        Holding costs more than <span className="font-editorial italic text-[#6e6355]">moving.</span>
      </div>
      <div className="mt-5">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
          <ChartDefs />
          {[0.33, 0.66].map((f) => (
            <line
              key={f}
              x1={pad}
              y1={baseY - (baseY - 20) * f}
              x2={W - pad}
              y2={baseY - (baseY - 20) * f}
              stroke="rgba(26,24,22,0.05)"
              strokeWidth="1"
            />
          ))}
          <line x1={pad} y1={baseY} x2={W - pad} y2={baseY} stroke="rgba(26,24,22,0.14)" strokeWidth="1" />
          {COST_YEARS.map((year, yi) => {
            const groupX = pad + yi * groupW + (groupW - barW * 3 - 16) / 2
            return (
              <g key={year}>
                {COST_SERIES.map(([name, grad, solid, values], si) => {
                  const val = values[yi]
                  const h = ((baseY - 26) * val) / max
                  const x = groupX + si * (barW + 8)
                  return (
                    <g key={name}>
                      <TopRoundRect
                        x={x}
                        width={barW}
                        baseY={baseY}
                        height={h}
                        fill={grad}
                        filter="url(#inkGlow)"
                        opacity={1}
                        delay={0.15 + yi * 0.18 + si * 0.07}
                        reduceMotion={reduceMotion}
                      />
                      <motion.text
                        x={x + barW / 2}
                        y={baseY - h - 7}
                        textAnchor="middle"
                        fill={solid}
                        fontFamily="Montserrat, sans-serif"
                        fontSize="9.5"
                        fontWeight="800"
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.6 + yi * 0.18 + si * 0.07 }}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {val}
                      </motion.text>
                    </g>
                  )
                })}
                <text
                  x={pad + yi * groupW + groupW / 2}
                  y={baseY + 19}
                  textAnchor="middle"
                  fill="rgba(110,99,85,0.9)"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="9"
                  fontWeight="600"
                  letterSpacing="0.8"
                >
                  {year}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-5">
        {COST_SERIES.map(([name, , solid]) => (
          <span key={name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: solid }} aria-hidden="true" />
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.1em] text-[#1a1816]/70">
              {name}
            </span>
          </span>
        ))}
        <span className="font-editorial text-[11.5px] italic text-[#6e6355]">$ thousands · illustrative models</span>
      </div>
    </div>
  )
}

/* Shared option triptych — the three paths under study */
const OPTIONS: Array<[GlyphName, string, string, string]> = [
  ['layers', 'Consolidate', 'One feeder pattern next fall; transportation redesigned once.', '$310K one-time'],
  ['compass', 'Phase', 'Two-year transition; routes and start times move in stages.', '$180K per year'],
  ['coins', 'Hold', 'Keep both patterns; staffing follows the enrollment slide.', '$420K per year by Yr 3'],
]

const SLIDE_COUNT = 9

function DeckSlide({
  deck,
  slide,
  reduceMotion,
}: {
  deck: DeckContent
  slide: number
  reduceMotion: boolean
}) {
  /* 01 · Cover — image plate right, editorial title left */
  if (slide === 0) {
    return (
      <div className="grid min-h-[340px] md:min-h-[420px] md:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-center px-6 py-10 md:px-12">
          <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
            {deck.coverEyebrow}
          </div>
          <div className="mt-5 max-w-[20ch] font-headline text-[30px] font-light leading-[1.12] tracking-[-0.015em] text-[#1a1816] md:text-[44px]">
            {deck.coverPlain}{' '}
            <CycleText reduceMotion={reduceMotion} className="font-editorial italic">
              {deck.coverItalic}
            </CycleText>
          </div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.35 }}
            className="mt-6 max-w-[46ch] font-body text-[13px] leading-[1.7] text-[#1a1816]/60 md:text-[14px]"
          >
            {deck.coverNote}
          </motion.p>
        </div>
        <div className="relative hidden overflow-hidden md:block">
          <motion.img
            src={fishSchoolImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduceMotion ? false : { scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: easeStandard }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fffcf7] via-[#fffcf7]/15 to-transparent" aria-hidden="true" />
        </div>
      </div>
    )
  }
  /* 02 · Hero stat */
  if (slide === 1) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-10 text-center md:min-h-[420px]">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.34em] text-[#a8802a] md:text-[10px]">
          {deck.coverEyebrow}
        </div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeStandard }}
        >
          <CycleText
            reduceMotion={reduceMotion}
            className="mt-7 block font-editorial text-[58px] font-normal italic leading-[0.95] md:text-[86px]"
          >
            {deck.hero}
          </CycleText>
        </motion.div>
        <div className="mx-auto mt-5 max-w-[26ch] font-headline text-[19px] font-light leading-[1.2] text-[#1a1816] md:text-[26px]">
          {deck.heroCaption}
        </div>
      </div>
    )
  }
  /* 03 · Voices score-card, the LCAP register */
  if (slide === 2) {
    return (
      <div className="flex min-h-[340px] flex-col justify-center px-6 py-9 md:min-h-[420px] md:px-12">
        <div className="flex items-center gap-3">
          <Glyph name="people" color={TEAL_BRIGHT} size={20} reduceMotion={reduceMotion} />
          <span className="font-label text-[9px] font-semibold uppercase tracking-[0.24em] text-[#6e6355]">
            {deck.voicesEyebrow.split('·')[0].trim()}
          </span>
          <span className="hidden font-editorial text-[13px] italic text-[#1e3a5f] sm:block">
            {deck.voicesEyebrow.split('·')[1]?.trim()}
          </span>
        </div>
        <div className="mt-4 font-headline text-[24px] font-light leading-[1.15] text-[#1a1816] md:text-[32px]">
          {deck.voicesTitle}
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 md:gap-6">
          {[deck.voicesLeft, deck.voicesRight].map((list, li) => (
            <motion.div
              key={list.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 + li * 0.12, ease: easeStandard }}
              className="rounded-[4px] border border-[#1a1816]/[0.07] bg-white/80 px-5 py-4 shadow-[0_1px_2px_rgba(26,24,22,0.03),0_14px_34px_-24px_rgba(26,24,22,0.3)]"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: li === 0 ? GREEN : AMBER }}
                  aria-hidden="true"
                />
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
                  {list.title}
                </span>
              </div>
              {list.items.map(([text, score], i) => (
                <motion.div
                  key={text}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.3 + li * 0.12 + i * 0.09 }}
                  className="flex items-baseline gap-3 border-b border-[#1a1816]/[0.06] py-2 last:border-b-0"
                >
                  <span className="font-label text-[8.5px] font-bold text-[#6e6355]/60">{`0${i + 1}`}</span>
                  <span className="flex-1 font-body text-[12.5px] leading-snug text-[#1a1816]/80">{text}</span>
                  <span className="font-editorial text-[16px] italic" style={{ color: li === 0 ? TEAL : AMBER }}>
                    {score}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
        <p className="mt-4 font-editorial text-[11.5px] italic text-[#6e6355]">
          Weighted means, 1.0–5.0 scale, all responses. Illustrative survey.
        </p>
      </div>
    )
  }
  /* 04 · Evidence chart */
  if (slide === 3) {
    return (
      <div className="flex min-h-[340px] flex-col justify-center px-6 py-9 md:min-h-[420px] md:px-12">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
          The evidence
        </div>
        <div className="mt-6 grid items-center gap-7 md:grid-cols-[0.95fr_1.05fr] md:gap-12">
          <div>
            <PanelLabel>Enrollment by feeder · five years</PanelLabel>
            <svg viewBox="0 0 320 112" width="100%" aria-hidden="true">
              <g stroke="rgba(30,42,74,0.1)" strokeWidth="1">
                <line x1="0" y1="28" x2="320" y2="28" />
                <line x1="0" y1="58" x2="320" y2="58" />
                <line x1="0" y1="88" x2="320" y2="88" />
              </g>
              <motion.path
                d="M10 40 C 70 44, 130 52, 190 62 S 290 82, 310 88"
                fill="none"
                stroke={DEEP_SEA}
                strokeWidth="2"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.15, ease: easeStandard }}
              />
              <motion.path
                d="M10 62 C 70 60, 130 56, 190 50 S 290 36, 310 32"
                fill="none"
                stroke={TEAL_BRIGHT}
                strokeWidth="1.8"
                strokeDasharray="3 5"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: easeStandard }}
              />
              <circle cx="310" cy="88" r="3" fill={DEEP_SEA} />
              <circle cx="310" cy="32" r="3" fill={TEAL_BRIGHT} />
              <circle cx="196" cy="55" r="3.5" fill="none" stroke={AMBER} strokeWidth="1.4" />
              <g fill="rgba(110,99,85,0.85)" fontFamily="Montserrat, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1">
                <text x="238" y="104">FEEDER A</text>
                <text x="240" y="24">FEEDER B</text>
              </g>
            </svg>
          </div>
          <div className="grid content-center gap-4">
            {deck.evidencePoints.map(([glyph, text], i) => (
              <motion.div
                key={text}
                initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2 + i * 0.14, ease: easeStandard }}
                className="flex items-start gap-3.5"
              >
                <Glyph name={glyph} delay={0.25 + i * 0.14} reduceMotion={reduceMotion} />
                <span className="font-body text-[13px] leading-[1.6] text-[#1a1816]/70 md:text-[13.5px]">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  /* 05 · The options triptych */
  if (slide === 4) {
    return (
      <div className="flex min-h-[340px] flex-col justify-center px-6 py-9 md:min-h-[420px] md:px-12">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
          Three paths, costed
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3 md:gap-5">
          {OPTIONS.map(([glyph, title, detail, cost], i) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12 + i * 0.13, ease: easeStandard }}
              className="group rounded-[4px] border border-[#1a1816]/[0.07] bg-white/80 px-5 pb-5 pt-4 shadow-[0_1px_2px_rgba(26,24,22,0.03),0_14px_34px_-24px_rgba(26,24,22,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(26,24,22,0.05),0_22px_44px_-22px_rgba(15,76,76,0.35)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-label text-[9px] font-bold tracking-[0.2em] text-[#a8802a]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Glyph name={glyph} color={TEAL_BRIGHT} delay={0.2 + i * 0.13} size={30} reduceMotion={reduceMotion} />
              </div>
              <div className="mt-3.5 font-headline text-[20px] font-normal text-[#1a1816]">{title}</div>
              <p className="mt-1.5 font-body text-[12.5px] leading-[1.6] text-[#1a1816]/62">{detail}</p>
              <div className="mt-3.5 border-t border-[#1a1816]/[0.07] pt-2.5 font-editorial text-[14px] italic text-[#1e3a5f]">
                {cost}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 font-editorial text-[11.5px] italic text-[#6e6355]">
          Cost models attached · figures are illustrative.
        </p>
      </div>
    )
  }
  /* 06 · The cost picture */
  if (slide === 5) {
    return <CostSlide reduceMotion={reduceMotion} />
  }
  /* 07 · Pull-quote with image plate */
  if (slide === 6) {
    return (
      <div className="grid min-h-[340px] md:min-h-[420px] md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden md:block">
          <motion.img
            src={mirrorPoolImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduceMotion ? false : { scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: easeStandard }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#fffcf7] via-[#fffcf7]/15 to-transparent" aria-hidden="true" />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 md:px-12">
          <span className="font-editorial text-5xl not-italic leading-none text-[#a8802a]/40 select-none md:text-6xl" aria-hidden="true">
            &ldquo;
          </span>
          <motion.blockquote
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.2, ease: easeStandard }}
            className="mt-2 max-w-[24ch] font-editorial text-[22px] italic leading-[1.35] text-[#1a1816] md:text-[28px]"
          >
            {deck.quote}
          </motion.blockquote>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.55 }}
            className="mt-6 font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6e6355]"
          >
            {deck.quoteAttribution}
          </motion.div>
        </div>
      </div>
    )
  }
  /* 08 · What happens next */
  if (slide === 7) {
    return (
      <div className="flex min-h-[340px] flex-col justify-center px-6 py-9 md:min-h-[420px] md:px-12">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
          What happens next
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {deck.nextSteps.map(([glyph, title, detail], i) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 + i * 0.14, ease: easeStandard }}
              className="border-t border-[#1a1816]/12 pt-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-label text-[9px] font-bold tracking-[0.2em] text-[#a8802a]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Glyph name={glyph} color={TEAL_BRIGHT} delay={0.2 + i * 0.14} reduceMotion={reduceMotion} />
              </div>
              <div className="mt-3 font-headline text-[17px] font-normal text-[#1a1816]">{title}</div>
              <p className="mt-1.5 font-body text-[12.5px] leading-[1.6] text-[#1a1816]/62">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }
  /* 08 · Close */
  return (
    <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center md:min-h-[420px]">
      <motion.img
        src={slotCanyonImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduceMotion ? false : { scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.3, ease: easeStandard }}
      />
      <div className="absolute inset-0 bg-[#0e0e0c]/55" aria-hidden="true" />
      <div className="relative z-10">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.34em] text-[#e6d8b9] md:text-[10px]">
          Thank you
        </div>
        <div className="mx-auto mt-5 max-w-[18ch] font-headline text-[30px] font-light leading-[1.12] text-[#fffcf7] md:text-[42px]">
          Questions <span className="font-editorial italic text-[#e6d8b9]">welcome.</span>
        </div>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
          className="mx-auto mt-5 max-w-[44ch] font-body text-[12.5px] leading-[1.7] text-[#fffcf7]/70"
        >
          {deck.closeLine}
        </motion.p>
      </div>
    </div>
  )
}

export function PresentationArtifact() {
  const [audience, setAudience] = useState<Audience>('board')
  const [slide, setSlide] = useState(0)
  const [hasAdvanced, setHasAdvanced] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())
  const deck = DECKS[audience]

  const go = (delta: number) => {
    setSlide((s) => (s + delta + SLIDE_COUNT) % SLIDE_COUNT)
    setHasAdvanced(true)
  }

  const pickAudience = (key: Audience) => {
    setAudience(key)
    setSlide(0)
  }

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
        <ArtifactFrame url="built-with-karst / board-study-session" chromeRight="One source · Three audiences">
          {/* audience recompose bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1816]/10 bg-[#f6f4ec] px-6 py-3 md:px-12">
            <span className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#6e6355]">
              Same figures · Composed for
            </span>
            <span className="flex gap-1.5">
              {(Object.keys(DECKS) as Audience[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => pickAudience(key)}
                  className={`rounded-[3px] border px-3 py-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    audience === key
                      ? 'border-[#0f4c4c] bg-[#0f4c4c]/[0.07] text-[#1a1816]'
                      : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
                  }`}
                >
                  {DECKS[key].label}
                </button>
              ))}
            </span>
          </div>

          {/* cycling hairline — the deck breathes through the palette */}
          <motion.div
            className="h-[2px] origin-left"
            animate={
              reduceMotion
                ? undefined
                : { backgroundColor: CYCLE, scaleX: (slide + 1) / SLIDE_COUNT }
            }
            transition={reduceMotion ? undefined : { backgroundColor: { duration: 14, repeat: Infinity, ease: 'easeInOut' }, scaleX: { duration: 0.45, ease: easeStandard } }}
            style={reduceMotion ? { backgroundColor: TEAL_BRIGHT, transform: `scaleX(${(slide + 1) / SLIDE_COUNT})` } : undefined}
            aria-hidden="true"
          />

          {/* the slide surface — click anywhere to advance */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Deck slide ${slide + 1} of ${SLIDE_COUNT}. Click or press the right arrow to advance.`}
            onClick={() => go(1)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                go(1)
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                go(-1)
              }
            }}
            className="relative cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d8a8a]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${audience}-${slide}`}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: easeStandard }}
              >
                <DeckSlide deck={deck} slide={slide} reduceMotion={reduceMotion} />
              </motion.div>
            </AnimatePresence>

            {/* click-to-advance cue, retires after first use */}
            {!hasAdvanced && !reduceMotion && (
              <motion.span
                className="pointer-events-none absolute bottom-4 right-5 flex items-center gap-1.5 font-body text-[11px] italic text-[#2d8a8a]"
                animate={{ opacity: [0.5, 1, 0.5], x: [0, 3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                click to advance <span aria-hidden="true">→</span>
              </motion.span>
            )}
          </div>

          {/* deck rail */}
          <div className="flex items-center justify-between gap-3 border-t border-[#1a1816]/10 px-6 py-3.5 font-label text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#6e6355] md:px-12 md:text-[9.5px]">
            <span>
              <b className="font-semibold text-[#1a1816]">KARST</b> · Feeder study
            </span>
            <span className="hidden md:block">Nine-slide excerpt · Recomposed per audience</span>
            <span className="flex items-center gap-3">
              <span className="flex gap-1" aria-hidden="true">
                {Array.from({ length: SLIDE_COUNT }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setSlide(i)
                      setHasAdvanced(true)
                    }}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                      i === slide ? 'bg-[#2d8a8a]' : 'bg-[#1a1816]/15 hover:bg-[#1a1816]/35'
                    }`}
                  />
                ))}
              </span>
              <span className="tabular-nums">{`0${slide + 1}`} / 09</span>
              <span className="flex gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-[#1a1816]/15 text-[#1a1816]/70 transition-colors hover:border-[#1a1816]/40 hover:text-[#1a1816]"
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M6 1L2 4.5L6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-[#1a1816]/15 text-[#1a1816]/70 transition-colors hover:border-[#1a1816]/40 hover:text-[#1a1816]"
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path d="M3 1L7 4.5L3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            </span>
          </div>
        </ArtifactFrame>
      </div>
    </div>
  )
}

