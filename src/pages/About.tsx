import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import AmbientParticles from '../components/art/AmbientParticles'
import KarstNameDiagram from '../components/art/KarstNameDiagram'
import { fadeSlideUpDelayed, staggerContainerRelaxed, staggerChild, easeStandard } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'
import headshot from '../assets/kevin-bice.webp'

const LayeredSineWaves = lazy(() => import('../components/art/LayeredSineWaves'))

/* About — the firm, then the principal. Firm voice throughout: third
   person, no résumé bullets, no district names. */

export default function About() {
  usePageMeta(
    'About',
    'Karst is a small firm by design. Data and intelligence for executive teams, delivered by the principal who builds the work.',
  )

  return (
    <PageShell activeNav="about">

      {/* ══════════ THE FIRM ══════════ */}
      <section className="relative pt-44 pb-24 md:pt-56 md:pb-32 px-8 md:px-16 bg-[#F0EEE6] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-[#F0EEE6]" />}>
            <LayeredSineWaves className="w-full h-full" />
          </Suspense>
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F0EEE6] via-[#F0EEE6]/45 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-6"
          >
            The Firm
          </motion.p>

          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-4xl md:text-6xl text-on-surface leading-[1.05] mb-8"
          >
            Built to <span className="text-sunset-cycle">one standard.</span>
          </motion.h1>

          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.45}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl"
          >
            Karst designs, engineers, and delivers the systems elite districts run on, while
            advancing the knowledge and career capacity of its clients. Engagements are
            reserved, by introduction and referral.
          </motion.p>
        </div>
      </section>

      {/* ══════════ THE NAME — what a karst is, and why the firm carries it ══════════ */}
      <section className="relative overflow-hidden bg-[#fffcf7] px-8 py-24 md:px-16 md:py-32">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <div>
            <motion.p
              variants={staggerChild}
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]"
            >
              The Name
            </motion.p>
            <motion.p
              variants={staggerChild}
              className="mb-5 font-label text-[11px] tracking-[0.14em] text-on-surface-variant/60"
            >
              karst <span className="text-on-surface-variant/40">/ kärst /</span>{' '}
              <span className="font-editorial italic tracking-normal">noun</span>
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="max-w-xl font-headline text-3xl font-light leading-[1.14] text-on-surface md:text-5xl"
            >
              A landscape shaped{' '}
              <span className="text-sunset-cycle inline-block pb-[0.1em] font-editorial font-normal italic">
                from below.
              </span>
            </motion.h2>
            <motion.p
              variants={staggerChild}
              className="mt-7 max-w-[52ch] font-body text-sm leading-[1.85] text-on-surface-variant md:text-base"
            >
              A karst is terrain carved by water moving through stone: hidden channels, springs,
              and standing towers. What shows at the surface is the record of what runs
              underneath.
            </motion.p>
            <motion.p
              variants={staggerChild}
              className="mt-5 max-w-[52ch] font-body text-sm leading-[1.85] text-on-surface-variant md:text-base"
            >
              It is how the firm thinks about district work. The decisions that
              matter live beneath the figures on the page: in the data, the systems, and the
              practice of the people who run them. Karst reads the structure underneath, and
              builds with it.
            </motion.p>
            <motion.p
              variants={staggerChild}
              className="mt-8 border-l border-[#a8802a]/45 pl-5 font-editorial text-base italic leading-relaxed text-on-surface md:text-lg"
            >
              The surface is the evidence. The work is below.
            </motion.p>
          </div>
          <motion.div variants={staggerChild} className="justify-self-center lg:justify-self-end">
            <KarstNameDiagram />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ THE PRINCIPAL ══════════ */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[620px]">
        {/* mounted-print treatment — the portrait is never cropped */}
        <div className="relative flex items-center justify-center bg-surface-container-high py-14 md:py-16 px-10">
          <img
            src={headshot}
            alt="Kevin Bice, founder and principal of Karst"
            className="max-h-[440px] md:max-h-[500px] w-auto shadow-warm"
            style={{ boxShadow: '0 18px 50px rgba(56, 56, 49, 0.16)' }}
          />
        </div>
        <div className="relative flex items-center px-10 md:px-16 lg:px-20 py-16 md:py-0 bg-surface-container">
          <motion.div
            className="relative z-10 max-w-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeStandard }}
          >
            <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
              Principal
            </p>
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-2">
              Kevin Bice
            </h2>
            <p className="font-label text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/55 mb-6">
              Founder &nbsp;·&nbsp; Google Certified Innovator
            </p>
            <div className="w-10 h-px bg-tertiary/40 mb-6" />
            <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed mb-5">
              Kevin gives executive teams a capability few districts reach: to turn their own
              data and ideas into finished, premium products. Consultants advise; trainers
              present. Kevin builds it with the team, then stays close as the work grows,
              keeping the districts he partners with ahead of their peers.
            </p>
            <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed mb-5">
              The effect shows from the outside. Boards see clarity. Communities see polish.
              Colleagues ask how it was made.
            </p>
            <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed mb-5">
              Karst does not advertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ ONE VOICE — the claim, made by someone else ══════════ */}
      <section className="relative py-20 md:py-28 px-6 md:px-10 bg-surface">
        <motion.figure
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <motion.div variants={staggerChild} className="w-8 h-px bg-secondary/60 mx-auto mb-8" />
          <motion.blockquote
            variants={staggerChild}
            className="font-editorial italic text-2xl md:text-3xl text-on-surface leading-snug mb-8"
          >
            I often describe Kevin as a unicorn because he is truly one of a kind. He combines
            exceptional talent and deep knowledge with a genuine, humble character that sets
            him apart from other consultants, trainers, and vendors I have worked with.
          </motion.blockquote>
          <motion.figcaption
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-on-surface-variant/65 leading-loose"
          >
            Josh Mason<br />
            <span className="text-on-surface-variant/45">
              Executive Director of Data, Assessment &amp; Accountability
            </span><br />
            <span className="text-on-surface-variant/45">
              Roseville Joint Union High School District
            </span>
          </motion.figcaption>
        </motion.figure>
      </section>

      {/* ══════════ DARK CTA ══════════ */}
      <section className="relative bg-[#0e0e0c] overflow-hidden">
        <AmbientParticles tone="white" />
        <div className="relative z-10">
          <div className="w-16 h-px bg-white/10 mx-auto mt-20" />
          <motion.div
            className="py-20 md:py-24 px-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: easeStandard }}
          >
            <div className="max-w-2xl mx-auto">
              <p className="font-label text-[10px] tracking-[0.32em] uppercase text-white/35 mb-6">
                Reserved · By Introduction
              </p>
              <h2 className="font-headline text-4xl md:text-5xl text-white/95 leading-[1.05] mb-6 max-w-xl mx-auto">
                Start the{' '}
                <span className="font-editorial italic font-normal text-white">conversation.</span>
              </h2>
              <p className="font-body text-sm md:text-base text-white/45 leading-relaxed max-w-md mx-auto mb-11">
                Tell us about your district. A short note is all it takes to begin.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 bg-white text-[#0e0e0c] py-4 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-14px_rgba(255,255,255,0.45)]"
              >
                Request an Introduction
                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
          <div className="w-16 h-px bg-white/10 mx-auto mb-20" />
        </div>
      </section>

    </PageShell>
  )
}
