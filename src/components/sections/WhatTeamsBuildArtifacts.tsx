import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

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
   into an early-warning picture. Directionally modeled on real district
   work (attendance × outcomes, ABC early-warning framework); all numbers
   and site names here are invented, no live data, no district named.
   Data ink matches the live dashboards further down the page. ════════ */

const SOURCE_FILES: Array<[string, string]> = [
  ['attendance.xlsx', '18,600 rows'],
  ['grades · D/F list', '6,900 marks'],
  ['discipline.xlsx', '22,400 rows'],
  ['roster · demographics', '18,600 students'],
]

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
  good: 'text-[#10B981]',
  watch: 'text-[#a66a06]',
}

/* Column chart — the cliff, teal holding ground until the edge gives way */
const CLIFF_COLS: Array<[string, number, string, string]> = [
  ['95–100%', 6, '6%', TEAL_BRIGHT],
  ['90–94%', 14, '14%', TEAL],
  ['85–89%', 31, '31%', AMBER],
  ['Below 85%', 58, '58%', RED],
]

function CliffColumns({ reduceMotion }: { reduceMotion: boolean }) {
  const max = 62
  const W = 340
  const H = 170
  const pad = 26
  const baseY = H - 22
  const colW = 46
  const gap = (W - pad * 2 - colW * CLIFF_COLS.length) / (CLIFF_COLS.length - 1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
      <line x1={pad} y1={baseY} x2={W - pad} y2={baseY} stroke="rgba(26,24,22,0.12)" strokeWidth="1" />
      {CLIFF_COLS.map(([label, val, tag, color], i) => {
        const x = pad + i * (colW + gap)
        const h = ((baseY - 14) * val) / max
        return (
          <g key={label}>
            <motion.rect
              x={x}
              width={colW}
              rx={2}
              initial={reduceMotion ? { y: baseY - h, height: h } : { y: baseY, height: 0 }}
              animate={{ y: baseY - h, height: h }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.1 + i * 0.09, ease: easeStandard }}
              fill={color}
              fillOpacity={0.78}
            />
            <motion.text
              x={x + colW / 2}
              y={baseY - h - 6}
              textAnchor="middle"
              fill={color}
              fontFamily="Montserrat, sans-serif"
              fontSize="11"
              fontWeight="700"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.5 + i * 0.09 }}
            >
              {tag}
            </motion.text>
            <text
              x={x + colW / 2}
              y={baseY + 14}
              textAnchor="middle"
              fill="rgba(110,99,85,0.85)"
              fontFamily="Montserrat, sans-serif"
              fontSize="8"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* Area + line curve — the early-warning ramp, sea-blue with the amber turn */
const EARLY_PTS: Array<[string, number, string]> = [
  ['0', 9, '9%'],
  ['1', 17, '17%'],
  ['2', 34, '34%'],
  ['3–4', 52, '52%'],
  ['5+', 71, '71%'],
]

function EarlyCurve({ reduceMotion }: { reduceMotion: boolean }) {
  const W = 340
  const H = 170
  const pad = 26
  const baseY = H - 22
  const topY = 16
  const max = 80
  const stepX = (W - pad * 2) / (EARLY_PTS.length - 1)
  const pts = EARLY_PTS.map(([, v], i) => {
    const x = pad + i * stepX
    const y = baseY - ((baseY - topY) * v) / max
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const area = `${line} L ${pts[pts.length - 1][0]} ${baseY} L ${pts[0][0]} ${baseY} Z`
  const inflection = pts[2]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
      <g stroke="rgba(26,24,22,0.07)" strokeWidth="1">
        <line x1={pad} y1={topY + 28} x2={W - pad} y2={topY + 28} />
        <line x1={pad} y1={(topY + baseY) / 2} x2={W - pad} y2={(topY + baseY) / 2} />
      </g>
      <line x1={pad} y1={baseY} x2={W - pad} y2={baseY} stroke="rgba(26,24,22,0.12)" strokeWidth="1" />
      <motion.path
        d={area}
        fill="rgba(45,95,143,0.1)"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={SEA}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.15, ease: easeStandard }}
      />
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 2 ? 4 : 2.6}
          fill={i === 2 ? AMBER : '#fffcf7'}
          stroke={i === 2 ? AMBER : SEA}
          strokeWidth="1.6"
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.7 + i * 0.09 }}
        />
      ))}
      <motion.text
        x={inflection[0]}
        y={inflection[1] - 12}
        textAnchor="middle"
        fill={AMBER}
        fontFamily="Montserrat, sans-serif"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.6"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.3 }}
      >
        INFLECTION
      </motion.text>
      <g fill="rgba(110,99,85,0.85)" fontFamily="Montserrat, sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.5">
        {EARLY_PTS.map(([label], i) => (
          <text key={label} x={pad + i * stepX} y={baseY + 14} textAnchor="middle">
            {label}
          </text>
        ))}
      </g>
    </svg>
  )
}

