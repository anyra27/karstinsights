import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

/* ── The three build artifacts for the What Your Team Builds chapter.
   Each maps to work Karst actually delivers: raw district exports
   processed with AI into an early-warning dashboard, one set of figures
   recomposed per audience, and a working tool the staff build that feeds
   a live dashboard. The AI does the analysis and helps build the tools;
   it is never shown as an agent living inside a shipped app. All content
   is synthetic demonstration data; the section caption states so. ── */

const BRASS = '#a8802a'
const NAVY = '#1e2a4a'

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

function ArtifactFrame({
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

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
      {children}
    </div>
  )
}

/* ════════ 01 · Dashboards — a season of raw exports, processed with AI
   into an early-warning picture. Directionally modeled on real district
   work (attendance × outcomes, ABC early-warning framework); all numbers
   and site names here are invented, no live data, no district named. ════════ */

const SOURCE_FILES: Array<[string, string]> = [
  ['attendance.xlsx', '18,600 rows'],
  ['grades · D/F list', '6,900 marks'],
  ['discipline.xlsx', '22,400 rows'],
  ['roster · demographics', '18,600 students'],
]

type LensKey = 'cliff' | 'early' | 'watchlist'
type ChartKind = 'columns' | 'curve' | 'ranked'

interface Lens {
  tab: string
  title: string
  stats: Array<[string, string, string]>
  chart: ChartKind
  chartLabel: string
  read: string
}

const LENSES: Record<LensKey, Lens> = {
  cliff: {
    tab: 'The cliff',
    title: 'Where attendance turns into failure',
    stats: [
      ['Cliff edge', 'Below 90%', 'Risk doubles here'],
      ['D/F rate under 85%', '58%', 'Vs 6% at near-perfect'],
    ],
    chart: 'columns',
    chartLabel: 'Course-failure rate by attendance band',
    read:
      'The pattern hides in the join. Below 90 percent attendance, course-failure rates roughly double; below 85, most of a cohort is failing something. Attendance is not a side metric, it is the leading edge of the outcome.',
  },
  early: {
    tab: 'Early signal',
    title: 'The flag that shows up in week four',
    stats: [
      ['Earliest reliable flag', 'Week 4', 'First-month absences'],
      ['2+ early absences', '5× risk', 'Vs a clean first month'],
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
      ['Flagged this fall', '412', 'Across 14 sites'],
      ['Caught by attendance alone', '8 in 10', 'Weeks before the first F'],
    ],
    chart: 'ranked',
    chartLabel: 'Flagged students by site · highest need first',
    read:
      'The dashboard ends where the work starts: a ranked, de-identified watchlist the district can turn back into real names on its own side. Each flag carries why it fired, so outreach is targeted, not district-wide.',
  },
}

