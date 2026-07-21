/**
 * SkiSlides — a two-slide walk through a REAL module's Step 2.
 *
 * Ported from the Financial Literacy Studio's Self-Knowledge Inventory at
 * fidelity, as a bounded taste a visitor can step through:
 *   Slide 1 — the sort: 15 activities → energizing / draining (EnergyDrainPicker)
 *   Slide 2 — what the sort reveals: the RIASEC clustering radar, computed
 *             LIVE from the visitor's own picks (the real module's payoff beat)
 *
 * The radar reads what they actually sorted — energizers push the green
 * polygon outward by domain, drains sit inner in amber, and the headline
 * names their strongest cluster. Local state only; nothing saved. Green/amber
 * carry the meaning across both slides.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RiasecPreheatMap, { topEnergyDomains, DOMAIN_FULL_NAME } from './RiasecPreheatMap'

const GREEN = { text: '#047857', bg: '#ecfdf5', border: '#a7f3d0', edge: '#047857' }
const AMBER = { text: '#b45309', bg: '#fffbeb', border: '#fde68a', edge: '#b45309' }
const BRASS = '#a8802a'

type Sort = 'unsorted' | 'energizes' | 'drains'

const ACTIVITIES: { id: string; label: string; domain: string }[] = [
  { id: 'dissect-a-problem', label: 'Taking a complex problem apart to find the root cause', domain: 'Investigative' },
  { id: 'build-with-hands', label: 'Building or fixing something physical', domain: 'Realistic' },
  { id: 'lead-a-discussion', label: 'Leading a group discussion toward a decision', domain: 'Enterprising' },
  { id: 'open-ended-project', label: 'Working on a project with no single right answer', domain: 'Artistic' },
  { id: 'follow-clear-steps', label: 'Following a well-defined checklist or process', domain: 'Conventional' },
  { id: 'help-someone-stuck', label: 'Helping someone who is stuck figure out the next step', domain: 'Social' },
  { id: 'research-deep-dive', label: 'Going deep on a topic: reading, comparing, synthesizing', domain: 'Investigative' },
  { id: 'persuade-audience', label: 'Pitching or persuading an audience', domain: 'Enterprising' },
  { id: 'organize-data', label: 'Organizing messy data into a clean system', domain: 'Conventional' },
  { id: 'physical-outdoor', label: 'Working outdoors or with your body', domain: 'Realistic' },
  { id: 'make-something', label: 'Making something from scratch: art, writing, design, code', domain: 'Artistic' },
  { id: 'teach-explain', label: 'Teaching or explaining a concept until someone really gets it', domain: 'Social' },
  { id: 'rapid-iteration', label: 'Trying things fast, breaking them, figuring out why', domain: 'Investigative' },
  { id: 'plan-logistics', label: 'Planning out logistics so nothing falls through the cracks', domain: 'Conventional' },
  { id: 'navigate-ambiguity', label: 'Working in a situation where the path is not clear yet', domain: 'Artistic' },
]

function Mark({ kind }: { kind: 'energizes' | 'drains' }) {
  const c = kind === 'energizes' ? GREEN.text : AMBER.text
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0 mt-0.5">
      <line x1="2.5" y1="6.5" x2="10.5" y2="6.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      {kind === 'energizes' && <line x1="6.5" y1="2.5" x2="6.5" y2="10.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />}
    </svg>
  )
}

/* ════════════════ SLIDE 1 · the sort ════════════════ */
function EnergyDrainSlide({ sorts, onCycle }: { sorts: Record<string, Sort>; onCycle: (id: string) => void }) {
  const { e, d } = useMemo(() => {
    let e = 0
    let d = 0
    for (const a of ACTIVITIES) {
      if (sorts[a.id] === 'energizes') e++
      else if (sorts[a.id] === 'drains') d++
    }
    return { e, d }
  }, [sorts])
  const sorted = e + d
  const progress = Math.round((sorted / ACTIVITIES.length) * 100)

  return (
    <div>
      <div className="ghost-border bg-[#F0EEE6] px-4 py-3.5 mb-5 flex items-start gap-3">
        <span className="text-[13px] leading-none mt-1" style={{ color: BRASS }} aria-hidden>▶</span>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed m-0">
          <strong className="text-on-surface">You at 22, first week of a real job.</strong> Sort these
          for the version of you two years past graduation. Click to mark energizing or draining;
          click again to undo.
        </p>
      </div>

      <div className="ghost-border bg-surface px-4 py-3.5 mb-5">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <p className="font-label text-[10px] tracking-[0.22em] uppercase text-tertiary/70">Your profile so far</p>
          <p className="font-label text-[10px] tracking-[0.18em] uppercase text-on-surface-variant/55 tabular-nums">
            {sorted} of {ACTIVITIES.length} sorted
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: e, label: 'energizing', color: GREEN.text, kind: 'energizes' as const },
            { n: d, label: 'draining', color: AMBER.text, kind: 'drains' as const },
            { n: ACTIVITIES.length - sorted, label: 'unsorted', color: 'rgba(58,54,50,0.5)', kind: null },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              {s.kind ? <Mark kind={s.kind} /> : <span className="w-3 h-px" style={{ background: 'rgba(58,54,50,0.3)' }} aria-hidden />}
              <div>
                <p className="font-headline text-2xl leading-none tabular-nums" style={{ color: s.color }}>{s.n}</p>
                <p className="font-body text-xs text-on-surface-variant/75 leading-tight mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(30,42,74,0.1)' }}>
          <motion.div className="h-full rounded-full" style={{ background: BRASS }} initial={false} animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {ACTIVITIES.map((a) => {
          const sort = sorts[a.id] ?? 'unsorted'
          const tone = sort === 'energizes' ? GREEN : sort === 'drains' ? AMBER : null
          return (
            <motion.button
              key={a.id}
              type="button"
              onClick={() => onCycle(a.id)}
              whileTap={{ scale: 0.97 }}
              aria-pressed={sort !== 'unsorted'}
              className={`relative rounded-[3px] pl-4 pr-3.5 py-2.5 text-left transition-all duration-200 ${tone ? 'border border-l-[3px]' : 'ghost-border bg-surface'}`}
              style={tone ? { background: tone.bg, borderColor: tone.border, borderLeftColor: tone.edge } : undefined}
            >
              <div className="flex items-start justify-between gap-2.5">
                <p className="font-body text-[13px] text-on-surface leading-snug flex-1">{a.label}</p>
                <AnimatePresence mode="wait">
                  {sort !== 'unsorted' && (
                    <motion.span key={sort} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Mark kind={sort} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="font-label text-[9px] tracking-[0.15em] uppercase text-tertiary/60 mt-1.5">{a.domain}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════ SLIDE 2 · what the sort reveals ════════════════ */
function ClusteringSlide({ sorts }: { sorts: Record<string, Sort> }) {
  const { energizers, drainers, strongest, secondary } = useMemo(() => {
    const energizers = ACTIVITIES.filter((a) => sorts[a.id] === 'energizes').map((a) => a.id)
    const drainers = ACTIVITIES.filter((a) => sorts[a.id] === 'drains').map((a) => a.id)
    const codes = topEnergyDomains(energizers)
    return {
      energizers,
      drainers,
      strongest: codes[0] ? DOMAIN_FULL_NAME[codes[0]] : null,
      secondary: codes[1] ? DOMAIN_FULL_NAME[codes[1]] : null,
    }
  }, [sorts])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
      {/* copy */}
      <div>
        <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary/70 mb-3">What your sort reveals</p>
        <h3 className="font-headline text-3xl md:text-4xl text-on-surface leading-[1.05] mb-5">
          {strongest ? (
            <>
              Clustering toward{' '}
              <span className="text-tropical-gradient">{strongest}</span>
            </>
          ) : (
            'Your signal is forming'
          )}
        </h3>
        {strongest ? (
          <p className="font-body text-base text-on-surface-variant leading-relaxed mb-5">
            Your strongest signal lands in <strong className="text-on-surface">{strongest}</strong>
            {secondary ? (
              <>
                {' '}with secondary energy in <strong className="text-on-surface">{secondary}</strong>.
              </>
            ) : (
              '.'
            )}{' '}
            That cluster is the shape of work that fits you.
          </p>
        ) : (
          <p className="font-body text-base text-on-surface-variant leading-relaxed mb-5">
            Mark a few activities as energizing on the last slide. The more you sort, the clearer
            the cluster reads.
          </p>
        )}
        <p className="font-editorial italic text-sm text-on-surface-variant/70 border-l-2 pl-4" style={{ borderColor: 'rgba(30,42,74,0.12)' }}>
          In the full module, the strengths step comes next — checking whether your top-3 codes
          echo this clustering.
        </p>
      </div>

      {/* the radar — ported verbatim from the real module; reads the sort */}
      <div className="w-full">
        <RiasecPreheatMap energizers={energizers} drainers={drainers} />
      </div>
    </div>
  )
}

/* ════════════════ STEPPER ════════════════ */
export default function SkiSlides({ className = '' }: { className?: string }) {
  const [slide, setSlide] = useState(0)
  const [sorts, setSorts] = useState<Record<string, Sort>>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const userRef = useRef(false)

  function cycle(id: string) {
    userRef.current = true
    setSorts((prev) => {
      const cur = prev[id] ?? 'unsorted'
      const next: Sort = cur === 'unsorted' ? 'energizes' : cur === 'energizes' ? 'drains' : 'unsorted'
      return { ...prev, [id]: next }
    })
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let t: ReturnType<typeof setTimeout>
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true
            t = setTimeout(() => {
              if (!userRef.current)
                setSorts({ 'make-something': 'energizes', 'research-deep-dive': 'energizes', 'follow-clear-steps': 'drains' })
            }, 1400)
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return (
    <div ref={rootRef} className={className}>
      <div className="ghost-border bg-[#fffcf7] overflow-hidden">
        {/* app chrome — a real slide, live */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e2a4a]/[0.08]">
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(110,99,85,0.5)' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(110,99,85,0.5)' }} />
          <span className="font-label text-[10px] tracking-[0.18em] uppercase text-on-surface-variant/55 ml-2">
            self-knowledge inventory · step 2 of 6 · energy &amp; drain
          </span>
        </div>

        <div className="p-5 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {slide === 0 ? <EnergyDrainSlide sorts={sorts} onCycle={cycle} /> : <ClusteringSlide sorts={sorts} />}
            </motion.div>
          </AnimatePresence>

          {/* slide nav */}
          <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-[#1e2a4a]/[0.08]">
            <button
              type="button"
              onClick={() => setSlide(0)}
              disabled={slide === 0}
              className="font-label text-[11px] tracking-[0.16em] uppercase transition-colors disabled:opacity-0"
              style={{ color: 'rgba(30,42,74,0.55)' }}
            >
              ← Back
            </button>

            <div className="flex items-center gap-2" aria-hidden>
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="rounded-full transition-all"
                  style={{ width: i === slide ? 18 : 6, height: 6, background: i === slide ? BRASS : 'rgba(30,42,74,0.18)' }}
                />
              ))}
            </div>

            {slide === 0 ? (
              <button
                type="button"
                onClick={() => setSlide(1)}
                className="font-label text-[11px] tracking-[0.16em] uppercase py-2 px-4 rounded-[3px] transition-colors"
                style={{ border: `1px solid ${BRASS}`, color: BRASS }}
              >
                See what it reveals →
              </button>
            ) : (
              <span className="font-label text-[10px] tracking-[0.16em] uppercase text-on-surface-variant/45">
                2 of 2 · a real example
              </span>
            )}
          </div>

          <p className="font-label text-[9px] tracking-[0.16em] uppercase text-on-surface-variant/40 mt-4">
            Two real slides from the Self-Knowledge Inventory · nothing you do here is saved
          </p>
        </div>
      </div>
    </div>
  )
}
