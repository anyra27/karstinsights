import { motion, useReducedMotion } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

/* Testimonials gathered 2026-06-03, used with name + title approval.
   Current roles and organizations are stated per person because these leaders
   no longer all serve the same district. Quote wording is verbatim and must
   not be edited. No portraits. */

/* The hero quote is split into phrases for the staged reveal ONLY.
   Concatenated, the segments reproduce the approved quote verbatim. */
const HERO_PHRASES = [
  'Before Kevin, I really only used AI to check the grammar in my emails. ',
  'After working with him, I can build dashboards, forms, and full presentations myself. ',
  'It’s a completely different level of capability.',
]

const HERO_ATTRIBUTION = {
  name: 'Dr. Tu Moua-Carroz',
  title: 'Superintendent',
  district: 'Twin Rivers Unified School District',
}

const SUPPORTING_VOICES = [
  {
    quote: 'I’ve literally cut my workload in half while accomplishing double the work.',
    name: 'Tony Phan',
    title: 'Chief Officer of Strategic Communication and Engagement',
    district: 'Roseville Joint Union High School District',
  },
  {
    quote:
      'We’re building predictive data solutions we’d never have imagined on our own — work that once required outside help, or simply went undone.',
    name: 'Josh Mason',
    title: 'Executive Director, Data, Assessment and Accountability',
    district: 'Roseville Joint Union High School District',
  },
]

function Attribution({ name, title, district }: { name: string; title: string; district: string }) {
  return (
    <figcaption className="font-label text-[10px] uppercase leading-loose tracking-[0.22em] md:text-[11px]">
      <span className="block text-on-surface/72">{name}</span>
      <span className="block text-on-surface-variant/60">{title}</span>
      <span className="mt-1 block text-on-surface-variant/42">{district}</span>
    </figcaption>
  )
}

export default function DistrictLeadershipProof() {
  const reduceMotion = Boolean(useReducedMotion())

  const phraseVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.85,
        delay: reduceMotion ? 0 : 0.25 + index * 0.4,
        ease: easeStandard,
      },
    }),
  }

  const riseVariants = (delay: number) => ({
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: easeStandard },
    },
  })

  return (
    <section className="relative overflow-hidden bg-surface-container">
      {/* subtle brass wash + hairline rules, consistent with the dark neighbors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(168,128,42,0.07),transparent_38%),radial-gradient(circle_at_88%_88%,rgba(168,128,42,0.05),transparent_32%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-6 hidden w-px bg-gradient-to-b from-transparent via-[#1e2a4a]/10 to-transparent xl:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-6 hidden w-px bg-gradient-to-b from-transparent via-[#1e2a4a]/10 to-transparent xl:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
        >
          {/* ── Eyebrow + headline ── */}
          <motion.p
            variants={riseVariants(0)}
            className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]"
          >
            District Voices
          </motion.p>
          <motion.h2
            variants={riseVariants(0.08)}
            className="font-headline text-3xl font-light leading-tight text-on-surface md:text-4xl"
          >
            What changes.
          </motion.h2>

          <div className="mt-14 grid gap-16 md:mt-20 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            {/* ── Hero voice ── */}
            <figure className="relative">
              <motion.span
                aria-hidden="true"
                variants={riseVariants(0.1)}
                className="block select-none font-editorial text-8xl not-italic leading-none text-[#a8802a]/30 md:text-9xl"
              >
                &ldquo;
              </motion.span>
              <blockquote className="mt-1 max-w-[24ch] font-editorial text-[27px] italic leading-[1.42] text-on-surface md:text-[36px] lg:text-[40px]">
                {HERO_PHRASES.map((phrase, index) => (
                  <motion.span key={index} custom={index} variants={phraseVariants} className="inline">
                    {phrase}
                  </motion.span>
                ))}
              </blockquote>
              <motion.div variants={riseVariants(1.5)} className="mt-10 border-l-2 border-[#a8802a]/55 pl-5">
                <Attribution {...HERO_ATTRIBUTION} />
              </motion.div>
            </figure>

            {/* ── Supporting voices: marginalia column ── */}
            <div className="relative flex flex-col justify-center gap-14 lg:gap-16 lg:border-l lg:border-[#1e2a4a]/12 lg:pl-14">
              {SUPPORTING_VOICES.map((voice, index) => (
                <motion.figure key={voice.name} variants={riseVariants(0.9 + index * 0.35)} className="relative">
                  <span
                    aria-hidden="true"
                    className="mb-6 block h-px w-14 bg-gradient-to-r from-[#a8802a]/70 to-[#a8802a]/0"
                  />
                  <blockquote className="max-w-[36ch] font-editorial text-lg italic leading-[1.55] text-on-surface/88 md:text-xl">
                    &ldquo;{voice.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 border-l-2 border-[#a8802a]/40 pl-4">
                    <Attribution {...voice} />
                  </div>
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