/* Column chart — the cliff, read as a rising wall of risk */
const CLIFF_COLS: Array<[string, number, string, boolean]> = [
  ['95–100%', 6, '6%', false],
  ['90–94%', 14, '14%', false],
  ['85–89%', 31, '31%', true],
  ['Below 85%', 58, '58%', true],
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
      {CLIFF_COLS.map(([label, val, tag, hot], i) => {
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
              fill={hot ? 'rgba(165,71,49,0.72)' : 'rgba(30,42,74,0.6)'}
            />
            <motion.text
              x={x + colW / 2}
              y={baseY - h - 6}
              textAnchor="middle"
              fill={hot ? '#a54731' : '#1a1816'}
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

/* Area + line curve — the early-warning ramp */
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
        fill="rgba(165,71,49,0.1)"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="#a54731"
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
          fill={i === 2 ? '#a54731' : '#fffcf7'}
          stroke="#a54731"
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
        fill="#a54731"
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
                ? 'linear-gradient(90deg, rgba(165,71,49,0.85), rgba(165,71,49,0.5))'
                : 'linear-gradient(90deg, rgba(30,42,74,0.7), rgba(30,42,74,0.4))',
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
  ['Attendance alone', 62, '#a54731'],
  ['+ Grades', 26, '#a8802a'],
  ['All three signals', 12, '#1e2a4a'],
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
            <span className="hidden text-[#a8802a] md:block" aria-hidden="true">→</span>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: built ? 1 : 0.4 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#1a1816]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2d5a5a]" aria-hidden="true" />
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
                  ? 'border-[#a8802a] bg-[#a8802a]/[0.08] text-[#1a1816]'
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
                {lens.stats.map(([label, value, note]) => (
                  <div key={label} className="rounded-[3px] border border-[#1a1816]/10 px-3.5 py-3">
                    <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                      {label}
                    </div>
                    <div className="mt-1 font-label text-[21px] font-extrabold tracking-[-0.01em] text-[#1a1816] md:text-[23px]">
                      {value}
                    </div>
                    <div className="mt-0.5 font-body text-[11px] font-medium text-[#a8802a]">{note}</div>
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
      </div>
    </ArtifactFrame>
  )
}

/* ════════ 02 · Presentation — one source, recomposed per audience.
   Craft modeled on the real LCAP board deck (hero-stat register, serif
   numeral, editorial eyebrows); genericized, no district named. ════════ */

type Audience = 'board' | 'staff' | 'families'

interface AudienceSlide {
  label: string
  eyebrow: string
  hero: string
  heroCaption: string
  points: string[]
  foot: string
}

const AUDIENCE_SLIDES: Record<Audience, AudienceSlide> = {
  board: {
    label: 'Board',
    eyebrow: 'Enrollment & facilities · Study session',
    hero: 'Year 2',
    heroCaption: 'when the two feeder patterns cross.',
    points: [
      'Enrollment trend by feeder, five years, with the inflection named.',
      'Transportation and staffing implications, costed both ways.',
      'A recommendation the room can accept, amend, or decline.',
    ],
    foot: 'Evidence attached · Recommendation on slide 12',
  },
  staff: {
    label: 'Staff',
    eyebrow: 'Feeder study · What it means for your site',
    hero: 'Zero',
    heroCaption: 'involuntary transfers, in every scenario.',
    points: [
      'No involuntary transfers in any scenario under study.',
      'The decision timeline, with the dates that affect staffing first.',
      'Your input window: the site survey stays open through February.',
    ],
    foot: 'Site-level detail attached · Questions to your principal',
  },
  families: {
    label: 'Families',
    eyebrow: 'Feeder study · A plain-language update',
    hero: 'Two years',
    heroCaption: 'to phase any change, with town halls first.',
    points: [
      'What stays the same either way: teachers, programs, and school names.',
      'What could change: some bus routes and start times, phased in.',
      'How families weigh in: town halls at both schools before any vote.',
    ],
    foot: 'Translated versions available · Town hall dates attached',
  },
}

function FeederChart({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 320 112" width="100%" aria-hidden="true">
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
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.15, ease: easeStandard }}
      />
      <motion.path
        d="M10 62 C 70 60, 130 56, 190 50 S 290 36, 310 32"
        fill="none"
        stroke={BRASS}
        strokeWidth="1.6"
        strokeDasharray="3 5"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: easeStandard }}
      />
      <circle cx="310" cy="88" r="3" fill={NAVY} />
      <circle cx="310" cy="32" r="3" fill={BRASS} />
      <circle cx="196" cy="55" r="3.5" fill="none" stroke={BRASS} strokeWidth="1.4" />
      <g fill="rgba(110,99,85,0.85)" fontFamily="Montserrat, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1">
        <text x="238" y="104">FEEDER A</text>
        <text x="240" y="24">FEEDER B</text>
      </g>
    </svg>
  )
}

export function PresentationArtifact() {
  const [audience, setAudience] = useState<Audience>('board')
  const reduceMotion = Boolean(useReducedMotion())
  const slide = AUDIENCE_SLIDES[audience]

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
              {(Object.keys(AUDIENCE_SLIDES) as Audience[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAudience(key)}
                  className={`rounded-[3px] border px-3 py-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    audience === key
                      ? 'border-[#a8802a] bg-[#a8802a]/[0.08] text-[#1a1816]'
                      : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
                  }`}
                >
                  {AUDIENCE_SLIDES[key].label}
                </button>
              ))}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={audience}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: easeStandard }}
              className="flex min-h-[360px] flex-col px-6 pb-5 pt-8 md:min-h-[420px] md:px-12 md:pb-8 md:pt-12"
            >
              <div className="text-center font-label text-[9px] font-semibold uppercase tracking-[0.34em] text-[#a8802a] md:text-[10px]">
                {slide.eyebrow}
              </div>

              {/* hero stat — the LCAP register: one serif numeral does the work */}
              <div className="mb-auto mt-6 text-center md:mt-8">
                <div className="font-editorial text-[52px] font-normal italic leading-[0.95] text-[#1e2a4a] md:text-[76px]">
                  {slide.hero}
                </div>
                <div className="mx-auto mt-4 max-w-[26ch] font-headline text-[19px] font-light leading-[1.2] text-[#1a1816] md:text-[26px]">
                  {slide.heroCaption}
                </div>
              </div>

              {/* supporting evidence — chart + the recomposed points */}
              <div className="mt-8 grid items-center gap-6 border-t border-[#1a1816]/10 pt-6 md:mt-10 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
                <div>
                  <PanelLabel>Enrollment by feeder · five years</PanelLabel>
                  <FeederChart reduceMotion={reduceMotion} />
                </div>
                <div className="grid content-center gap-3 font-body text-[13px] text-[#1a1816]/70 md:text-[13.5px]">
                  {slide.points.map((point, i) => (
                    <motion.span
                      key={point}
                      initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2 + i * 0.12, ease: easeStandard }}
                      className="block border-l-2 border-[#a8802a] pl-3.5"
                    >
                      {point}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-baseline justify-between gap-3 border-t border-[#1a1816]/10 pt-4 font-label text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#6e6355] md:mt-10 md:text-[9.5px]">
                <span>
                  <b className="font-semibold text-[#1a1816]">KARST</b> · Feeder study
                </span>
                <span className="hidden md:block">{slide.foot}</span>
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
              </div>
            </motion.div>
          </AnimatePresence>
        </ArtifactFrame>
      </div>
    </div>
  )
}

