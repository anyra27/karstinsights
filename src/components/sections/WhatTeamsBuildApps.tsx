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
  'rounded-[4px] border border-[#1a1816]/10 bg-[#fbf8f1] px-3.5 py-2.5 font-body text-[13.5px] text-[#1a1816] shadow-[inset_0_1px_3px_rgba(26,24,22,0.05)] transition-all duration-200 focus:border-[#2d8a8a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,138,138,0.14)] focus:outline-none'

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
      className={`rounded-[4px] px-3 py-2 font-label text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
        active
          ? 'bg-gradient-to-b from-[#136060] to-[#0d3d3d] text-[#f0faf8] shadow-[0_5px_14px_-5px_rgba(15,76,76,0.55)]'
          : 'border border-[#1a1816]/12 bg-[#fffcf7] text-[#6e6355] shadow-[0_1px_2px_rgba(26,24,22,0.04)] hover:-translate-y-px hover:border-[#2d8a8a]/35 hover:text-[#1a1816]'
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
  new: 'border-transparent bg-[#2d8a8a] text-[#f0faf8] shadow-[0_3px_8px_-3px_rgba(15,76,76,0.5)]',
  open: 'border-transparent bg-[#1a1816]/[0.06] text-[#6e6355]',
  progress: 'border-transparent bg-[#2d5f8f]/[0.12] text-[#2d5f8f]',
  closed: 'border-transparent bg-[#10B981]/[0.12] text-[#0d9268]',
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

/* ════════ Tool B · Classroom observation walkthrough — instructional
   rounds for ed services. Rooms and subjects only, never teacher names.
   Finishing an observation lands it on the instructional-rounds board
   the same team reads. ════════ */

const OBS_STEPS = ['The visit', 'Look-fors', 'Evidence', 'Review'] as const
const OBS_SITES = ['Grandview Middle', 'Harbor View High', 'Cedar Hollow Elementary', 'Northfield Middle']
const SUBJECTS = ['Math', 'ELA', 'Science', 'CTE']
const PERIODS = ['Per. 1', 'Per. 3', 'Per. 5']

const LOOK_FORS: Array<[string, string]> = [
  ['LF-1', 'The learning objective is visible and students can say it'],
  ['LF-2', 'Students are doing the thinking, not just receiving it'],
  ['LF-3', 'The teacher checks for understanding before moving on'],
  ['LF-4', 'Feedback lands in the moment, not just on the rubric'],
  ['LF-5', 'Technology serves the task instead of replacing it'],
]

const STRENGTH_TAGS = ['Student discourse', 'Pacing', 'Questioning', 'Routines']

interface ObsRow {
  id: string
  room: string
  subject: string
  lookFors: string
  when: string
  status: 'new' | 'logged'
}

const OBS_ROWS: ObsRow[] = [
  { id: 'o1', room: 'Room 32 · ELA', subject: 'ELA', lookFors: '4 of 5', when: 'This morning', status: 'logged' },
  { id: 'o2', room: 'Room 07 · Science', subject: 'Science', lookFors: '3 of 5', when: 'Yesterday', status: 'logged' },
  { id: 'o3', room: 'Shop B · CTE', subject: 'CTE', lookFors: '5 of 5', when: 'Yesterday', status: 'logged' },
  { id: 'o4', room: 'Room 21 · Math', subject: 'Math', lookFors: '4 of 5', when: '2 days', status: 'logged' },
]

const LOOKFOR_FREQ: Array<[string, number]> = [
  ['Objective visible', 92],
  ['Students thinking', 78],
  ['Understanding checks', 71],
  ['Live feedback', 64],
  ['Tech serves the task', 58],
]

function ObservationTool({ reduceMotion }: { reduceMotion: boolean }) {
  const [stage, setStage] = useState<'steps' | 'success' | 'done'>('steps')
  const [step, setStep] = useState(0)
  const [site, setSite] = useState(OBS_SITES[0])
  const [subject, setSubject] = useState('Math')
  const [period, setPeriod] = useState('Per. 3')
  const [room, setRoom] = useState('Room 14')
  const [seen, setSeen] = useState<string[]>(['LF-1', 'LF-2', 'LF-3', 'LF-4'])
  const [strengths, setStrengths] = useState<string[]>(['Student discourse'])
  const [note, setNote] = useState(
    'Students explained their reasoning to each other before the teacher confirmed. Objective referenced twice mid-lesson.',
  )
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

  const rows: ObsRow[] = [
    {
      id: 'o0',
      room: `${room.trim() || 'Room'} · ${subject}`,
      subject,
      lookFors: `${seen.length} of ${LOOK_FORS.length}`,
      when: 'Just now',
      status: 'new',
    },
    ...OBS_ROWS,
  ]

  if (stage === 'success') {
    return (
      <AnimatePresence mode="wait">
        <SuccessBeat
          key="success"
          title="Observation logged."
          detail={`${room.trim() || 'Room'} · ${subject} · ${site} · ${seen.length} of ${LOOK_FORS.length} look-fors observed.`}
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
        <LiveHeader label="Instructional rounds · this month" onReset={reset} />
        <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-3">
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  ['Observations', '48', '+1 just now', 'text-[#2d8a8a]'],
                  ['Sites visited', '12 of 14', 'This month', 'text-[#10B981]'],
                  ['Most-seen look-for', 'LF-1', 'Objective visible', 'text-[#2d5f8f]'],
                ] as const
              ).map(([label, value, noteText, tone], i) => (
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
                  <div className="mt-1 font-label text-[19px] font-extrabold tracking-[-0.01em] text-[#1a1816]">
                    {value}
                  </div>
                  <div className={`mt-0.5 font-body text-[10px] font-medium ${tone}`}>{noteText}</div>
                </motion.div>
              ))}
            </div>
            <div className="overflow-hidden rounded-[3px] border border-[#1a1816]/10 bg-[#fffcf7]">
              <div
                className="grid grid-cols-[minmax(0,1.4fr)_74px_66px] gap-2 border-b border-[#1a1816]/[0.07] px-4 py-2 font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6e6355]/70 sm:grid-cols-[minmax(0,1.5fr)_90px_84px_70px]"
                aria-hidden="true"
              >
                <span>Visit</span>
                <span>Look-fors</span>
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
                  transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.1 + i * 0.04, ease: easeStandard }}
                  className="grid grid-cols-[minmax(0,1.4fr)_74px_66px] items-center gap-2 border-b border-[#1a1816]/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1.5fr)_90px_84px_70px]"
                >
                  <span className="truncate font-body text-[12.5px] text-[#1a1816]">{row.room}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex gap-[3px]" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, si) => (
                        <span
                          key={si}
                          className="h-[5px] w-[9px] rounded-full"
                          style={{
                            background:
                              si < parseInt(row.lookFors, 10)
                                ? 'linear-gradient(90deg, #0f4c4c, #2d8a8a)'
                                : 'rgba(26,24,22,0.1)',
                          }}
                        />
                      ))}
                    </span>
                    <span className="font-label text-[8.5px] font-bold tabular-nums text-[#0f4c4c]">{row.lookFors}</span>
                  </span>
                  <span className="hidden sm:block">
                    <em
                      className={`rounded-[3px] border px-2 py-1 font-label text-[7.5px] font-bold not-italic uppercase tracking-[0.1em] ${
                        row.status === 'new'
                          ? 'border-transparent bg-[#2d8a8a] text-[#f0faf8] shadow-[0_3px_8px_-3px_rgba(15,76,76,0.5)]'
                          : 'border-transparent bg-[#10B981]/[0.12] text-[#0d9268]'
                      }`}
                    >
                      {row.status === 'new' ? 'New' : 'Logged'}
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
              <PanelLabel>Look-fors observed · month to date</PanelLabel>
              {LOOKFOR_FREQ.map(([label, pct], i) => (
                <div key={label} className="my-2 grid grid-cols-[118px_minmax(0,1fr)_30px] items-center gap-2.5">
                  <span className="truncate font-label text-[8px] font-semibold uppercase tracking-[0.03em] text-[#1a1816]/70">
                    {label}
                  </span>
                  <motion.i
                    initial={reduceMotion ? false : { width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.25 + i * 0.07, ease: easeStandard }}
                    className="block h-[6px] rounded-full"
                    style={{
                      background:
                        pct >= 75
                          ? 'linear-gradient(90deg, #0d9268, #2fd4a0)'
                          : 'linear-gradient(90deg, #0f4c4c, #3aa8a0)',
                      boxShadow: '0 2px 6px -2px rgba(15,76,76,0.4)',
                    }}
                  />
                  <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{pct}%</b>
                </div>
              ))}
            </div>
            <p className="rounded-[3px] border-l-2 border-[#2d8a8a] bg-[#f6f4ec] px-3.5 py-3 font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
              Every walkthrough feeds the same board. Patterns surface across sites in weeks, and no
              individual teacher is named anywhere in the record.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-5 md:p-7">
      {/* progress rail */}
      <div className="mb-6 flex items-center gap-0">
        {OBS_STEPS.map((label, i) => (
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
                      ? 'border-transparent bg-gradient-to-b from-[#136060] to-[#0d3d3d] text-[#f0faf8] shadow-[0_0_0_4px_rgba(45,138,138,0.15)]'
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
            {i < OBS_STEPS.length - 1 && (
              <span className={`mx-2 h-px flex-1 ${i < step ? 'bg-gradient-to-r from-[#10B981]/70 to-[#2d8a8a]/50' : 'bg-[#1a1816]/10'}`} aria-hidden="true" />
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
          className="min-h-[250px]"
        >
          {step === 0 && (
            <div className="grid content-start gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={FIELD_LABEL} htmlFor="obs-site">
                    Site
                  </label>
                  <select
                    id="obs-site"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    className={`${INPUT_BOX} cursor-pointer appearance-none pr-8`}
                  >
                    {OBS_SITES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <label className={FIELD_LABEL} htmlFor="obs-room">
                    Room
                  </label>
                  <input id="obs-room" value={room} onChange={(e) => setRoom(e.target.value)} className={INPUT_BOX} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <span className={FIELD_LABEL}>Subject</span>
                <span className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <Chip key={s} label={s} active={subject === s} onClick={() => setSubject(s)} />
                  ))}
                </span>
              </div>
              <div className="grid gap-1.5">
                <span className={FIELD_LABEL}>Period</span>
                <span className="flex flex-wrap gap-2">
                  {PERIODS.map((p) => (
                    <Chip key={p} label={p} active={period === p} onClick={() => setPeriod(p)} />
                  ))}
                </span>
              </div>
              <p className="font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
                Rooms and subjects only. The tool never records a teacher name; rounds are about
                practice patterns, not personnel files.
              </p>
            </div>
          )}
          {step === 1 && (
            <div className="grid content-start gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className={FIELD_LABEL}>What did you see? Tap everything observed</span>
                <span className={`font-label text-[10px] font-bold ${seen.length >= 3 ? 'text-[#10B981]' : 'text-[#a66a06]'}`}>
                  {seen.length} of {LOOK_FORS.length} observed
                </span>
              </div>
              <div className="grid gap-2">
                {LOOK_FORS.map(([code, text]) => {
                  const on = seen.includes(code)
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggle(seen, code, setSeen)}
                      className={`flex items-start gap-3 rounded-[3px] border px-3.5 py-2.5 text-left transition-colors ${
                        on ? 'border-[#2d8a8a]/50 bg-[#2d8a8a]/[0.05]' : 'border-[#1a1816]/12 hover:border-[#1a1816]/25'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border ${
                          on ? 'border-transparent bg-gradient-to-b from-[#136060] to-[#0d3d3d] text-[#f0faf8] shadow-[0_0_0_4px_rgba(45,138,138,0.15)]' : 'border-[#1a1816]/25'
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
              <div className="grid gap-1.5">
                <label className={FIELD_LABEL} htmlFor="obs-note">
                  One thing worth sharing
                </label>
                <textarea
                  id="obs-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className={`${INPUT_BOX} resize-none leading-[1.55]`}
                />
              </div>
              <div className="grid gap-1.5">
                <span className={FIELD_LABEL}>Strength spotted</span>
                <span className="flex flex-wrap gap-2">
                  {STRENGTH_TAGS.map((t) => (
                    <Chip key={t} label={t} active={strengths.includes(t)} onClick={() => toggle(strengths, t, setStrengths)} />
                  ))}
                </span>
              </div>
              <p className="font-body text-[11.5px] italic leading-relaxed text-[#6e6355]">
                Notes describe practice, never people. What you write here is visible to the
                instructional team, not to evaluation files.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="grid content-start gap-3">
              <PanelLabel>Assembled from your visit</PanelLabel>
              <div className="rounded-[3px] border border-[#1a1816]/10 bg-[#f6f4ec] px-4 py-3.5">
                <div className="font-headline text-[19px] font-normal text-[#1a1816]">
                  {room.trim() || 'Room'} · {subject} · {period}
                </div>
                <div className="mt-2 grid gap-1 font-body text-[12.5px] leading-relaxed text-[#1a1816]/70">
                  <span>{site}</span>
                  <span>
                    {seen.length} of {LOOK_FORS.length} look-fors observed
                  </span>
                  <span>Strengths: {strengths.length ? strengths.join(', ') : 'none tagged'}</span>
                </div>
                {note.trim() && (
                  <p className="mt-3 border-l-2 border-[#2d8a8a] pl-3 font-body text-[12px] italic leading-relaxed text-[#6e6355]">
                    &ldquo;{note.trim().slice(0, 140)}&rdquo;
                  </p>
                )}
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
        {step < OBS_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-[3px] bg-[#1a1816] px-5 py-2.5 font-label text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f0eee6] transition-all duration-300 hover:-translate-y-px hover:bg-[#0e0e0c]"
          >
            Next →
          </button>
        ) : (
          <PulseSubmit label="Log observation" onClick={finish} reduceMotion={reduceMotion} />
        )}
      </div>
      <p className="mt-3 font-body text-[11px] italic text-[#6e6355]/80">
        Built by the ed-services team in a Fieldwork session, with AI-assisted coding. Nothing is sent.
      </p>
    </div>
  )
}

/* ════════ The switcher ════════ */

type ToolKey = 'facilities' | 'observation'

const TOOLS: Record<ToolKey, { label: string; url: string; chromeRight: string }> = {
  facilities: {
    label: 'Facilities request',
    url: 'built-with-karst / facilities-tool',
    chromeRight: 'Staff-built · Front end to back end',
  },
  observation: {
    label: 'Classroom observation tool',
    url: 'built-with-karst / instructional-rounds',
    chromeRight: 'Staff-built · Instructional rounds',
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
        <div className={tool === 'observation' ? '' : 'hidden'}>
          <ObservationTool reduceMotion={reduceMotion} />
        </div>
      </ArtifactFrame>
    </div>
  )
}
