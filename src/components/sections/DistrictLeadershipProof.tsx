import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainerRelaxed, staggerChild, easeStandard } from '../../lib/motion'
import tidePool from '../../assets/tide-pool.webp'

/* Testimonials gathered 2026-06-03, used with name + title approval.
   Current roles and organizations are stated per person because these leaders
   no longer all serve the same district. Quote wording is verbatim and must
   not be edited. No portraits: image plates are from the Karst nature set. */

const HERO_VOICE = {
  quote:
    'Before Kevin, I really only used AI to check the grammar in my emails. After working with him, I can build dashboards, forms, and full presentations myself. It’s a completely different level of capability.',
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

function Attribution({ name, title, district, light = false }: { name: string; title: string; district: string; light?: boolean }) {
  return (
    <figcaption className="font-label text-[10px] uppercase leading-loose tracking-[0.22em] md:text-[11px]">
      <span className={`block ${light ? 'text-[#fffcf7]/85' : 'text-on-surface/70'}`}>{name}</span>
      <span className={`block ${light ? 'text-[#fffcf7]/55' : 'text-on-surface-variant/55'}`}>{title}</span>
      <span className={`mt-1 block ${light ? 'text-[#fffcf7]/38' : 'text-on-surface-variant/38'}`}>{district}</span>
    </figcaption>
  )
}

export default function DistrictLeadershipProof() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section className="relative overflow-hidden bg-surface-container">
      {/* ── The hero voice: a full editorial spread ── */}
      <div className="relative">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
          <motion.figure
            className="relative z-10 px-6 py-20 md:px-10 md:py-28 lg:py-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainerRelaxed}
          >
            <motion.p
              variants={staggerChild}
              className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]"
            >
              District Voices
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="mb-10 font-headline text-3xl font-light leading-tight text-on-surface md:mb-14 md:text-4xl"
            >
              What changes.
            </motion.h2>

            <motion.span
              aria-hidden="true"
              variants={staggerChild}
              className="block select-none font-editorial text-7xl not-italic leading-none text-[#a8802a]/35 md:text-8xl"
            >
              &ldquo;
            </motion.span>
            <motion.blockquote
              variants={staggerChild}
              className="mt-2 max-w-[26ch] font-editorial text-[26px] italic leading-[1.4] text-on-surface md:text-[34px] lg:text-[38px]"
            >
              {HERO_VOICE.quote}
            </motion.blockquote>
            <motion.div variants={staggerChild} className="mt-9 border-l-2 border-[#a8802a]/50 pl-5">
              <Attribution {...HERO_VOICE} />
            </motion.div>
          </motion.figure>

          {/* image plate — Karst nature set, no portraits */}
          <div className="relative hidden min-h-[420px] lg:block">
            <motion.img
              src={tidePool}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              initial={reduceMotion ? false : { scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 1.6, ease: easeStandard }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-surface-container via-surface-container/25 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#a8802a]/35 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* ── The supporting voices: a dark band, two spotlit cards ── */}
      <div className="relative border-t border-on-surface/10 bg-[#12110f] px-6 py-16 md:px-10 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(168,128,42,0.09),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(168,128,42,0.06),transparent_30%)]"
        />
        <motion.div
          className="relative z-10 mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-70px' }}
          variants={staggerContainerRelaxed}
        >
          {SUPPORTING_VOICES.map((voice) => (
            <motion.figure
              key={voice.name}
              variants={staggerChild}
              className="group relative rounded-[3px] border border-[#fffcf7]/10 bg-[#fffcf7]/[0.035] p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c49a43]/35 hover:bg-[#fffcf7]/[0.055] md:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#c49a43]/60 via-[#c49a43]/15 to-transparent"
              />
              <span
                aria-hidden="true"
                className="block select-none font-editorial text-5xl not-italic leading-none text-[#c49a43]/40"
              >
                &ldquo;
              </span>
              <blockquote className="mt-2 font-editorial text-lg italic leading-[1.5] text-[#fffcf7]/90 md:text-xl">
                {voice.quote}
              </blockquote>
              <div className="mt-7 border-l-2 border-[#c49a43]/40 pl-4">
                <Attribution {...voice} light />
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