/* ════════ 03 · Applications — a working tool the staff build. Submit a
   request, get a confirmation, and watch the front-end form flip into the
   back-end operations dashboard the same team built. The AI helped BUILD
   both sides and analyzes what they collect; it never sits inside the app
   as an agent. ════════ */

type AppStage = 'form' | 'success' | 'dashboard'

interface OpsRow {
  id: string
  where: string
  tag: string
  when: string
  status: 'new' | 'open' | 'progress' | 'closed'
}

const OPS_ROWS: OpsRow[] = [
  { id: 'r1', where: 'Gym · court lights out', tag: 'Electrical', when: '2h ago', status: 'progress' },
  { id: 'r2', where: 'Room 118 · sink leak', tag: 'Plumbing', when: 'Yesterday', status: 'open' },
  { id: 'r3', where: 'Front lot · gate stuck', tag: 'Grounds', when: 'Yesterday', status: 'progress' },
  { id: 'r4', where: 'Library · projector', tag: 'Electrical', when: '2 days', status: 'closed' },
  { id: 'r5', where: 'Cafeteria · walk-in cooler', tag: 'HVAC', when: '3 days', status: 'progress' },
]

const NEW_OPS_ROW: OpsRow = { id: 'r0', where: 'Room 214 · no cooling', tag: 'HVAC', when: 'Just now', status: 'new' }

const OPS_KPIS: Array<[string, string, string]> = [
  ['Open requests', '38', '+1 just now'],
  ['Median time to close', '3.2d', 'Was 9 days'],
  ['Aging past 30 days', '05', 'All parts-blocked'],
]

const OPS_TRADES: Array<[string, number, string]> = [
  ['HVAC', 74, '14'],
  ['Electrical', 46, '9'],
  ['Grounds', 38, '7'],
  ['Plumbing', 24, '4'],
]

const STATUS_PILL: Record<OpsRow['status'], string> = {
  new: 'border-[#a8802a]/45 bg-[#a8802a]/[0.1] text-[#8a6a1f]',
  open: 'border-[#1a1816]/15 text-[#6e6355]',
  progress: 'border-[#2d5a5a]/35 text-[#2d5a5a]',
  closed: 'border-[#1a1816]/12 text-[#1a1816]/40',
}

