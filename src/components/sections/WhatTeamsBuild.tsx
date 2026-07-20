import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { staggerContainerRelaxed, staggerChild } from '../../lib/motion'
import { DashboardArtifact, PresentationArtifact } from './WhatTeamsBuildArtifacts'
import { ApplicationArtifact } from './WhatTeamsBuildApps'

/* ── What Your Team Builds — the homepage's concrete-evidence chapter.
   Three illustrative district artifacts (dashboard, presentation, application)
   staged in the site's exemplar frame language. Synthetic demonstration
   content only; the caption states so on-screen. ── */

const TABS = [
  {
    id: 'dashboards',
    label: '01 · Dashboards',
    line: 'A season of raw exports, processed with AI into an early-warning picture. Two live dashboards wait below.',
  },
  {
    id: 'presentations',
    label: '02 · Presentations',
    line: 'A nine-slide deck you can page through, recomposed for the board, staff, and families.',
  },
  {
    id: 'applications',
    label: '03 · Applications',
    line: 'Two working tools. Edit anything, submit, and watch it land on the back end.',
  },
] as const

type TabId = (typeof TABS)[number]['id']
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
    <section className="relative overflow-hidden bg-[#f6f4ec] px-6 py-24 text-[#1a1816] md:px-10 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(168,128,42,0.07),transparent_30%),linear-gradient(165deg,rgba(255,255,255,0.5),transparent_44%)]"
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
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]"
            >
              What Your Team Builds
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="max-w-xl font-headline text-3xl font-light leading-[1.14] md:text-5xl lg:text-[54px]"
            >
              Your people can{' '}
              <span className="text-sunset-cycle font-editorial font-normal italic">
                build this.
              </span>
            </motion.h2>
          </div>
          <motion.p
            variants={staggerChild}
            className="max-w-[48ch] font-body text-base leading-[1.85] text-[#6e6355] md:text-lg"
          >
            Dashboards, presentations, and working tools, built the way your team will build them.
            Everything below is a live demonstration. Click in; nothing is sent.
          </motion.p>
        </div>

        <motion.div
          variants={staggerChild}
          role="tablist"
          aria-label="What district teams build"
          className="mt-14 flex overflow-x-auto border-y border-[#1a1816]/14 md:mt-20 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`relative shrink-0 whitespace-nowrap border-r border-[#1a1816]/10 px-4 py-4 font-label text-[9.5px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 last:border-r-0 md:px-7 md:py-[18px] md:text-[11px] ${
                  selected ? 'text-[#1a1816]' : 'text-[#1a1816]/50 hover:text-[#1a1816]'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(5)}</span>
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-[#a8802a]"
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
            <p className="max-w-[52ch] font-body text-sm leading-relaxed text-[#6e6355] md:text-base">
              {activeTab.line}
            </p>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.26em] text-[#6e6355]/70 md:text-[10px]">
              Illustrative district artifacts · No live data
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
