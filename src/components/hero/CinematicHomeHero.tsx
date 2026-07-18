import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import KarstFormationCanvas from '../art/formation/KarstFormationCanvas'
import { formationStateAt } from '../art/formation/heroFormations'

const STAGE_NAMES = [
  'Field',
  'Globe',
  'Survey',
  'Strata',
  'Assembly',
  'Constellation',
  'Record',
]

const FINAL_STAGE = STAGE_NAMES.length - 1

/* Scroll ranges for beats 2–6 (Globe → Constellation); beat 1 is the intro,
   beat 7 is the final Record block. */
const BEAT_RANGES: Array<[number, number, number, number]> = [
  [0.165, 0.196, 0.246, 0.277],
  [0.303, 0.334, 0.386, 0.417],
  [0.442, 0.472, 0.525, 0.556],
  [0.579, 0.61, 0.664, 0.694],
  [0.719, 0.75, 0.802, 0.833],
]

const STORY_BEATS = [
  {
    stage: 'Field',
    title: 'An applied AI partnership.',
    body: 'Karst builds internal AI capability with school district leadership teams. The work is delivered during the engagement. The capability stays for good.',
  },
  {
    stage: 'Globe',
    title: 'Expert partnership, in the room.',
    body: 'Karst works beside your leaders on the work that actually matters: the board packet, the enrollment question, the data nobody has time to read.',
  },
  {
    stage: 'Survey',
    title: 'A data director builds the early-warning dashboard.',
    body: 'Raw exports become the flag that finds a struggling student in week four.',
  },
  {
    stage: 'Strata',
    title: 'A communications chief builds the board story.',
    body: 'One set of figures, recomposed for the board, staff, and families.',
  },
  {
    stage: 'Assembly',
    title: 'An operations lead builds a working tool.',
    body: 'A request that routes itself and lands on the district dashboard.',
  },
  {
    stage: 'Constellation',
    title: 'None of them are engineers.',
    body: 'Guided sessions inside the workday turn individual wins into shared practice.',
  },
  {
    stage: 'Record',
    title: 'Capacity, not dependency.',
    body: 'Everything built stays: documented, running, and owned by the district.',
  },
] as const

function ease(value: number) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function fadeBetween(value: number, start: number, end: number) {
  if (value <= start) return 0
  if (value >= end) return 1
  return ease((value - start) / (end - start))
}

function heldOpacity(value: number, [enterStart, enterEnd, exitStart, exitEnd]: [number, number, number, number]) {
  if (value <= enterStart || value >= exitEnd) return 0
  if (value < enterEnd) return fadeBetween(value, enterStart, enterEnd)
  if (value <= exitStart) return 1
  return 1 - fadeBetween(value, exitStart, exitEnd)
}

function HeroBeat({
  progress,
  range,
  label,
  title,
  body,
}: {
  progress: MotionValue<number>
  range: [number, number, number, number]
  label: string
  title: string
  body: string
}) {
  const opacity = useTransform(progress, (value) => heldOpacity(value, range))
  const y = useTransform(progress, (value) => {
    if (value <= range[0]) return 10
    if (value < range[1]) return 10 * (1 - fadeBetween(value, range[0], range[1]))
    if (value <= range[2]) return 0
    return -8 * fadeBetween(value, range[2], range[3])
  })

  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-[clamp(46px,6svh,78px)] left-6 right-6 z-10 min-h-[220px] max-w-[520px] md:left-12 md:min-h-[190px] lg:left-[max(3rem,calc((100vw-1152px)/2))]"
      style={{ opacity, y }}
    >
      <p className="mb-4 font-label text-[10px] uppercase tracking-[0.32em] text-[#c4a070]">
        {label}
      </p>
      <h2 className="max-w-[480px] font-headline text-[clamp(24px,2.35vw,32px)] font-medium leading-[1.16] text-[#f3efe6]/95">
        {title}
      </h2>
      <p className="mt-3 max-w-[46ch] font-body text-[14px] leading-[1.65] text-[#f3efe6]/56 md:text-[15.5px]">
        {body}
      </p>
    </motion.div>
  )
}