const STATUS_LABEL: Record<OpsRow['status'], string> = {
  new: 'New',
  open: 'Open',
  progress: 'In progress',
  closed: 'Closed',
}

function OpsTable({ rows, reduceMotion }: { rows: OpsRow[]; reduceMotion: boolean }) {
  return (
    <div className="overflow-hidden rounded-[3px] border border-[#1a1816]/10 bg-[#fffcf7]">
      <div
        className="grid grid-cols-[minmax(0,1.5fr)_84px_74px] gap-2 border-b border-[#1a1816]/[0.07] px-4 py-2 font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6e6355]/70 sm:grid-cols-[minmax(0,1.6fr)_84px_92px_66px]"
        aria-hidden="true"
      >
        <span>Request</span>
        <span>Trade</span>
        <span className="hidden sm:block">Status</span>
        <span className="text-right">When</span>
      </div>
      {rows.map((row, i) => (
        <motion.div
          key={row.id}
          initial={row.status === 'new' && !reduceMotion ? { opacity: 0, backgroundColor: 'rgba(168,128,42,0.16)' } : false}
          animate={{ opacity: 1, backgroundColor: 'rgba(168,128,42,0)' }}
          transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : (row.status === 'new' ? 0.1 : 0.1 + i * 0.04), ease: easeStandard }}
          className="grid grid-cols-[minmax(0,1.5fr)_84px_74px] items-center gap-2 border-b border-[#1a1816]/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_84px_92px_66px]"
        >
          <span className="truncate font-body text-[12.5px] text-[#1a1816]">{row.where}</span>
          <span className="font-label text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6e6355]">
            {row.tag}
          </span>
          <span className="hidden sm:block">
            <em className={`rounded-[3px] border px-2 py-1 font-label text-[7.5px] font-bold not-italic uppercase tracking-[0.1em] ${STATUS_PILL[row.status]}`}>
              {STATUS_LABEL[row.status]}
            </em>
          </span>
          <span className="text-right font-label text-[8.5px] uppercase tracking-[0.06em] text-[#6e6355]/80">
            {row.when}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export function ApplicationArtifact() {
  const [stage, setStage] = useState<AppStage>('form')
  const reduceMotion = Boolean(useReducedMotion())
  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearTimeout(stageTimer.current)
    }
  }, [])

  const submit = () => {
    if (reduceMotion) {
      setStage('dashboard')
      return
    }
    setStage('success')
    if (stageTimer.current) clearTimeout(stageTimer.current)
    stageTimer.current = setTimeout(() => setStage('dashboard'), 1500)
  }

  const reset = () => {
    if (stageTimer.current) clearTimeout(stageTimer.current)
    setStage('form')
  }

  const rows = [NEW_OPS_ROW, ...OPS_ROWS]

  return (
    <ArtifactFrame url="built-with-karst / facilities-tool" chromeRight="Staff-built · Front end to back end">
      <AnimatePresence mode="wait" initial={false}>
        {/* ---- FORM: the teacher-facing side ---- */}
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: easeStandard }}
            className="mx-auto max-w-xl p-5 md:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#1a1816]/10 pb-4">
              <span className="flex items-center gap-2.5">
                <i className="h-2 w-2 rounded-full bg-[#1e2a4a]" aria-hidden="true" />
                <span className="font-label text-[10.5px] font-semibold text-[#1a1816] md:text-[11.5px]">
                  Site facilities request
                </span>
              </span>
              <span className="rounded-[3px] border border-[#1a1816]/12 px-2.5 py-1 font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                Staff tool
              </span>
            </div>
            <div className="grid content-start gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                {(
                  [
                    ['Site', 'Grandview Middle'],
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
              </div>
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
                <span className="min-h-[58px] rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-3.5 py-2.5 font-body text-[13px] leading-[1.55] text-[#1a1816]">
                  No cooling since Tuesday. Two afternoon classes relocated.
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3.5">
                <motion.button
                  type="button"
                  onClick={submit}
                  className="group inline-flex items-center gap-2.5 rounded-[3px] bg-[#1a1816] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6]"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            '0 0 0 0 rgba(168,128,42,0)',
                            '0 0 0 7px rgba(168,128,42,0.14)',
                            '0 0 0 0 rgba(168,128,42,0)',
                          ],
                        }
                  }
                  transition={reduceMotion ? undefined : { duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ y: -1, backgroundColor: '#0e0e0c' }}
                >
                  Submit request
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    →
                  </span>
                </motion.button>
                {!reduceMotion && (
                  <motion.span
                    className="flex items-center gap-1 font-body text-[11px] italic text-[#a8802a]"
                    animate={{ opacity: [0.55, 1, 0.55], x: [0, 3, 0] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span aria-hidden="true">←</span> try it
                  </motion.span>
                )}
              </div>
              <span className="font-body text-[11px] italic text-[#6e6355]/80">
                Built by the operations team in a Fieldwork session, with AI-assisted coding. Nothing
                is sent.
              </span>
            </div>
          </motion.div>
        )}

        {/* ---- SUCCESS: the beat between ---- */}
        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1.4, 0.4, 1] }}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2d5a5a]/40 bg-[#2d5a5a]/[0.08]"
            >
              <motion.svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <motion.path
                  d="M6 13.5L11 18.5L20 8"
                  stroke="#2d5a5a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.2, ease: easeStandard }}
                />
              </motion.svg>
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <div className="font-headline text-2xl font-light text-[#1a1816]">Request submitted.</div>
              <div className="mt-2 font-body text-[13px] text-[#1a1816]/60">
                #4127 logged to District Operations. Routing now…
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ---- DASHBOARD: the back-end the same team built ---- */}
        {stage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeStandard }}
            className="p-4 md:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d5a5a]/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2d5a5a]" />
                </span>
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-[#1a1816]">
                  District operations · live
                </span>
              </span>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6e6355] transition-colors hover:text-[#1a1816]"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M8.5 5a3.5 3.5 0 1 1-1-2.45M8.5 1v2h-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Log another
              </button>
            </div>

            <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
              <div className="grid content-start gap-3">
                <div className="grid grid-cols-3 gap-2.5">
                  {OPS_KPIS.map(([label, value, note], i) => (
                    <motion.div
                      key={label}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.1 + i * 0.06, ease: easeStandard }}
                      className="rounded-[3px] border border-[#1a1816]/10 px-3 py-2.5"
                    >
                      <div className="font-label text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#6e6355]">
                        {label}
                      </div>
                      <div className="mt-1 font-label text-[20px] font-extrabold tracking-[-0.01em] text-[#1a1816]">
                        {value}
                      </div>
                      <div className="mt-0.5 font-body text-[10px] font-medium text-[#a8802a]">{note}</div>
                    </motion.div>
                  ))}
                </div>
                <OpsTable rows={rows} reduceMotion={reduceMotion} />
              </div>

              <div className="grid content-start gap-3">
                <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5">
                  <PanelLabel>Open requests by trade</PanelLabel>
                  {OPS_TRADES.map(([label, width, count], i) => (
                    <div key={label} className="my-2 grid grid-cols-[68px_minmax(0,1fr)_26px] items-center gap-2.5">
                      <span className="truncate font-label text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#1a1816]/70">
                        {label}
                      </span>
                      <motion.i
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.25 + i * 0.07, ease: easeStandard }}
                        className="block h-1.5 rounded-[2px]"
                        style={{
                          background:
                            i === 0
                              ? 'linear-gradient(90deg, rgba(165,71,49,0.8), rgba(165,71,49,0.45))'
                              : 'linear-gradient(90deg, rgba(30,42,74,0.6), rgba(30,42,74,0.35))',
                        }}
                      />
                      <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{count}</b>
                    </div>
                  ))}
                </div>
                <p className="rounded-[3px] border-l-2 border-[#a8802a] bg-[#f6f4ec] px-3.5 py-3 font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
                  Same team, both sides. The teacher’s form and this operations view were built together
                  in Fieldwork; every submission lands here the moment it is sent.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ArtifactFrame>
  )
}