/* Ranked horizontal bars — the watchlist by site */
const RANKED_SITES: Array<[string, number, string, boolean]> = [
  ['Harbor View High', 88, '96', true],
  ['Grandview Middle', 61, '67', true],
  ['Cedar Hollow Elem', 44, '48', false],
  ['Northfield Middle', 30, '33', false],
  ['Other sites', 52, '168', false],
]

function RankedBars({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="grid gap-2.5">
      {RANKED_SITES.map(([label, width, value, hot], i) => (
        <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)_34px] items-center gap-3">
          <span className="truncate font-label text-[9px] font-semibold uppercase tracking-[0.04em] text-[#1a1816]/70">
            {label}
          </span>
          <motion.i
            initial={reduceMotion ? false : { width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.15 + i * 0.08, ease: easeStandard }}
            className="block h-2 rounded-[2px]"
            style={{
              background: hot
                ? 'linear-gradient(90deg, rgba(166,106,6,0.85), rgba(166,106,6,0.5))'
                : 'linear-gradient(90deg, rgba(15,76,76,0.8), rgba(45,138,138,0.5))',
            }}
          />
          <b className="text-right font-label text-[11px] font-semibold text-[#1a1816]">{value}</b>
        </div>
      ))}
    </div>
  )
}

/* Donut — how each flag was caught */
const DONUT_SEGMENTS: Array<[string, number, string]> = [
  ['Attendance alone', 62, TEAL],
  ['+ Grades', 26, TEAL_BRIGHT],
  ['All three signals', 12, SEA],
]

