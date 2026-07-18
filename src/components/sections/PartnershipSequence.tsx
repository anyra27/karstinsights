import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { easeStandard } from '../../lib/motion'
import birdOfParadise from '../../assets/bird-of-paradise.webp'
import koi from '../../assets/koi.webp'
import gem4 from '../../assets/gem4.webp'

/* ── The Partnership — replaces the "Three ways in" menu. One district
   partnership presented as a sequence: a working first day, a fieldwork
   year with its lanes, and the layers that extend the practice. No
   pricing, no slot counts; scarcity reuses the approved Fieldwork-page
   line verbatim. Student lane appears as offered-within-partnership
   only. ── */

interface Stage {
  number: string
  label: string
  title: string
  titleItalic: string
  body: string
  lanes?: Array<{ text: string; href?: string; native?: boolean }>
  image: string
  imagePosition?: string
  link?: { label: string; href: string; native?: boolean }
}

const STAGES: Stage[] = [
  {
    number: '01',
    label: 'The first day',
    title: 'It opens with',
    titleItalic: 'work.',
    body: 'Most partnerships begin with a single Executive Workshop: one live district priority, one working artifact by the afternoon. Districts ready for the full year can begin there instead.',
    image: birdOfParadise,
  },
  {
    number: '02',
    label: 'The fieldwork year',
    title: 'A year of',
    titleItalic: 'building.',
    body: 'One cross-functional team, protected build days across the school year, three to five operating systems in real use. The cabinet reviews evidence each quarter.',
    lanes: [
      { text: 'Leadership readbacks with the cabinet and Ed Services' },
      {
        text: 'Where districts choose it, a student cohort takes on real district and community problems',
        href: '/students/',
        native: true,
      },
    ],
    image: koi,
    imagePosition: 'right bottom',
    link: { label: 'Read the Fieldwork year', href: '/cohort/', native: true },
  },
  {
    number: '03',
    label: 'The layers',
    title: 'The practice',
    titleItalic: 'spreads.',
    body: 'Learning Platforms extend the work to every seat: leaders, educators, students, and families. Governed publishing carries the artifacts. Everything lands in the District AI Operating Kit.',
    image: gem4,
    link: { label: 'See the Learning Studios', href: '/studios' },
  },
]

export default function PartnershipSequence() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section className="overflow-hidden bg-[#f6f4ec] py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-6 md:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
        }}
      >
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.7, ease: easeStandard } },
            }}
          >
            <p className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
              The Partnership
            </p>
            <h2 className="font-headline text-3xl font-light leading-tight text-[#1a1816] md:text-5xl">
              One partnership,{' '}
              <span className="font-editorial font-normal italic text-[#6e6355]">built in sequence.</span>
            </h2>
          </motion.div>
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.7 } },
            }}
            className="max-w-[34ch] font-body text-sm leading-relaxed text-[#1a1816]/60 md:text-right"
          >
            Not a menu. A year of work with your leadership team, entered by introduction and
            referral.
          </motion.p>
        </div>

        <div className="relative">
          {/* the sequence spine */}
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { scaleY: reduceMotion ? 1 : 0 },
              visible: { scaleY: 1, transition: { duration: reduceMotion ? 0 : 1.2, ease: easeStandard } },
            }}
            className="absolute bottom-8 left-[19px] top-8 hidden w-px origin-top bg-gradient-to-b from-[#a8802a]/60 via-[#a8802a]/30 to-[#a8802a]/10 md:block"
          />

          <ol className="grid gap-5 md:gap-6">
            {STAGES.map((stage, index) => (
              <motion.li
                key={stage.number}
                variants={{
                  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : index * 0.08, ease: easeStandard },
                  },
                }}
                className="relative md:pl-14"
              >
                <span
                  className="absolute left-0 top-8 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-[#a8802a]/45 bg-[#f6f4ec] font-label text-[9px] font-bold tracking-[0.1em] text-[#8a6a1f] md:flex"
                  aria-hidden="true"
                >
                  {stage.number}
                </span>

                <div className="group grid overflow-hidden rounded-[3px] border border-[#1a1816]/10 bg-[#0e0e0c] text-[#fffcf7] shadow-[0_18px_50px_-30px_rgba(26,24,22,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-30px_rgba(26,24,22,0.6)] md:grid-cols-[1.35fr_0.65fr]">
                  <div className="relative z-10 p-6 md:p-9">
                    <p className="mb-3 font-label text-[9px] uppercase tracking-[0.3em] text-[#d9c39b] md:text-[10px]">
                      {stage.number} · {stage.label}
                    </p>
                    <h3 className="font-headline text-2xl font-light leading-[1.16] md:text-3xl">
                      {stage.title}{' '}
                      <span className="font-editorial font-normal italic text-[#e6d8b9]">{stage.titleItalic}</span>
                    </h3>
                    <p className="mt-4 max-w-[52ch] font-body text-sm leading-[1.75] text-[#fffcf7]/65">
                      {stage.body}
                    </p>

                    {stage.lanes && (
                      <ul className="mt-4 grid gap-2">
                        {stage.lanes.map((lane) => (
                          <li key={lane.text} className="flex items-start gap-2.5 font-body text-[13px] leading-[1.6] text-[#fffcf7]/55">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#c49a43]/70" aria-hidden="true" />
                            {lane.href ? (
                              <a
                                href={lane.href}
                                className="underline decoration-[#c49a43]/40 underline-offset-4 transition-colors hover:text-[#fffcf7]"
                              >
                                {lane.text}
                              </a>
                            ) : (
                              lane.text
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {stage.link &&
                      (stage.link.native ? (
                        <a
                          href={stage.link.href}
                          className="mt-5 inline-flex items-center gap-2 font-label text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#d9c39b] transition-colors hover:text-[#fffcf7]"
                        >
                          {stage.link.label}
                          <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                        </a>
                      ) : (
                        <Link
                          to={stage.link.href}
                          className="mt-5 inline-flex items-center gap-2 font-label text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#d9c39b] transition-colors hover:text-[#fffcf7]"
                        >
                          {stage.link.label}
                          <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                        </Link>
                      ))}
                  </div>

                  <div className="relative hidden md:block">
                    <img
                      src={stage.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{ objectPosition: stage.imagePosition }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-[#0e0e0c] via-[#0e0e0c]/35 to-transparent"
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.25 } },
          }}
          className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-[#1a1816]/10 pt-7 md:mt-14 md:flex-row md:items-center"
        >
          <p className="font-editorial text-[15px] italic text-[#6e6355]">
            One district team a year. By invitation.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2.5 rounded-[3px] bg-[#1a1816] px-8 py-3.5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0eee6] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0e0e0c] hover:shadow-[0_14px_34px_-14px_rgba(26,24,22,0.6)]"
          >
            Request an Introduction
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