export default function CinematicHomeHero() {
  const trackRef = useRef<HTMLElement>(null)
  const reduceMotion = Boolean(useReducedMotion())
  const [activeStage, setActiveStage] = useState(0)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = formationStateAt(value).stage
    setActiveStage((current) => (current === next ? current : next))
  })

  const introOpacity = useTransform(scrollYProgress, (value) => 1 - fadeBetween(value, 0.063, 0.12))
  const introY = useTransform(scrollYProgress, (value) => -10 * fadeBetween(value, 0, 0.12))
  const scrollHintOpacity = useTransform(scrollYProgress, (value) => 1 - fadeBetween(value, 0.051, 0.108))
  const progressWidth = useTransform(scrollYProgress, (value) => `${Math.max(0, Math.min(1, value)) * 100}%`)
  const finalOpacity = useTransform(scrollYProgress, (value) => fadeBetween(value, 0.886, 0.92))
  const finalY = useTransform(scrollYProgress, (value) => 18 * (1 - fadeBetween(value, 0.886, 0.92)))

  return (
    <section
      ref={trackRef}
      id="cinematicHeroTrack"
      data-karst-nav-dark
      className={`karst-cinematic-hero relative bg-[#0e0e0c] ${
        reduceMotion ? 'karst-cinematic-hero--reduced' : ''
      }`}
      aria-label="Karst introduction"
    >
      <div className="karst-cinematic-hero__sticky sticky top-0 h-[100svh] overflow-hidden bg-[#0e0e0c]">
        <motion.div className="absolute inset-0 z-0">
          <KarstFormationCanvas progress={scrollYProgress} className="h-full w-full" />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(14,14,12,0.42), rgba(14,14,12,0.14) 29%, transparent 54%), radial-gradient(circle at 54% 43%, rgba(224,198,151,0.035), transparent 36%), linear-gradient(180deg, rgba(14,14,12,0.02), transparent 48%, rgba(14,14,12,0.2))',
          }}
        />
        <div className="texture-noise pointer-events-none absolute inset-0 z-[2] opacity-[0.07]" />

        <motion.div
          className="absolute left-0 right-0 top-16 z-20 h-px bg-[#c4a070]/70"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center"
          style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: introOpacity, y: introY }}
        >
          <div className="max-w-6xl">
            <p className="mb-6 font-label text-[9px] uppercase tracking-[0.34em] text-[#c4a070] md:text-[10px]">
              For School District Executive Teams
            </p>
            <h1 className="font-headline text-[clamp(48px,7.4vw,104px)] font-light leading-[1.04] tracking-[-0.035em] text-[#f3efe6]">
              Set the <span className="font-editorial font-normal italic text-[#d9c39b]">tempo.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-[66ch] font-body text-[14px] leading-[1.72] tracking-[0.01em] text-[#f3efe6]/64 md:text-[15.5px]">
              Karst builds internal AI capability with school district leadership teams. The work
              is delivered during the engagement. The capability stays for good.
            </p>
            {reduceMotion && (
              <Link
                to="/contact"
                className="mt-10 inline-block rounded-[3px] border border-[#d9c39b]/45 bg-[#f3efe6] px-8 py-3.5 font-headline text-[10px] uppercase tracking-[0.22em] text-[#171512] transition-colors hover:bg-white"
              >
                Request an Introduction
              </Link>
            )}
          </div>
        </motion.div>

        <div className="sr-only">
          <h2>How Karst works with school district executive teams</h2>
          <ol>
            {STORY_BEATS.map(({ stage, title, body }) => (
              <li key={stage}>
                {stage}: {title} {body}
              </li>
            ))}
          </ol>
        </div>

        {!reduceMotion && (
          <>
            {BEAT_RANGES.map((range, index) => {
              const beat = STORY_BEATS[index + 1]
              return (
                <HeroBeat
                  key={beat.stage}
                  progress={scrollYProgress}
                  range={range}
                  label={`${String(index + 2).padStart(2, '0')} · ${beat.stage}`}
                  title={beat.title}
                  body={beat.body}
                />
              )
            })}
          </>
        )}

        {!reduceMotion && (
          <motion.div
            className={`absolute bottom-[clamp(48px,6svh,72px)] left-6 right-6 z-10 max-w-[520px] md:left-12 lg:left-[max(3rem,calc((100vw-1152px)/2))] ${
              activeStage === FINAL_STAGE ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{ opacity: finalOpacity, y: finalY }}
            aria-hidden={activeStage !== FINAL_STAGE}
            inert={activeStage !== FINAL_STAGE}
          >
            <p className="mb-4 font-label text-[10px] uppercase tracking-[0.32em] text-[#c4a070]">
              07 · Record
            </p>
            <h2 className="max-w-[480px] font-headline text-[clamp(28px,3vw,42px)] font-medium leading-[1.14] text-[#f3efe6]">
              Capacity, not dependency.
            </h2>
            <p className="mt-3 max-w-[48ch] font-body text-sm leading-[1.65] text-[#f3efe6]/58 md:text-[15.5px]">
              Everything built stays: documented, running, and owned by the district.
            </p>
            <Link
              to="/contact"
              tabIndex={activeStage === FINAL_STAGE ? 0 : -1}
              className="pointer-events-auto mt-7 inline-block rounded-[3px] border border-[#d9c39b]/45 bg-[#f3efe6] px-8 py-3.5 font-headline text-[10px] uppercase tracking-[0.22em] text-[#171512] transition-transform hover:-translate-y-px"
            >
              Request an Introduction
            </Link>
          </motion.div>
        )}

        {!reduceMotion && (
          <motion.div
            className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden="true"
          >
            <span className="mx-auto mb-3 block h-8 w-px bg-gradient-to-b from-transparent to-[#c4a070]/80" />
            <span className="font-label text-[8px] uppercase tracking-[0.36em] text-[#f3efe6]/45">Scroll</span>
          </motion.div>
        )}

        {!reduceMotion && (
          <ol
            className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 space-y-3 md:block lg:right-10"
            aria-hidden="true"
          >
            {STAGE_NAMES.map((name, index) => (
              <li
                key={name}
                className={`flex items-center justify-end gap-3 font-label text-[8px] uppercase tracking-[0.28em] transition-colors duration-[800ms] ${
                  activeStage === index ? 'text-[#f3efe6]/88' : 'text-[#f3efe6]/24'
                }`}
              >
                <span>{name}</span>
                <span
                  className={`block h-1.5 w-1.5 rounded-full border transition-all duration-[800ms] ${
                    activeStage === index
                      ? 'border-[#d9c39b] bg-[#d9c39b] shadow-[0_0_0_6px_rgba(217,195,155,0.09)]'
                      : 'border-[#f3efe6]/35 bg-transparent'
                  }`}
                />
              </li>
            ))}
          </ol>
        )}

        {!reduceMotion && (
          <div
            className="absolute right-5 top-[82px] z-10 md:hidden"
            aria-hidden="true"
          >
            <span className="font-label text-[8px] uppercase tracking-[0.3em] text-[#f3efe6]/42">
              {String(activeStage + 1).padStart(2, '0')} / {String(STAGE_NAMES.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
