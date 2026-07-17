import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'
import { ArtifactFrame, GREEN, PanelLabel, TEAL_BRIGHT } from './WhatTeamsBuildArtifacts'

/* ── 03 · Applications — two working tools the staff build, behind one
   switcher. Every control is live; submissions land on the back-end
   surface the same team built. The AI helped BUILD both sides and
   analyzes what they collect; it never sits inside the app as an agent.
   All names and records are invented; nothing is sent. ── */

/* ════════ Shared bits ════════ */

const FIELD_LABEL = 'font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#6e6355]'
const INPUT_BOX =
  'rounded-[3px] border border-[#1a1816]/12 bg-[#fffcf7] px-3.5 py-2.5 font-body text-[13.5px] text-[#1a1816] focus:border-[#2d8a8a] focus:outline-none'

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[3px] border px-3 py-2 font-label text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-colors ${
        active
          ? 'border-[#0f4c4c] bg-[#0f4c4c]/[0.07] text-[#1a1816]'
          : 'border-[#1a1816]/12 text-[#6e6355] hover:text-[#1a1816]'
      }`}
    >
      {label}
    </button>
  )
}

function PulseSubmit({
  label,
  onClick,
  reduceMotion,
  cue,
}: {
  label: string
  onClick: () => void
  reduceMotion: boolean
  cue?: string
}) {
  return (
    <div className="flex items-center gap-3.5">
      <motion.button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-2.5 rounded-[3px] bg-[#1a1816] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6]"
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: [
                  '0 0 0 0 rgba(45,138,138,0)',
                  '0 0 0 7px rgba(45,138,138,0.15)',
                  '0 0 0 0 rgba(45,138,138,0)',
                ],
              }
        }
        transition={reduceMotion ? undefined : { duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ y: -1, backgroundColor: '#0e0e0c' }}
      >
        {label}
        <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
          →
        </span>
      </motion.button>
      {cue && !reduceMotion && (
        <motion.span
          className="flex items-center gap-1 font-body text-[11px] italic text-[#2d8a8a]"
          animate={{ opacity: [0.55, 1, 0.55], x: [0, 3, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span aria-hidden="true">←</span> {cue}
        </motion.span>
      )}
    </div>
  )
}

function SuccessBeat({ title, detail }: { title: string; detail: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1.4, 0.4, 1] }}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#10B981]/40 bg-[#10B981]/[0.08]"
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <motion.path
            d="M6 13.5L11 18.5L20 8"
            stroke={GREEN}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.2, ease: easeStandard }}
          />
        </svg>
      </motion.span>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <div className="font-headline text-2xl font-light text-[#1a1816]">{title}</div>
        <div className="mt-2 font-body text-[13px] text-[#1a1816]/60">{detail}</div>
      </motion.div>
    </motion.div>
  )
}

function LiveHeader({ label, onReset }: { label: string; onReset: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <span className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981]/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
        </span>
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-[#1a1816]">{label}</span>
      </span>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6e6355] transition-colors hover:text-[#1a1816]"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M8.5 5a3.5 3.5 0 1 1-1-2.45M8.5 1v2h-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Start over
      </button>
    </div>
  )
}

/* ════════ Tool A · Facilities request — every control live ════════ */

type AppStage = 'form' | 'success' | 'done'

const SITES = ['Grandview Middle', 'Harbor View High', 'Cedar Hollow Elementary', 'Northfield Middle']
const CATEGORIES = ['HVAC', 'Electrical', 'Plumbing', 'Grounds']
const URGENCIES = ['Routine', 'This week', 'Today']

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

const BASE_TRADES: Array<[string, number]> = [
  ['HVAC', 14],
  ['Electrical', 9],
  ['Grounds', 7],
  ['Plumbing', 4],
]

const STATUS_PILL: Record<OpsRow['status'], string> = {
  new: 'border-[#2d8a8a]/50 bg-[#2d8a8a]/[0.1] text-[#0f4c4c]',
  open: 'border-[#1a1816]/15 text-[#6e6355]',
  progress: 'border-[#2d5f8f]/40 text-[#2d5f8f]',
  closed: 'border-[#10B981]/35 text-[#10B981]',
}

const STATUS_LABEL: Record<OpsRow['status'], string> = {
  new: 'New',
  open: 'Open',
  progress: 'In progress',
  closed: 'Closed',
}

function FacilitiesTool({ reduceMotion }: { reduceMotion: boolean }) {
  const [stage, setStage] = useState<AppStage>('form')
  const [site, setSite] = useState(SITES[0])
  const [category, setCategory] = useState('HVAC')
  const [urgency, setUrgency] = useState('This week')
  const [details, setDetails] = useState('No cooling since Tuesday. Two afternoon classes relocated.')
  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearTimeout(stageTimer.current)
    }
  }, [])

  const submit = () => {
    if (reduceMotion) {
      setStage('done')
      return
    }
    setStage('success')
    if (stageTimer.current) clearTimeout(stageTimer.current)
    stageTimer.current = setTimeout(() => setStage('done'), 1500)
  }

  const reset = () => {
    if (stageTimer.current) clearTimeout(stageTimer.current)
    setStage('form')
  }

  const shortDetail = details.trim().split(/[.\n]/)[0].slice(0, 34) || 'New request'
  const newRow: OpsRow = { id: 'r0', where: `${shortDetail}`, tag: category, when: 'Just now', status: 'new' }
  const rows = [newRow, ...OPS_ROWS]
  const trades = BASE_TRADES.map(([t, n]) => [t, t === category ? n + 1 : n] as [string, number])
  const maxTrade = Math.max(...trades.map(([, n]) => n))

  return (
    <AnimatePresence mode="wait" initial={false}>
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
              <i className="h-2 w-2 rounded-full bg-[#0f4c4c]" aria-hidden="true" />
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
              <div className="grid gap-1.5">
                <label className={FIELD_LABEL} htmlFor="fac-site">
                  Site
                </label>
                <select
                  id="fac-site"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className={`${INPUT_BOX} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22><path d=%22M1 1l4 4 4-4%22 stroke=%22%236e6355%22 fill=%22none%22 stroke-width=%221.4%22 stroke-linecap=%22round%22/></svg>')] bg-[right_12px_center] bg-no-repeat pr-8`}
                >
                  {SITES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <label className={FIELD_LABEL} htmlFor="fac-loc">
                  Location
                </label>
                <input id="fac-loc" defaultValue="Room 214 · Science wing" className={INPUT_BOX} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <span className={FIELD_LABEL}>Category</span>
              <span className="flex flex-wrap gap-2">
                {CATEGORIES.map((chip) => (
                  <Chip key={chip} label={chip} active={category === chip} onClick={() => setCategory(chip)} />
                ))}
              </span>
            </div>
            <div className="grid gap-1.5">
              <span className={FIELD_LABEL}>Urgency</span>
              <span className="flex flex-wrap gap-2">
                {URGENCIES.map((chip) => (
                  <Chip key={chip} label={chip} active={urgency === chip} onClick={() => setUrgency(chip)} />
                ))}
              </span>
            </div>
            <div className="grid gap-1.5">
              <label className={FIELD_LABEL} htmlFor="fac-details">
                Details
              </label>
              <textarea
                id="fac-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                className={`${INPUT_BOX} resize-none leading-[1.55]`}
              />
            </div>
            <div className="mt-1">
              <PulseSubmit label="Submit request" onClick={submit} reduceMotion={reduceMotion} cue="try it, edit anything" />
            </div>
            <span className="font-body text-[11px] italic text-[#6e6355]/80">
              Built by the operations team in a Fieldwork session, with AI-assisted coding. Nothing is
              sent.
            </span>
          </div>
        </motion.div>
      )}

      {stage === 'success' && (
        <SuccessBeat
          key="success"
          title="Request submitted."
          detail={`#4127 · ${site} · ${category} · logged to District Operations. Routing now…`}
        />
      )}

      {stage === 'done' && (
        <motion.div
          key="done"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeStandard }}
          className="p-4 md:p-6"
        >
          <LiveHeader label="District operations · live" onReset={reset} />
          <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div className="grid content-start gap-3">
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    ['Open requests', '38', '+1 just now', 'text-[#2d8a8a]'],
                    ['Median time to close', '3.2d', 'Was 9 days', 'text-[#10B981]'],
                    ['Aging past 30 days', '05', 'All parts-blocked', 'text-[#a66a06]'],
                  ] as const
                ).map(([label, value, note, tone], i) => (
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
                    <div className={`mt-0.5 font-body text-[10px] font-medium ${tone}`}>{note}</div>
                  </motion.div>
                ))}
              </div>
              <div className="overflow-hidden rounded-[3px] border border-[#1a1816]/10 bg-[#fffcf7]">
                <div
                  className="grid grid-cols-[minmax(0,1.5fr)_74px_66px] gap-2 border-b border-[#1a1816]/[0.07] px-4 py-2 font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6e6355]/70 sm:grid-cols-[minmax(0,1.6fr)_84px_92px_66px]"
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
                    initial={
                      row.status === 'new' && !reduceMotion
                        ? { opacity: 0, backgroundColor: 'rgba(45,138,138,0.14)' }
                        : false
                    }
                    animate={{ opacity: 1, backgroundColor: 'rgba(45,138,138,0)' }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.9,
                      delay: reduceMotion ? 0 : row.status === 'new' ? 0.1 : 0.1 + i * 0.04,
                      ease: easeStandard,
                    }}
                    className="grid grid-cols-[minmax(0,1.5fr)_74px_66px] items-center gap-2 border-b border-[#1a1816]/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_84px_92px_66px]"
                  >
                    <span className="truncate font-body text-[12.5px] text-[#1a1816]">{row.where}</span>
                    <span className="font-label text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6e6355]">
                      {row.tag}
                    </span>
                    <span className="hidden sm:block">
                      <em
                        className={`rounded-[3px] border px-2 py-1 font-label text-[7.5px] font-bold not-italic uppercase tracking-[0.1em] ${STATUS_PILL[row.status]}`}
                      >
                        {STATUS_LABEL[row.status]}
                      </em>
                    </span>
                    <span className="text-right font-label text-[8.5px] uppercase tracking-[0.06em] text-[#6e6355]/80">
                      {row.when}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid content-start gap-3">
              <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5">
                <PanelLabel>Open requests by trade</PanelLabel>
                {trades.map(([label, count], i) => (
                  <div key={label} className="my-2 grid grid-cols-[68px_minmax(0,1fr)_26px] items-center gap-2.5">
                    <span className="truncate font-label text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#1a1816]/70">
                      {label}
                    </span>
                    <motion.i
                      initial={reduceMotion ? false : { width: 0 }}
                      animate={{ width: `${(count / maxTrade) * 92}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.25 + i * 0.07, ease: easeStandard }}
                      className="block h-1.5 rounded-[2px]"
                      style={{
                        background:
                          label === category
                            ? `linear-gradient(90deg, ${TEAL_BRIGHT}, rgba(45,138,138,0.5))`
                            : `linear-gradient(90deg, rgba(15,76,76,0.65), rgba(15,76,76,0.35))`,
                      }}
                    />
                    <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{count}</b>
                  </div>
                ))}
              </div>
              <p className="rounded-[3px] border-l-2 border-[#2d8a8a] bg-[#f6f4ec] px-3.5 py-3 font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
                Same team, both sides. Your request from {site} landed as {category.toLowerCase()},
                marked {urgency.toLowerCase()}; the counts above already moved.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ════════ Tool B · Course proposal walkthrough — ed services ════════ */

const WALK_STEPS = ['Course basics', 'Standards', 'Materials & cost', 'Review'] as const
const DEPARTMENTS = ['Science', 'CTE', 'English', 'Math']
const GRADE_BANDS = ['9–10', '10–11', '11–12']
const STANDARDS: Array<[string, string]> = [
  ['ENV-1', 'Analyze local ecosystem data across a full season'],
  ['ENV-2', 'Model resource use with real consumption figures'],
  ['DATA-3', 'Communicate findings to a public audience'],
  ['CTE-7', 'Document fieldwork in an industry-standard portfolio'],
]
const FUNDING = ['General fund', 'CTE grant', 'Site budget']

interface ProposalRow {
  id: string
  title: string
  dept: string
  status: 'new' | 'review' | 'board' | 'adopted'
  when: string
}

const PROPOSAL_ROWS: ProposalRow[] = [
  { id: 'p1', title: 'Intro to Data Journalism', dept: 'English', status: 'review', when: 'Last week' },
  { id: 'p2', title: 'Sports Medicine II', dept: 'CTE', status: 'board', when: '2 weeks' },
  { id: 'p3', title: 'Statistics for Civic Life', dept: 'Math', status: 'adopted', when: 'Last month' },
]

const PROPOSAL_PILL: Record<ProposalRow['status'], [string, string]> = {
  new: ['New', 'border-[#2d8a8a]/50 bg-[#2d8a8a]/[0.1] text-[#0f4c4c]'],
  review: ['In review', 'border-[#2d5f8f]/40 text-[#2d5f8f]'],
  board: ['Board queue', 'border-[#a66a06]/40 text-[#a66a06]'],
  adopted: ['Adopted', 'border-[#10B981]/35 text-[#10B981]'],
}

function WalkthroughTool({ reduceMotion }: { reduceMotion: boolean }) {
  const [stage, setStage] = useState<'steps' | 'success' | 'done'>('steps')
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('Environmental Field Science')
  const [dept, setDept] = useState('Science')
  const [bands, setBands] = useState<string[]>(['10–11'])
  const [aligned, setAligned] = useState<string[]>(['ENV-1', 'ENV-2', 'DATA-3'])
  const [cost, setCost] = useState('4,800')
  const [funding, setFunding] = useState('CTE grant')
  const stageTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (stageTimer.current) clearTimeout(stageTimer.current)
    }
  }, [])

  const toggle = (list: string[], value: string, set: (next: string[]) => void) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const finish = () => {
    if (reduceMotion) {
      setStage('done')
      return
    }
    setStage('success')
    if (stageTimer.current) clearTimeout(stageTimer.current)
    stageTimer.current = setTimeout(() => setStage('done'), 1500)
  }

  const reset = () => {
    if (stageTimer.current) clearTimeout(stageTimer.current)
    setStage('steps')
    setStep(0)
  }

  const rows: ProposalRow[] = [
    { id: 'p0', title: title.trim() || 'Untitled course', dept, status: 'new', when: 'Just now' },
    ...PROPOSAL_ROWS,
  ]

  if (stage === 'success') {
    return (
      <AnimatePresence mode="wait">
        <SuccessBeat
          key="success"
          title="Proposal submitted."
          detail={`${title.trim() || 'Untitled course'} · ${dept} · sent to Curriculum & Instruction. Routing now…`}
        />
      </AnimatePresence>
    )
  }

  if (stage === 'done') {
    return (
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeStandard }}
        className="p-4 md:p-6"
      >
        <LiveHeader label="Curriculum & Instruction · proposals" onReset={reset} />
        <div className="overflow-hidden rounded-[3px] border border-[#1a1816]/10 bg-[#fffcf7]">
          <div
            className="grid grid-cols-[minmax(0,1.6fr)_70px_78px] gap-2 border-b border-[#1a1816]/[0.07] px-4 py-2 font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6e6355]/70 sm:grid-cols-[minmax(0,1.6fr)_84px_100px_74px]"
            aria-hidden="true"
          >
            <span>Course</span>
            <span>Dept</span>
            <span>Status</span>
            <span className="hidden text-right sm:block">When</span>
          </div>
          {rows.map((row, i) => {
            const [pillLabel, pillClass] = PROPOSAL_PILL[row.status]
            return (
              <motion.div
                key={row.id}
                initial={
                  row.status === 'new' && !reduceMotion
                    ? { opacity: 0, backgroundColor: 'rgba(45,138,138,0.14)' }
                    : false
                }
                animate={{ opacity: 1, backgroundColor: 'rgba(45,138,138,0)' }}
                transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.1 + i * 0.05, ease: easeStandard }}
                className="grid grid-cols-[minmax(0,1.6fr)_70px_78px] items-center gap-2 border-b border-[#1a1816]/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_84px_100px_74px]"
              >
                <span className="truncate font-body text-[12.5px] text-[#1a1816]">{row.title}</span>
                <span className="font-label text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6e6355]">
                  {row.dept}
                </span>
                <span>
                  <em className={`rounded-[3px] border px-2 py-1 font-label text-[7.5px] font-bold not-italic uppercase tracking-[0.1em] ${pillClass}`}>
                    {pillLabel}
                  </em>
                </span>
                <span className="hidden text-right font-label text-[8.5px] uppercase tracking-[0.06em] text-[#6e6355]/80 sm:block">
                  {row.when}
                </span>
              </motion.div>
            )
          })}
        </div>
        <p className="mt-3.5 rounded-[3px] border-l-2 border-[#2d8a8a] bg-[#f6f4ec] px-3.5 py-3 font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
          The walkthrough carried your answers straight into the tracker: {aligned.length} standards
          aligned, ${cost} against the {funding.toLowerCase()}, grades {bands.join(' and ') || 'TBD'}.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="p-5 md:p-7">
      {/* progress rail */}
      <div className="mb-6 flex items-center gap-0">
        {WALK_STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border font-label text-[9px] font-bold transition-colors ${
                  i < step
                    ? 'border-[#10B981] bg-[#10B981]/[0.1] text-[#10B981]'
                    : i === step
                      ? 'border-[#0f4c4c] bg-[#0f4c4c] text-[#fffcf7]'
                      : 'border-[#1a1816]/15 text-[#6e6355]'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              <span
                className={`hidden font-label text-[8.5px] font-semibold uppercase tracking-[0.12em] md:block ${
                  i === step ? 'text-[#1a1816]' : 'text-[#6e6355]/70'
                }`}
              >
                {label}
              </span>
            </button>
            {i < WALK_STEPS.length - 1 && (
              <span className={`mx-2 h-px flex-1 ${i < step ? 'bg-[#10B981]/50' : 'bg-[#1a1816]/10'}`} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: easeStandard }}
          className="min-h-[240px]"
        >
          {step === 0 && (
            <div className="grid content-start gap-3.5">
              <div className="grid gap-1.5">
                <label className={FIELD_LABEL} htmlFor="walk-title">
                  Course title
                </label>
                <input id="walk-title" value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_BOX} />
              </div>
              <div className="grid gap-1.5">
                <span className={FIELD_LABEL}>Department</span>
                <span className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => (
                    <Chip key={d} label={d} active={dept === d} onClick={() => setDept(d)} />
                  ))}
                </span>
              </div>
              <div className="grid gap-1.5">
                <span className={FIELD_LABEL}>Grade bands</span>
                <span className="flex flex-wrap gap-2">
                  {GRADE_BANDS.map((b) => (
                    <Chip key={b} label={b} active={bands.includes(b)} onClick={() => toggle(bands, b, setBands)} />
                  ))}
                </span>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid content-start gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className={FIELD_LABEL}>Standards this course addresses</span>
                <span className={`font-label text-[10px] font-bold ${aligned.length >= 3 ? 'text-[#10B981]' : 'text-[#a66a06]'}`}>
                  {aligned.length} of {STANDARDS.length} aligned
                </span>
              </div>
              <div className="grid gap-2">
                {STANDARDS.map(([code, text]) => {
                  const on = aligned.includes(code)
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggle(aligned, code, setAligned)}
                      className={`flex items-start gap-3 rounded-[3px] border px-3.5 py-2.5 text-left transition-colors ${
                        on ? 'border-[#2d8a8a]/50 bg-[#2d8a8a]/[0.05]' : 'border-[#1a1816]/12 hover:border-[#1a1816]/25'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border ${
                          on ? 'border-[#0f4c4c] bg-[#0f4c4c] text-[#fffcf7]' : 'border-[#1a1816]/25'
                        }`}
                        aria-hidden="true"
                      >
                        {on && (
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        )}
                      </span>
                      <span>
                        <span className="font-label text-[9px] font-bold tracking-[0.1em] text-[#0f4c4c]">{code}</span>
                        <span className="mt-0.5 block font-body text-[12.5px] leading-snug text-[#1a1816]/75">{text}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid content-start gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={FIELD_LABEL} htmlFor="walk-cost">
                    First-year materials cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-body text-[13.5px] text-[#6e6355]">$</span>
                    <input
                      id="walk-cost"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className={`${INPUT_BOX} w-full pl-7`}
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <span className={FIELD_LABEL}>Funding source</span>
                  <span className="flex flex-wrap gap-2">
                    {FUNDING.map((f) => (
                      <Chip key={f} label={f} active={funding === f} onClick={() => setFunding(f)} />
                    ))}
                  </span>
                </div>
              </div>
              <p className="font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
                The walkthrough checks the cost against the chosen fund and flags anything that needs a
                second signature before it reaches Curriculum & Instruction.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="grid content-start gap-3">
              <PanelLabel>Assembled from your answers</PanelLabel>
              <div className="rounded-[3px] border border-[#1a1816]/10 bg-[#f6f4ec] px-4 py-3.5">
                <div className="font-headline text-[19px] font-normal text-[#1a1816]">{title.trim() || 'Untitled course'}</div>
                <div className="mt-2 grid gap-1 font-body text-[12.5px] leading-relaxed text-[#1a1816]/70">
                  <span>
                    {dept} · grades {bands.length ? bands.join(', ') : 'TBD'}
                  </span>
                  <span>
                    {aligned.length} of {STANDARDS.length} standards aligned
                  </span>
                  <span>
                    ${cost || '0'} first-year materials · {funding}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#1a1816]/10 pt-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-label text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6e6355] transition-colors hover:text-[#1a1816] disabled:opacity-30"
        >
          ← Back
        </button>
        {step < WALK_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-[3px] bg-[#1a1816] px-5 py-2.5 font-label text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f0eee6] transition-all duration-300 hover:-translate-y-px hover:bg-[#0e0e0c]"
          >
            Next →
          </button>
        ) : (
          <PulseSubmit label="Submit proposal" onClick={finish} reduceMotion={reduceMotion} />
        )}
      </div>
      <p className="mt-3 font-body text-[11px] italic text-[#6e6355]/80">
        Built by the ed-services team in a Fieldwork session, with AI-assisted coding. Nothing is sent.
      </p>
    </div>
  )
}

/* ════════ The switcher ════════ */

type ToolKey = 'facilities' | 'walkthrough'

const TOOLS: Record<ToolKey, { label: string; url: string; chromeRight: string }> = {
  facilities: {
    label: 'Facilities request',
    url: 'built-with-karst / facilities-tool',
    chromeRight: 'Staff-built · Front end to back end',
  },
  walkthrough: {
    label: 'Course proposal walkthrough',
    url: 'built-with-karst / course-proposals',
    chromeRight: 'Staff-built · Guided walkthrough',
  },
}

export function ApplicationArtifact() {
  const [tool, setTool] = useState<ToolKey>('facilities')
  const reduceMotion = Boolean(useReducedMotion())
  const active = TOOLS[tool]

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#fffcf7]/45">
          Two of the tools teams build
        </span>
        <span className="flex gap-1.5">
          {(Object.keys(TOOLS) as ToolKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTool(key)}
              className={`rounded-[3px] border px-3 py-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                tool === key
                  ? 'border-[#c49a43]/70 bg-[#c49a43]/[0.12] text-[#fffcf7]'
                  : 'border-[#fffcf7]/15 text-[#fffcf7]/55 hover:text-[#fffcf7]'
              }`}
            >
              {TOOLS[key].label}
            </button>
          ))}
        </span>
      </div>
      <ArtifactFrame url={active.url} chromeRight={active.chromeRight}>
        {/* Both tools stay mounted so each keeps its stage while switching. */}
        <div className={tool === 'facilities' ? '' : 'hidden'}>
          <FacilitiesTool reduceMotion={reduceMotion} />
        </div>
        <div className={tool === 'walkthrough' ? '' : 'hidden'}>
          <WalkthroughTool reduceMotion={reduceMotion} />
        </div>
      </ArtifactFrame>
    </div>
  )
}
