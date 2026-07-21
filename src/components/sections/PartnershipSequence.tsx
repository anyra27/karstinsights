import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { easeStandard } from '../../lib/motion'
import birdOfParadise from '../../assets/bird-of-paradise.webp'
import koi from '../../assets/koi.webp'
import gem4 from '../../assets/gem4.webp'

/* ── The Partnership — one engagement told in sequence, staged as the
   full-bleed hover panels (the strongest interaction this section has
   had). No pricing, no capacity counts, and no quantifiers anywhere in
   the offer copy: numbers read as ceilings, and no capacity claim has
   ever come from Kevin. Posture line: introduction and referral. ── */

interface Stage {
  number: string
  label: string
  title: string
  desc: string
  detail?: string
  image: string
  imagePosition?: string
  link: string
  native?: boolean
}

const STAGES: Stage[] = [
  {
    number: '01',
    label: 'The Executive Workshop',
    title: 'It starts with real work.',
    desc: 'Your team builds against a live district priority and leaves with working artifacts the same day.',
    detail: 'Districts ready for the full year begin there instead.',
    image: birdOfParadise,
    link: '/contact',
  },
  {
    number: '02',
    label: 'The Fieldwork Year',
    title: 'Monthly build days, real systems.',
    desc: 'A cross-functional team, protected build days across the school year, working systems in real use. The cabinet reviews evidence each quarter.',
    detail: 'Where districts choose it, a student cohort takes on real district and community problems.',
    image: koi,
    imagePosition: 'right bottom',
    link: '/cohort/',
    native: true,
  },
  {
    number: '03',
    label: 'The Continuation',
    title: 'The district runs it.',
    desc: 'Everything your team builds lands in the District AI Operating Kit, documented and district-owned. Karst stays available as the work grows.',
    image: gem4,
    link: '/contact',
  },
]

export default function PartnershipSequence() {
  const [active, setActive] = useState(0)
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section className="overflow-hidden bg-[#f6f4ec] py-20 md:py-28">
      <motion.div
        className="mx-auto mb-12 grid max-w-6xl gap-6 px-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end md:px-10"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: easeStandard }}
      >
        <div>
          <p className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
            The Partnership
          </p>
          <h2 className="font-headline text-3xl font-light leading-tight text-[#1a1816] md:text-5xl">
            One partnership,{' '}
            <span className="font-editorial font-normal italic text-[#6e6355]">built in sequence.</span>
          </h2>
        </div>
        <p className="max-w-[34ch] font-body text-sm leading-relaxed text-[#1a1816]/60 md:text-right">
          A year-long engagement with your leadership team, entered by introduction and referral.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto flex max-w-[1500px] flex-col overflow-hidden border-y border-black/10 bg-[#0e0e0c] md:h-[680px] md:flex-row md:border-x"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setActive(0)}
      >
        {STAGES.map((stage, index) => {
          const isActive = active === index

          return (
            <motion.article
              key={stage.number}
              data-active={isActive}
              className="relative h-[460px] min-w-0 shrink-0 overflow-hidden border-b border-white/15 last:border-b-0 md:h-full md:shrink md:border-b-0 md:border-r md:last:border-r-0"
              animate={reduceMotion ? undefined : { flexGrow: isActive ? 1.45 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexBasis: 0, flexGrow: 1 }}
              onMouseEnter={() => setActive(index)}
              onFocusCapture={() => setActive(index)}
            >
              {stage.native ? (
                <a
                  href={stage.link}
                  className="group absolute inset-0 block overflow-hidden text-[#fffcf7]"
                  aria-label={`${stage.label}: ${stage.title}`}
                >
                  <StagePanel stage={stage} isActive={isActive} reduceMotion={reduceMotion} />
                </a>
              ) : (
                <Link
                  to={stage.link}
                  className="group absolute inset-0 block overflow-hidden text-[#fffcf7]"
                  aria-label={`${stage.label}: ${stage.title}`}
                >
                  <StagePanel stage={stage} isActive={isActive} reduceMotion={reduceMotion} />
                </Link>
              )}
            </motion.article>
          )
        })}
      </motion.div>

      <motion.div
        className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-5 px-6 md:flex-row md:items-center md:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.2 }}
      >
        <p className="font-editorial text-[15px] italic text-[#6e6355]">
          Entered by introduction and referral.
        </p>
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2.5 rounded-[3px] bg-[#1a1816] px-8 py-3.5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0e0e0c] hover:shadow-[0_14px_34px_-14px_rgba(26,24,22,0.6)]"
        >
          Request an Introduction
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </section>
  )
}

function StagePanel({
  stage,
  isActive,
  reduceMotion,
}: {
  stage: Stage
  isActive: boolean
  reduceMotion: boolean
}) {
  return (
    <>
      <motion.img
        src={stage.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: stage.imagePosition }}
        animate={{ scale: isActive && !reduceMotion ? 1.035 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.12),rgba(8,8,7,0.18)_34%,rgba(8,8,7,0.9)_100%)] transition-colors duration-700 group-hover:bg-[linear-gradient(180deg,rgba(8,8,7,0.04),rgba(8,8,7,0.12)_34%,rgba(8,8,7,0.88)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.8)_0.55px,transparent_0.55px)] [background-size:5px_5px]"
      />

      <div className="absolute left-6 right-6 top-6 flex items-center justify-between md:left-8 md:right-8 md:top-8">
        <span className="font-label text-[9px] tracking-[0.28em] text-white/55">{stage.number}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/20 text-sm text-white/75 backdrop-blur-md transition-all duration-500 group-hover:border-[#d9c39b]/60 group-hover:bg-[#d9c39b] group-hover:text-[#0e0e0c] group-focus-visible:border-[#d9c39b]/60 group-focus-visible:bg-[#d9c39b] group-focus-visible:text-[#0e0e0c]">
          ↗
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
        <p className="mb-4 font-label text-[9px] uppercase tracking-[0.3em] text-[#d9c39b] md:text-[10px]">
          {stage.number} · {stage.label}
        </p>
        <h3 className="max-w-[18ch] font-headline text-2xl font-light leading-[1.16] md:text-3xl">
          {stage.title}
        </h3>
        <p className="mt-4 max-w-[46ch] font-body text-sm leading-relaxed text-white/65">
          {stage.desc}
        </p>
        {stage.detail && (
          <motion.p
            initial={false}
            animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: easeStandard }}
            className="overflow-hidden font-body text-[13px] italic leading-relaxed text-[#e6d8b9]/75"
          >
            <span className="block pt-3">{stage.detail}</span>
          </motion.p>
        )}
      </div>
    </>
  )
}