function SignalDonut({ reduceMotion }: { reduceMotion: boolean }) {
  const r = 34
  const c = 2 * Math.PI * r
  // Precompute each segment's cumulative offset so the render map stays pure.
  const segments = DONUT_SEGMENTS.reduce<Array<{ label: string; pct: number; color: string; len: number; offset: number }>>(
    (acc, [label, pct, color]) => {
      const len = (c * pct) / 100
      const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].len : 0
      acc.push({ label, pct, color, len, offset })
      return acc
    },
    [],
  )
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 90 90" width="90" height="90" aria-hidden="true" className="shrink-0 -rotate-90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(26,24,22,0.08)" strokeWidth="11" />
        {segments.map(({ label, color, len, offset }, i) => (
          <motion.circle
            key={label}
            cx="45"
            cy="45"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 + i * 0.15 }}
          />
        ))}
      </svg>
      <div className="grid gap-1.5">
        {DONUT_SEGMENTS.map(([label, pct, color]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[1px]" style={{ background: color }} aria-hidden="true" />
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-[#1a1816]/70">
              {label}
            </span>
            <b className="font-label text-[10px] font-bold text-[#1a1816]">{pct}%</b>
          </div>
        ))}
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
      <div className="grid gap-4 p-4 md:p-6">
        {/* Provenance: the pile of data becomes one picture */}
        <div className="flex flex-col gap-3 rounded-[3px] border border-[#1a1816]/10 bg-[#f6f4ec] px-4 py-3 md:flex-row md:items-center md:gap-5">
          <div className="flex flex-wrap gap-1.5">
            {SOURCE_FILES.map(([name, count], i) => (
              <motion.span
                key={name}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.12, ease: easeStandard }}
                className="flex items-baseline gap-1.5 rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-2.5 py-1.5"
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
              className={`rounded-[3px] border px-3 py-2 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                key === lensKey
                  ? 'border-[#0f4c4c] bg-[#0f4c4c]/[0.07] text-[#1a1816]'
                  : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
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
            <div className="grid gap-2.5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
              <div className="grid content-start gap-2.5">
                {lens.stats.map(([label, value, note, tone]) => (
                  <div key={label} className="rounded-[3px] border border-[#1a1816]/10 px-3.5 py-3">
                    <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                      {label}
                    </div>
                    <div className="mt-1 font-label text-[21px] font-extrabold tracking-[-0.01em] text-[#1a1816] md:text-[23px]">
                      {value}
                    </div>
                    <div className={`mt-0.5 font-body text-[11px] font-medium ${TONE_TEXT[tone]}`}>{note}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5">
                <PanelLabel>{lens.chartLabel}</PanelLabel>
                {built && <LensChart lens={lens} reduceMotion={reduceMotion} />}
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

/* ════════ 02 · Presentation — a four-slide working deck, recomposed per
   audience. Craft modeled on the real LCAP board-deck register (hero-stat
   serif numeral, editorial eyebrows); genericized, no district named.
   Click the slide to advance; glyphs draw themselves in. ════════ */

type Audience = 'board' | 'staff' | 'families'
type GlyphName = 'chart' | 'bus' | 'calendar' | 'survey' | 'people' | 'building' | 'seal' | 'coins'

/* Line glyphs in the deck's visual voice: 24×24, 1.5px stroke, drawn on
   slide entry. */
function Glyph({ name, color = TEAL, delay = 0, reduceMotion }: { name: GlyphName; color?: string; delay?: number; reduceMotion: boolean }) {
  const paths: Record<GlyphName, string[]> = {
    chart: ['M3 21h18', 'M6 21v-7', 'M11 21V10', 'M16 21v-11', 'M21 21V6'],
    bus: ['M4 5h16v11H4z', 'M4 12h16', 'M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M8 8h.01M16 8h.01'],
    calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v5', 'M16 3v5', 'M8 14h3'],
    survey: ['M6 3h12v18H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3', 'M15.5 15.5l2 2 3-3.5'],
    people: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 21a6 6 0 0 1 12 0', 'M16 10a2.5 2.5 0 1 0 0-5', 'M17 15a5 5 0 0 1 4 6'],
    building: ['M5 21V5l7-3 7 3v16', 'M3 21h18', 'M9 9h.01M13 9h.01M9 13h.01M13 13h.01', 'M10 21v-4h4v4'],
    seal: ['M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M9.5 10.2l1.8 1.8 3.2-3.6', 'M8.5 14.5L7 21l5-2.5L17 21l-1.5-6.5'],
    coins: ['M8 10a5 3 0 1 0 0-6 5 3 0 0 0 0 6z', 'M3 7v5c0 1.7 2.2 3 5 3s5-1.3 5-3V7', 'M13 11c2.8 0 5 1.3 5 3v3c0 1.7-2.2 3-5 3s-5-1.3-5-3'],
  }
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true" className="shrink-0">
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

interface DeckContent {
  label: string
  coverEyebrow: string
  coverPlain: string
  coverItalic: string
  coverNote: string
  hero: string
  heroCaption: string
  evidencePoints: Array<[GlyphName, string]>
  nextEyebrow: string
  nextSteps: Array<[GlyphName, string, string]>
}

const DECKS: Record<Audience, DeckContent> = {
  board: {
    label: 'Board',
    coverEyebrow: 'Board study session · Enrollment & facilities',
    coverPlain: 'The feeder question, with the',
    coverItalic: 'evidence attached.',
    coverNote: 'Tonight: the five-year trend, the costs both ways, and a recommendation the room can act on.',
    hero: 'Year 2',
    heroCaption: 'when the two feeder patterns cross.',
    evidencePoints: [
      ['chart', 'Enrollment trend by feeder, five years, with the inflection named.'],
      ['bus', 'Transportation and staffing implications, costed both ways.'],
      ['seal', 'A recommendation the room can accept, amend, or decline.'],
    ],
    nextEyebrow: 'What happens next',
    nextSteps: [
      ['calendar', 'Study session', 'Tonight, with the full packet attached.'],
      ['survey', 'Public comment', 'Open through the spring window.'],
      ['seal', 'Board action', 'A vote only after both readings.'],
    ],
  },
  staff: {
    label: 'Staff',
    coverEyebrow: 'Feeder study · For site staff',
    coverPlain: 'What the feeder study means',
    coverItalic: 'for your school.',
    coverNote: 'The same figures the board sees, read for staffing, timelines, and your input window.',
    hero: 'Zero',
    heroCaption: 'involuntary transfers, in every scenario.',
    evidencePoints: [
      ['building', 'Site-by-site enrollment, so you can find your school in the trend.'],
      ['calendar', 'The decision timeline, with the dates that affect staffing first.'],
      ['survey', 'Your input window: the site survey stays open through February.'],
    ],
    nextEyebrow: 'What happens next',
    nextSteps: [
      ['survey', 'Site survey', 'Ten minutes; every response is read.'],
      ['people', 'Site meetings', 'Your principal hosts, questions welcome.'],
      ['calendar', 'Decision', 'No staffing change before the timeline says so.'],
    ],
  },
  families: {
    label: 'Families',
    coverEyebrow: 'Feeder study · A plain-language update',
    coverPlain: 'Two ways to keep both school communities',
    coverItalic: 'strong.',
    coverNote: 'What is being studied, what would never change, and how your family weighs in.',
    hero: 'Two years',
    heroCaption: 'to phase any change, with town halls first.',
    evidencePoints: [
      ['seal', 'What stays the same either way: teachers, programs, and school names.'],
      ['bus', 'What could change: some bus routes and start times, phased in.'],
      ['people', 'How families weigh in: town halls at both schools before any vote.'],
    ],
    nextEyebrow: 'What happens next',
    nextSteps: [
      ['people', 'Town halls', 'At both schools, evenings, translated.'],
      ['survey', 'Family survey', 'Five minutes, in your home language.'],
      ['calendar', 'The vote', 'Only after every town hall has met.'],
    ],
  },
}

const SLIDE_COUNT = 4

function DeckSlide({ deck, slide, reduceMotion }: { deck: DeckContent; slide: number; reduceMotion: boolean }) {
  if (slide === 0) {
    return (
      <div className="flex min-h-[320px] flex-col justify-center px-6 py-10 md:min-h-[380px] md:px-14">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
          {deck.coverEyebrow}
        </div>
        <div className="mt-5 max-w-[20ch] font-headline text-[30px] font-light leading-[1.12] tracking-[-0.015em] text-[#1a1816] md:text-[46px]">
          {deck.coverPlain} <span className="font-editorial italic text-[#6e6355]">{deck.coverItalic}</span>
        </div>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.35 }}
          className="mt-6 max-w-[52ch] font-body text-[13.5px] leading-[1.7] text-[#1a1816]/60 md:text-[14.5px]"
        >
          {deck.coverNote}
        </motion.p>
      </div>
    )
  }
  if (slide === 1) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center md:min-h-[380px]">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.34em] text-[#a8802a] md:text-[10px]">
          {deck.coverEyebrow}
        </div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeStandard }}
          className="mt-7 font-editorial text-[54px] font-normal italic leading-[0.95] text-[#1e3a5f] md:text-[80px]"
        >
          {deck.hero}
        </motion.div>
        <div className="mx-auto mt-4 max-w-[26ch] font-headline text-[19px] font-light leading-[1.2] text-[#1a1816] md:text-[26px]">
          {deck.heroCaption}
        </div>
      </div>
    )
  }
  if (slide === 2) {
    return (
      <div className="flex min-h-[320px] flex-col justify-center px-6 py-9 md:min-h-[380px] md:px-14">
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
  return (
    <div className="flex min-h-[320px] flex-col justify-center px-6 py-9 md:min-h-[380px] md:px-14">
      <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
        {deck.nextEyebrow}
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
            <span className="hidden md:block">Four-slide excerpt · Recomposed per audience</span>
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
              <span className="tabular-nums">{`0${slide + 1}`} / 04</span>
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
