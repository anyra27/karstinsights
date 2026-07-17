import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

/* ── The three build artifacts for the What Your Team Builds chapter.
   Each one demonstrates AI doing consequential work, not a surface a
   district could already buy: data that answers plain-English questions
   with the analysis written back, a deck that recomposes itself per
   audience, and an intake app that reads the request and drafts the
   reply. All content is synthetic demonstration data; the section
   caption states so on-screen. ── */

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

/* ════════ 01 · Ask the data — plain-English questions, the analysis
   and the writing come back done ════════ */

interface AskAnswer {
  question: string
  chip: string
  stats: Array<[string, string, string]>
  visual: 'sites' | 'bars' | 'projection'
  visualLabel: string
  read: string
}

const ASKS: AskAnswer[] = [
  {
    question: 'Which sites need attention before spring?',
    chip: 'Sites at risk',
    stats: [
      ['Sites off pace', '2 of 14', 'Both recoverable'],
      ['Students affected', '164', 'Concentrated, not spread'],
    ],
    visual: 'sites',
    visualLabel: 'Ranked by projected gap · spring target',
    read:
      'Two sites are off pace. Creekside is driven by one second-grade cohort, not a school-wide slide; North High drifts after lunch on Fridays. At the current trend both clear the target if outreach holds through March.',
  },
  {
    question: 'What is driving the facilities backlog?',
    chip: 'Facilities backlog',
    stats: [
      ['Share of aging requests', '71%', 'One trade: HVAC'],
      ['Blocked by one part', '5 requests', 'Same fan relay'],
    ],
    visual: 'bars',
    visualLabel: 'Aging requests by trade · past 30 days',
    read:
      'The backlog is not a staffing problem. HVAC holds 71 percent of aging requests, and five of them wait on the same fan relay. One bulk order clears half the aging list within a week.',
  },
  {
    question: 'Project enrollment by feeder for the next three years.',
    chip: 'Enrollment forecast',
    stats: [
      ['Crossover point', 'Yr 2', 'Feeder B passes A'],
      ['Range across scenarios', '±3%', 'Crossover holds in all'],
    ],
    visual: 'projection',
    visualLabel: 'Five years observed · three projected',
    read:
      'Feeder B passes Feeder A in year two. The crossover holds across all three birth-rate scenarios, which is why the consolidation question belongs on this spring’s board calendar rather than next year’s.',
  },
]

const RISK_SITES: Array<[string, number, string, 'watch' | 'good']> = [
  ['Creekside Elementary', 78, 'Gr. 2 cohort · 41 students', 'watch'],
  ['North High', 54, 'Fri afternoons · 123 students', 'watch'],
  ['Sierra Vista Middle', 22, 'Recovery holding 8 weeks', 'good'],
  ['Delta Vista Middle', 15, 'Outreach cycle working', 'good'],
]

const TRADE_BARS: Array<[string, number, string]> = [
  ['HVAC', 71, '71%'],
  ['Electrical', 12, '12%'],
  ['Grounds', 9, '9%'],
  ['Plumbing', 8, '8%'],
]

function SitesVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="grid gap-2.5">
      {RISK_SITES.map(([site, gap, note, status], i) => (
        <motion.div
          key={site}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.1 + i * 0.09, ease: easeStandard }}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-3 sm:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]"
        >
          <span className="truncate font-label text-[11px] font-semibold text-[#1a1816]">{site}</span>
          <span className="flex items-center gap-2">
            <motion.i
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `${gap}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.2 + i * 0.09, ease: easeStandard }}
              className="block h-1.5 rounded-[2px]"
              style={{
                background:
                  status === 'watch'
                    ? 'linear-gradient(90deg, rgba(165,71,49,0.8), rgba(165,71,49,0.45))'
                    : 'linear-gradient(90deg, rgba(45,90,90,0.6), rgba(45,90,90,0.3))',
              }}
            />
          </span>
          <span className="hidden truncate font-body text-[11px] text-[#1a1816]/55 sm:block">{note}</span>
        </motion.div>
      ))}
    </div>
  )
}

function BarsVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      {TRADE_BARS.map(([label, width, share], i) => (
        <div key={label} className="my-2.5 grid grid-cols-[74px_minmax(0,1fr)_34px] items-center gap-2.5">
          <span className="truncate font-label text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#1a1816]/70">
            {label}
          </span>
          <motion.i
            initial={reduceMotion ? false : { width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.15 + i * 0.08, ease: easeStandard }}
            className="block h-1.5 rounded-[2px]"
            style={{
              background:
                i === 0
                  ? 'linear-gradient(90deg, rgba(165,71,49,0.8), rgba(165,71,49,0.45))'
                  : 'linear-gradient(90deg, rgba(30,42,74,0.6), rgba(30,42,74,0.35))',
            }}
          />
          <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{share}</b>
        </div>
      ))}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.6 }}
        className="mt-3 font-body text-[11px] italic text-[#6e6355]"
      >
        5 aging requests share one part: fan relay, in stock at two suppliers.
      </motion.p>
    </div>
  )
}

function ProjectionVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 420 150" width="100%" aria-hidden="true">
      <g stroke="rgba(30,42,74,0.08)" strokeWidth="1">
        <line x1="0" y1="30" x2="420" y2="30" />
        <line x1="0" y1="68" x2="420" y2="68" />
        <line x1="0" y1="106" x2="420" y2="106" />
      </g>
      {/* today divider */}
      <line x1="252" y1="14" x2="252" y2="132" stroke="rgba(110,99,85,0.35)" strokeWidth="1" strokeDasharray="2 4" />
      <text x="245" y="10" fill="rgba(110,99,85,0.8)" fontFamily="Montserrat, sans-serif" fontSize="7.5" fontWeight="700" letterSpacing="1.5">
        NOW
      </text>
      {/* confidence band for feeder B beyond now */}
      <motion.path
        d="M252 58 C 300 48, 360 34, 412 24 L 412 52 C 360 58, 300 66, 252 64 Z"
        fill="rgba(168,128,42,0.1)"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: reduceMotion ? 0 : 1.1 }}
      />
      {/* observed */}
      <motion.path
        d="M8 66 C 70 70, 150 78, 200 84 S 240 90, 252 92"
        fill="none"
        stroke={NAVY}
        strokeWidth="2"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.1, ease: easeStandard }}
      />
      <motion.path
        d="M8 96 C 70 94, 150 84, 200 74 S 240 64, 252 61"
        fill="none"
        stroke={BRASS}
        strokeWidth="2"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.25, ease: easeStandard }}
      />
      {/* projected */}
      <motion.path
        d="M252 92 C 300 96, 360 100, 412 103"
        fill="none"
        stroke={NAVY}
        strokeWidth="1.8"
        strokeDasharray="4 5"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 1.05, ease: easeStandard }}
      />
      <motion.path
        d="M252 61 C 300 54, 360 44, 412 38"
        fill="none"
        stroke={BRASS}
        strokeWidth="1.8"
        strokeDasharray="4 5"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 1.2, ease: easeStandard }}
      />
      {/* crossover marker */}
      <motion.circle
        cx="318"
        cy="72"
        r="3.5"
        fill="none"
        stroke={BRASS}
        strokeWidth="1.5"
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: reduceMotion ? 0 : 1.9 }}
      />
      <motion.text
        x="300"
        y="126"
        fill="rgba(110,99,85,0.9)"
        fontFamily="Montserrat, sans-serif"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="1.2"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 2 }}
      >
        CROSSOVER · YR 2
      </motion.text>
      <g fill="rgba(110,99,85,0.7)" fontFamily="Montserrat, sans-serif" fontSize="8" letterSpacing="1.5">
        <text x="8" y="146">5 YRS AGO</text>
        <text x="238" y="146">TODAY</text>
        <text x="382" y="146">+3 YRS</text>
      </g>
    </svg>
  )
}

export function DashboardArtifact() {
  const [ask, setAsk] = useState(0)
  /* Which ask index has its answer revealed; switching asks derives back
     to unanswered without a reset effect. */
  const [answeredFor, setAnsweredFor] = useState(-1)
  const reduceMotion = Boolean(useReducedMotion())
  const active = ASKS[ask]
  const { shown: typedQuestion, done: questionDone } = useTypeStream(active.question, true, 60)
  const answered = answeredFor === ask

  useEffect(() => {
    if (!questionDone) return
    const t = setTimeout(() => setAnsweredFor(ask), reduceMotion ? 0 : 350)
    return () => clearTimeout(t)
  }, [questionDone, reduceMotion, ask])

  return (
    <ArtifactFrame url="built-with-karst / district-intelligence" chromeRight="Ask the data · Executive read">
      <div className="grid gap-4 p-4 md:p-6">
        {/* Ask bar */}
        <div className="flex items-center gap-3 rounded-[3px] border border-[#1a1816]/14 bg-[#fffcf7] px-4 py-3 shadow-[inset_0_1px_3px_rgba(26,24,22,0.04)]">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="rgba(110,99,85,0.7)" strokeWidth="1.4" />
            <path d="M9 9L12 12" stroke="rgba(110,99,85,0.7)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="min-h-[1.3em] font-body text-[13.5px] text-[#1a1816] md:text-[14.5px]">
            {typedQuestion}
            {!questionDone && (
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#a8802a]" aria-hidden="true" />
            )}
          </span>
        </div>

        {/* Question chips */}
        <div className="flex flex-wrap gap-2">
          {ASKS.map((entry, i) => (
            <button
              key={entry.chip}
              type="button"
              onClick={() => setAsk(i)}
              className={`rounded-[3px] border px-3 py-2 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                i === ask
                  ? 'border-[#a8802a] bg-[#a8802a]/[0.08] text-[#1a1816]'
                  : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
              }`}
            >
              {entry.chip}
            </button>
          ))}
        </div>

        {/* Answer */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ask}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: answered ? 1 : 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="grid gap-3.5"
          >
            <div className="grid gap-2.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
              <div className="grid content-start gap-2.5">
                {active.stats.map(([label, value, note]) => (
                  <div key={label} className="rounded-[3px] border border-[#1a1816]/10 px-3.5 py-3">
                    <div className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6e6355]">
                      {label}
                    </div>
                    <div className="mt-1 font-label text-[22px] font-extrabold tracking-[-0.01em] text-[#1a1816] md:text-[24px]">
                      {value}
                    </div>
                    <div className="mt-0.5 font-body text-[11px] font-medium text-[#a8802a]">{note}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5">
                <PanelLabel>{active.visualLabel}</PanelLabel>
                {answered && active.visual === 'sites' && <SitesVisual reduceMotion={reduceMotion} />}
                {answered && active.visual === 'bars' && <BarsVisual reduceMotion={reduceMotion} />}
                {answered && active.visual === 'projection' && <ProjectionVisual reduceMotion={reduceMotion} />}
              </div>
            </div>
            <StreamedRead label="The answer, written:" text={active.read} active={answered} />
          </motion.div>
        </AnimatePresence>
      </div>
    </ArtifactFrame>
  )
}

/* ════════ 02 · Presentation — one source, recomposed per audience ════════ */

type Audience = 'board' | 'staff' | 'families'

interface AudienceSlide {
  label: string
  eyebrow: string
  headlinePlain: string
  headlineItalic: string
  points: string[]
  foot: string
}

const AUDIENCE_SLIDES: Record<Audience, AudienceSlide> = {
  board: {
    label: 'Board',
    eyebrow: 'Enrollment & facilities · Study session',
    headlinePlain: 'Should we consolidate the two middle-school feeder patterns',
    headlineItalic: 'next fall?',
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
    headlinePlain: 'What the feeder study means',
    headlineItalic: 'for your school.',
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
    headlinePlain: 'Two ways to keep both school communities',
    headlineItalic: 'strong.',
    points: [
      'What stays the same either way: teachers, programs, and school names.',
      'What could change: some bus routes and start times, phased over two years.',
      'How families weigh in: town halls at both schools before any vote.',
    ],
    foot: 'Translated versions available · Town hall dates attached',
  },
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
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1816]/10 bg-[#f6f4ec] px-6 py-3 md:px-14">
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
              className="flex min-h-[330px] flex-col px-6 pb-5 pt-7 md:min-h-[400px] md:px-14 md:pb-8 md:pt-10"
            >
              <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
                {slide.eyebrow}
              </div>
              <div className="mb-auto mt-4 max-w-[24ch] font-headline text-[24px] font-light leading-[1.14] tracking-[-0.01em] text-[#1a1816] md:text-[38px]">
                {slide.headlinePlain}{' '}
                <span className="font-editorial italic text-[#6e6355]">{slide.headlineItalic}</span>
              </div>

              <div className="mt-7 grid items-center gap-6 md:mt-9 md:grid-cols-[1.25fr_1fr] md:gap-12">
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
                    <g
                      fill="rgba(110,99,85,0.85)"
                      fontFamily="Montserrat, sans-serif"
                      fontSize="7.5"
                      fontWeight="600"
                      letterSpacing="1"
                    >
                      <text x="238" y="104">FEEDER A</text>
                      <text x="240" y="24">FEEDER B</text>
                    </g>
                  </svg>
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

/* ════════ 03 · Application — the intake reads the request and
   drafts the reply ════════ */

const TRIAGE_TAGS: Array<[string, string]> = [
  ['Priority · Elevated', 'Two classes relocated'],
  ['Trade · HVAC', 'Fan never engages'],
  ['Likely part · Fan relay', 'Matched to 2 prior fixes at this site'],
]

const DRAFT_REPLY =
  'Received. An HVAC tech is assigned for tomorrow morning. Based on the symptoms this is likely the fan relay, which we stock. Keep the afternoon classes relocated through then; you will get a confirmation when the unit is running.'

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
    resetTimer.current = setTimeout(() => setSubmitted(false), 14000)
  }

  return (
    <ArtifactFrame url="built-with-karst / facilities-requests" chromeRight="Staff-built · AI-assisted intake">
      <div className="flex items-center justify-between gap-4 border-b border-[#1a1816]/10 bg-[#f6f4ec] px-5 py-3 md:px-7">
        <span className="flex items-center gap-2.5 font-label text-[10.5px] font-semibold text-[#1a1816] md:text-[11.5px]">
          <i className="h-2 w-2 rounded-full bg-[#1e2a4a]" aria-hidden="true" />
          Site facilities request
        </span>
        <span className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6e6355] md:text-[10px]">
          M. Alvarez · Sierra Vista Middle
        </span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1.05fr_1fr] md:gap-9 md:p-7">
        {/* the form — deliberately the easy part */}
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
              What happened?
            </span>
            <span className="min-h-[74px] rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-3.5 py-2.5 font-body text-[13.5px] leading-[1.55] text-[#1a1816]">
              No cooling since Tuesday morning. Two afternoon classes relocated. Unit hums but the fan
              never engages.
            </span>
            <span className="font-body text-[11px] italic text-[#6e6355]/80">
              One plain-language field. No category picklists; the system works them out.
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

        {/* the system reads it */}
        <div className="grid content-start gap-4 border-t border-[#1a1816]/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#a8802a] md:text-[10px]">
            {submitted ? 'The system reads it' : 'What happens on submit'}
          </div>

          {!submitted && (
            <p className="max-w-[38ch] font-body text-[13px] leading-[1.6] text-[#1a1816]/55">
              The request is read, classified, and routed. The likely fix is matched against past work
              at the site, and a reply to the teacher is drafted for the trades lead to approve.
            </p>
          )}

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  {TRIAGE_TAGS.map(([tag, evidence], i) => (
                    <motion.div
                      key={tag}
                      initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.3 + i * 0.45, ease: easeStandard }}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                    >
                      <span className="rounded-[3px] border border-[#a8802a]/40 bg-[#a8802a]/[0.07] px-2.5 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.1em] text-[#1a1816]">
                        {tag}
                      </span>
                      <span className="font-body text-[11px] italic text-[#6e6355]">&ldquo;{evidence}&rdquo;</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.7 }}
                  className="rounded-[3px] border border-[#1a1816]/12 bg-[#f6f4ec] px-4 py-3.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-label text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
                      Draft reply to M. Alvarez
                    </span>
                    <span className="rounded-[3px] border border-[#2d5a5a]/35 px-2 py-0.5 font-label text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#2d5a5a]">
                      Ready for review
                    </span>
                  </div>
                  <DraftReply active={submitted} reduceMotion={reduceMotion} />
                </motion.div>

                <motion.p
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : 2 }}
                  className="font-body text-[11px] italic text-[#6e6355]"
                >
                  The trades lead approves or edits before anything sends. On the district dashboard the
                  moment it lands.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ArtifactFrame>
  )
}

function DraftReply({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  /* The component unmounts when the demo resets, so start only ever
     needs to move forward; the delay leaves room for the triage tags. */
  const [start, setStart] = useState(false)

  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setStart(true), reduceMotion ? 0 : 2100)
    return () => clearTimeout(t)
  }, [active, reduceMotion])

  const { shown, done } = useTypeStream(DRAFT_REPLY, start, 140)

  return (
    <p className="min-h-[4.6em] font-body text-[12.5px] leading-[1.6] text-[#1a1816]/78">
      {shown}
      {start && !done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#a8802a]" aria-hidden="true" />
      )}
    </p>
  )
}
