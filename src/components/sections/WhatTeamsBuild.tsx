import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { staggerContainerRelaxed, staggerChild } from '../../lib/motion'

/* ── What Your Team Builds — the homepage's concrete-evidence chapter.
   Three illustrative district artifacts (dashboard, presentation, application)
   translated from the Fieldwork page's approved exhibition. Synthetic
   demonstration content only; the caption states so on-screen. ── */

const TABS = [
  {
    id: 'dashboards',
    label: '01 · Dashboards',
    line: 'Raw district data becomes a view leaders can act on.',
  },
  {
    id: 'presentations',
    label: '02 · Presentations',
    line: 'Figures become a board-ready story with the recommendation attached.',
  },
  {
    id: 'applications',
    label: '03 · Applications',
    line: 'A staff request becomes a routed, tracked, visible workflow.',
  },
] as const

type TabId = (typeof TABS)[number]['id']

/* Shared artifact chrome — the paper card every build sits on */
function Artifact({
  barLeft,
  barRight,
  children,
}: {
  barLeft: React.ReactNode
  barRight: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[3px] bg-[#fffcf7] text-[#1a1816] shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
      <div className="flex items-center justify-between gap-4 border-b border-[#1a1816]/10 px-5 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#6e6355] md:px-7 md:py-4 md:text-[10px]">
        <span className="truncate">{barLeft}</span>
        <span className="hidden shrink-0 sm:block">{barRight}</span>
      </div>
      {children}
    </div>
  )
}

/* ── 01 · Dashboard — district overview, dots-and-hairlines voice ── */

const KPIS = [
  ['Students on track', '81%', '+4.2 this year'],
  ['Daily attendance', '92.8%', 'Early signal'],
  ['Open facilities requests', '37', 'Down 12 this month'],
  ['Board items ready', '04', 'Study session Thu'],
] as const

const BARS = [
  ['HVAC', 74, '34'],
  ['Grounds', 48, '22'],
  ['Electrical', 39, '18'],
  ['Plumbing', 30, '14'],
  ['Other', 26, '12'],
] as const

function DashboardArtifact() {
  return (
    <Artifact
      barLeft={
        <>
          <strong className="font-bold text-[#1a1816]">KARST</strong> · District overview
        </>
      }
      barRight="Executive read · Week 14"
    >
      <div className="grid gap-4 p-5 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-label text-[15px] font-semibold text-[#1a1816] md:text-[17px]">
            Where the district stands
          </div>
          <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
            {['This year', '90 days', '30 days'].map((chip, i) => (
              <span
                key={chip}
                className={`rounded-[3px] border px-2.5 py-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.12em] ${
                  i === 0 ? 'border-[#1e2a4a] text-[#1a1816]' : 'border-[#1a1816]/12 text-[#6e6355]'
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3.5">
          {KPIS.map(([label, value, note]) => (
            <div key={label} className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5">
              <div className="font-label text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#6e6355]">
                {label}
              </div>
              <div className="mt-1.5 font-label text-[24px] font-extrabold tracking-[-0.01em] text-[#1a1816] md:text-[30px]">
                {value}
              </div>
              <div className="mt-0.5 font-body text-[11.5px] font-medium text-[#a8802a]">{note}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3.5 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5 md:px-5">
            <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
              Momentum across the year
            </div>
            <svg viewBox="0 0 420 150" width="100%" aria-hidden="true">
              <g stroke="rgba(30,42,74,0.08)" strokeWidth="1">
                <line x1="0" y1="30" x2="420" y2="30" />
                <line x1="0" y1="68" x2="420" y2="68" />
                <line x1="0" y1="106" x2="420" y2="106" />
              </g>
              <path
                d="M8 118 C 60 112, 100 104, 150 96 S 250 76, 310 60 S 390 36, 412 30 L 412 132 L 8 132 Z"
                fill="rgba(30,42,74,0.05)"
              />
              <path
                d="M8 118 C 60 112, 100 104, 150 96 S 250 76, 310 60 S 390 36, 412 30"
                fill="none"
                stroke="#1e2a4a"
                strokeWidth="2"
              />
              <path
                d="M8 124 C 60 120, 100 116, 150 110 S 250 98, 310 88 S 390 70, 412 64"
                fill="none"
                stroke="#a8802a"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              <g fill="rgba(110,99,85,0.7)" fontFamily="Montserrat, sans-serif" fontSize="8" letterSpacing="1.5">
                <text x="8" y="146">AUG</text>
                <text x="108" y="146">OCT</text>
                <text x="208" y="146">JAN</text>
                <text x="308" y="146">MAR</text>
                <text x="396" y="146">MAY</text>
              </g>
            </svg>
          </div>
          <div className="rounded-[3px] border border-[#1a1816]/10 px-4 py-3.5 md:px-5">
            <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
              Requests by category
            </div>
            {BARS.map(([label, width, count], i) => (
              <div key={label} className="my-2 grid grid-cols-[64px_minmax(0,1fr)_26px] items-center gap-2.5">
                <span className="font-label text-[9px] font-semibold uppercase tracking-[0.08em] text-[#1a1816]/70">
                  {label}
                </span>
                <i
                  className="block h-1.5 rounded-[2px]"
                  style={{
                    width: `${width}%`,
                    background:
                      i === BARS.length - 1
                        ? 'rgba(30,42,74,0.22)'
                        : 'linear-gradient(90deg, rgba(30,42,74,0.75), rgba(30,42,74,0.45))',
                  }}
                />
                <b className="text-right font-label text-[10px] font-semibold text-[#6e6355]">{count}</b>
              </div>
            ))}
          </div>
        </div>

        <p className="border-l-2 border-[#a8802a] pl-3.5 font-body text-[12.5px] leading-relaxed text-[#1a1816]/70 md:text-[13.5px]">
          <strong className="font-label font-semibold text-[#1a1816]">The read:</strong> attendance
          recovered at both middle schools, the facilities backlog is down for a third straight month,
          and four items are board-ready.
        </p>
      </div>
    </Artifact>
  )
}

/* ── 02 · Presentation — the board study-session slide ── */

function PresentationArtifact() {
  return (
    <Artifact
      barLeft={
        <>
          <strong className="font-bold text-[#1a1816]">KARST</strong> · Board study session
        </>
      }
      barRight="Slide 04 · 12"
    >
      <div className="flex min-h-[340px] flex-col px-6 pb-5 pt-8 md:min-h-[420px] md:px-14 md:pb-8 md:pt-14">
        <div className="font-label text-[9px] font-semibold uppercase tracking-[0.32em] text-[#a8802a] md:text-[10px]">
          Enrollment &amp; facilities · Study session
        </div>
        <div className="mb-auto mt-4 max-w-[24ch] font-headline text-[24px] font-light leading-[1.14] tracking-[-0.01em] text-[#1a1816] md:text-[38px]">
          Should we consolidate the two middle-school feeder patterns{' '}
          <span className="font-editorial italic text-[#6e6355]">next fall?</span>
        </div>
        <div className="mt-7 grid items-center gap-6 md:mt-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <div>
            <div className="mb-2 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#6e6355]">
              Enrollment by feeder · five years
            </div>
            <svg viewBox="0 0 320 110" width="100%" aria-hidden="true">
              <g stroke="rgba(30,42,74,0.1)" strokeWidth="1">
                <line x1="0" y1="28" x2="320" y2="28" />
                <line x1="0" y1="58" x2="320" y2="58" />
                <line x1="0" y1="88" x2="320" y2="88" />
              </g>
              <path
                d="M10 40 C 70 44, 130 52, 190 62 S 290 82, 310 88"
                fill="none"
                stroke="#1e2a4a"
                strokeWidth="2"
              />
              <path
                d="M10 62 C 70 60, 130 56, 190 50 S 290 36, 310 32"
                fill="none"
                stroke="#a8802a"
                strokeWidth="1.6"
                strokeDasharray="3 5"
              />
              <circle cx="310" cy="88" r="3" fill="#1e2a4a" />
              <circle cx="310" cy="32" r="3" fill="#a8802a" />
            </svg>
          </div>
          <div className="grid content-center gap-3 font-body text-[13px] text-[#1a1816]/70 md:text-[14px]">
            <span className="block border-l-2 border-[#a8802a] pl-3.5">
              Enrollment trend by feeder, five years, with the inflection named.
            </span>
            <span className="block border-l-2 border-[#a8802a] pl-3.5">
              Transportation and staffing implications, costed both ways.
            </span>
            <span className="block border-l-2 border-[#a8802a] pl-3.5">
              A recommendation the room can accept, amend, or decline.
            </span>
          </div>
        </div>
        <div className="mt-8 flex items-baseline justify-between gap-3 border-t border-[#1a1816]/10 pt-4 font-label text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#6e6355] md:mt-12 md:text-[9.5px]">
          <span>
            <b className="font-semibold text-[#1a1816]">KARST</b> · Board study session
          </span>
          <span className="hidden md:block">Evidence attached · Recommendation on slide 12</span>
          <span>04 / 12</span>
        </div>
      </div>
    </Artifact>
  )
}

/* ── 03 · Application — the staff-facing facilities request ── */

const APP_FIELDS = [
  ['Site', 'Sierra Vista Middle'],
  ['Location', 'Room 214 · Science wing'],
] as const

const APP_STEPS = [
  ['01', 'Routed to the right trades lead. No forwarding chain.'],
  ['02', 'Joins the operating workflow with a real timeline.'],
  ['03', 'Counts on the district dashboard the moment it lands.'],
] as const

function ApplicationArtifact() {
  return (
    <Artifact
      barLeft={
        <>
          <strong className="font-bold text-[#1a1816]">KARST</strong> · Requests
        </>
      }
      barRight="Staff-facing app · Submitted in 40 seconds"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#1a1816]/10 bg-[#f6f4ec] px-5 py-3 md:px-7">
        <span className="flex items-center gap-2.5 font-label text-[10.5px] font-semibold text-[#1a1816] md:text-[11.5px]">
          <i className="h-2 w-2 rounded-full bg-[#1e2a4a]" aria-hidden="true" />
          Site facilities request
        </span>
        <span className="font-label text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6e6355] md:text-[10px]">
          M. Alvarez · Sierra Vista Middle
        </span>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-8">
        <div className="grid content-start gap-3.5">
          {APP_FIELDS.map(([label, value]) => (
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
              No cooling since Tuesday morning. Two afternoon classes relocated. Unit hums but the
              fan never engages.
            </span>
          </div>
          <span className="mt-1 inline-block justify-self-start rounded-[3px] bg-[#1a1816] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6]">
            Submit request
          </span>
        </div>
        <div className="grid content-center gap-4 border-t border-[#1a1816]/10 pt-6 md:border-l md:border-t-0 md:pl-9 md:pt-0">
          <div className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#a8802a] md:text-[10px]">
            What one submission does
          </div>
          {APP_STEPS.map(([number, text]) => (
            <div key={number} className="flex gap-3.5 font-body text-[13.5px] leading-[1.55] text-[#1a1816]/70">
              <i className="pt-0.5 font-label text-[10px] font-bold not-italic tracking-[0.14em] text-[#a8802a]">
                {number}
              </i>
              {text}
            </div>
          ))}
        </div>
      </div>
    </Artifact>
  )
}

const PANELS: Record<TabId, () => React.ReactElement> = {
  dashboards: DashboardArtifact,
  presentations: PresentationArtifact,
  applications: ApplicationArtifact,
}

export default function WhatTeamsBuild() {
  const [active, setActive] = useState<TabId>('dashboards')
  const reduceMotion = Boolean(useReducedMotion())
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeTab = TABS.find((tab) => tab.id === active) ?? TABS[0]
  const ActivePanel = PANELS[active]

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length
    if (event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = TABS.length - 1
    if (next !== null) {
      event.preventDefault()
      setActive(TABS[next].id)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <section
      data-karst-nav-dark
      className="relative overflow-hidden border-t border-[#fffcf7]/8 bg-[#090908] px-6 py-24 text-[#fffcf7] md:px-10 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(196,154,67,0.1),transparent_30%),linear-gradient(165deg,rgba(255,255,255,0.02),transparent_44%)]"
      />
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainerRelaxed}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-20">
          <div>
            <motion.p
              variants={staggerChild}
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#c49a43] md:text-[11px]"
            >
              What Your Team Builds
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="max-w-xl font-headline text-3xl font-light leading-[1.14] md:text-5xl lg:text-[54px]"
            >
              Your people can{' '}
              <span className="font-editorial font-normal italic text-[#e6d8b9]">build this.</span>
            </motion.h2>
          </div>
          <motion.p
            variants={staggerChild}
            className="max-w-[48ch] font-body text-base leading-[1.85] text-[#fffcf7]/62 md:text-lg"
          >
            Dashboards from your own data. Presentations ready for the board. Applications your
            staff actually use. Built by your team, with Karst, in sessions that fit real calendars.
          </motion.p>
        </div>

        <motion.div
          variants={staggerChild}
          role="tablist"
          aria-label="What district teams build"
          className="mt-14 flex border-y border-[#fffcf7]/14 md:mt-20"
        >
          {TABS.map((tab, index) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                role="tab"
                id={`build-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`build-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`relative border-r border-[#fffcf7]/10 px-4 py-4 font-label text-[9.5px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 last:border-r-0 md:px-7 md:py-[18px] md:text-[11px] ${
                  selected ? 'text-[#fffcf7]' : 'text-[#fffcf7]/50 hover:text-[#fffcf7]'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(5)}</span>
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-[#c49a43]"
                  />
                )}
              </button>
            )
          })}
        </motion.div>

        <motion.div variants={staggerChild} className="pt-10 md:pt-14">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              role="tabpanel"
              id={`build-panel-${active}`}
              aria-labelledby={`build-tab-${active}`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row md:items-baseline md:justify-between">
            <p className="max-w-[52ch] font-body text-sm leading-relaxed text-[#fffcf7]/55 md:text-base">
              {activeTab.line}
            </p>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.26em] text-[#fffcf7]/35 md:text-[10px]">
              Illustrative district artifacts · No live data
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
