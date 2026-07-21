import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import HeroParticles from '../components/art/HeroParticles'
import AmbientParticles from '../components/art/AmbientParticles'
import LivingPhoto from '../components/art/LivingPhoto'
import SkiSlides from '../components/art/SkiSlides'
import { BuiltGlyph, PresentGlyph, CapacityGlyph } from '../components/art/StandardGlyphs'
import strataImg from '../assets/strata.webp'
import birdImg from '../assets/bird-of-paradise.webp'
import koiImg from '../assets/koi.webp'
import fishSchoolImg from '../assets/fish-school.webp'
import { PLATFORM_URL } from '../config/brand'
import { usePageMeta } from '../lib/usePageMeta'
import {
  fadeSlideUpDelayed,
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'

/* ── The five chapters. Facts are structural and verified against each
   studio's catalog — track names, cert programs, flagships. No counts that
   drift, no pricing, no curricula. The student chapter is the page's peak:
   it carries a playable demo instead of an ambient vignette (`feature`). ── */
type StudioChapter = {
  id: string
  eyebrow: string
  title: string
  body: string
  fact: string
  image?: string
  alt?: string
  imagePos?: string
  feature?: boolean
  link: { href: string; label: string; external: boolean } | null
}

const studios: StudioChapter[] = [
  {
    id: 'leadership',
    eyebrow: 'For the Cabinet',
    title: 'Finish it in the morning. Present it the same day.',
    body: 'Each module ends in something a cabinet actually uses: a policy draft, a working dashboard, a board deck. Cabinet altitude, plain language, the work behind every claim.',
    fact: 'Certification tracks in AI foundations, AI leadership, and the Claude suite',
    image: strataImg,
    alt: 'Layered rock strata, lit from within: the structure beneath the surface.',
    imagePos: 'center',
    link: { href: PLATFORM_URL, label: 'Enter the Leadership Studio', external: true },
  },
  {
    id: 'teacher',
    eyebrow: 'For Teachers',
    title: 'For the classroom, not the binder.',
    body: 'No frameworks. Each module ends in a working artifact: a redesigned assignment, a parent email, a form that collects itself, built around the prep time teachers actually have.',
    fact: 'Tracks for recognizing how students use AI, responding in the classroom, and the tools themselves',
    image: birdImg,
    alt: 'A bird-of-paradise flower in full bloom against deep teal.',
    imagePos: 'center 30%',
    link: null,
  },
  {
    id: 'student',
    eyebrow: 'For Students',
    title: 'It shouldn’t feel like school.',
    body: 'Skills students will actually use, starting with knowing themselves. The two slides below are real: sort the work, watch it resolve into a profile of how you’re built. Step through them.',
    fact: 'Foundations · Big Picture · Core Skills · Workshops',
    feature: true,
    link: null,
  },
  {
    id: 'parent',
    eyebrow: 'For Families',
    title: 'You don’t have to be the expert.',
    body: 'Short modules that give parents the language for the kitchen table: what your kid is using, what to ask, where to set the rails. Open it on a phone and read.',
    fact: 'Ten short modules · no account, nothing collected',
    image: koiImg,
    alt: 'A koi in a still pond, lily pads at the edges.',
    imagePos: 'center',
    link: null,
  },
  {
    id: 'finlit',
    eyebrow: 'For Students · Personal Finance',
    title: 'The budget is the lesson.',
    body: 'A student picks a life (career, city, car), and the numbers cascade: the paycheck sets the housing, the housing sets the car, and on down. Built for the personal-finance requirement, ending in a plan they made themselves.',
    fact: 'Eight certification tracks · capstone: the Life Budget',
    image: fishSchoolImg,
    alt: 'A school of fish moving as one through deep water, lit by a shaft of light.',
    imagePos: 'center',
    link: null,
  },
]

const standard = [
  {
    Glyph: BuiltGlyph,
    title: 'Built, not browsed.',
    body: 'Every module ends in real work: a dashboard, a memo, a budget. Something that wasn’t there before.',
  },
  {
    Glyph: PresentGlyph,
    title: 'Presentation-ready.',
    body: 'What a leader builds in the morning goes in front of the room that afternoon.',
  },
  {
    Glyph: CapacityGlyph,
    title: 'Capacity, in every seat.',
    body: 'A leader, a teacher, a student: each finishes more capable than they came. The skill stays with the person.',
  },
]

export default function Studios() {
  usePageMeta(
    'The Learning Studios',
    'Five learning studios, one standard: leadership, teacher, student, parent, and personal-finance studios for school districts. Every module ends in real work.',
  )

  return (
    <PageShell activeNav="studios">
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-end pb-24 md:pb-32 px-8 md:px-16 overflow-hidden bg-[#F0EEE6]">
        <HeroParticles className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F0EEE6] via-[#F0EEE6]/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.36em] uppercase text-on-surface-variant/70 mb-6"
          >
            Karst · The Learning Studios
          </motion.p>
          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-5xl md:text-7xl text-on-surface leading-[1.02] mb-8"
          >
            Five studios.{' '}
            <span className="font-editorial italic font-normal text-sunset-cycle">One standard.</span>
          </motion.h1>
          <motion.div
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link
              to="/contact"
              className="btn-cycle inline-block py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px]"
            >
              Request an Introduction
            </Link>
            <a
              href="#studios"
              className="inline-block border border-[#1a1816]/25 text-[#1a1816]/75 py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:border-[#1a1816]/50 hover:text-[#1a1816] transition-all"
            >
              See the Studios
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════ THE STANDARD ══════════ */}
      <section className="relative py-24 md:py-32 px-6 bg-surface">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={staggerContainerRelaxed}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-6 text-center"
          >
            The Standard
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-14 text-center max-w-2xl mx-auto"
          >
            Different audiences.{' '}
            <span className="font-editorial italic font-normal text-tropical-gradient">The same bar.</span>
          </motion.h2>
          <motion.ul
            variants={staggerChild}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          >
            {standard.map((s) => {
              const G = s.Glyph
              return (
                <li key={s.title} className="text-left md:text-center">
                  <G className="md:mx-auto" />
                  <h3 className="font-editorial italic text-xl md:text-2xl text-on-surface mb-3">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                    {s.body}
                  </p>
                </li>
              )
            })}
          </motion.ul>
        </motion.div>
      </section>

      {/* ══════════ THE FIVE CHAPTERS ══════════ */}
      <div id="studios">
        {studios.map((studio, i) => {
          const tinted = i % 2 === 0

          /* ── The student chapter — the page's peak. A playable demo, not an
             ambient beat: pick a question, watch the data answer. ── */
          if (studio.feature) {
            return (
              <section
                key={studio.id}
                id={studio.id}
                className={`relative py-24 md:py-32 px-6 scroll-mt-20 ${
                  tinted ? 'bg-[#F0EEE6]' : 'bg-surface'
                }`}
              >
                <motion.div
                  className="max-w-2xl mx-auto text-center mb-10 md:mb-14"
                  variants={staggerContainerRelaxed}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-5"
                  >
                    {studio.eyebrow}
                  </motion.p>
                  <motion.h2
                    variants={staggerChild}
                    className="font-headline text-4xl md:text-5xl text-on-surface leading-[1.05] mb-6"
                  >
                    {studio.title}
                  </motion.h2>
                  <motion.p
                    variants={staggerChild}
                    className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-5"
                  >
                    {studio.body}
                  </motion.p>
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/60"
                  >
                    {studio.fact}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="max-w-5xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: easeStandard }}
                >
                  <SkiSlides />
                  <p className="font-editorial italic text-sm text-on-surface-variant/70 text-center mt-8">
                    Available within district partnerships.
                  </p>
                </motion.div>
              </section>
            )
          }

          const reversed = i % 2 === 1
          return (
            <section
              key={studio.id}
              id={studio.id}
              className={`relative py-16 md:py-20 px-6 scroll-mt-20 ${
                tinted ? 'bg-[#F0EEE6]' : 'bg-surface'
              }`}
            >
              <motion.div
                className={`max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
                  reversed ? 'lg:[direction:rtl]' : ''
                }`}
                variants={staggerContainerRelaxed}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                {/* copy */}
                <div className="lg:[direction:ltr]">
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-5"
                  >
                    {studio.eyebrow}
                  </motion.p>
                  <motion.h2
                    variants={staggerChild}
                    className="font-headline text-3xl md:text-4xl text-on-surface leading-[1.08] mb-6"
                  >
                    {studio.title}
                  </motion.h2>
                  <motion.p
                    variants={staggerChild}
                    className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-6"
                  >
                    {studio.body}
                  </motion.p>
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/60 mb-8"
                  >
                    {studio.fact}
                  </motion.p>
                  <motion.div variants={staggerChild}>
                    {studio.link ? (
                      <a
                        href={studio.link.href}
                        target={studio.link.external ? '_blank' : undefined}
                        rel={studio.link.external ? 'noopener noreferrer' : undefined}
                        className="font-headline uppercase tracking-widest text-xs text-on-surface border-b border-on-surface/30 pb-1 hover:border-on-surface transition-colors"
                      >
                        {studio.link.label} {studio.link.external && '↗'}
                      </a>
                    ) : (
                      <p className="font-editorial italic text-sm text-on-surface-variant/70">
                        Available within district partnerships.
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* the living photo — Karst nature set, breathing */}
                <motion.div variants={staggerChild} className="lg:[direction:ltr]">
                  <LivingPhoto
                    src={studio.image!}
                    alt={studio.alt!}
                    objectPosition={studio.imagePos}
                    className="aspect-[4/3] w-full"
                  />
                </motion.div>
              </motion.div>
            </section>
          )
        })}
      </div>

      {/* ══════════ PROOF — one cleared district voice ══════════ */}
      <section className="relative py-24 md:py-32 px-6 bg-surface">
        <motion.figure
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          <span
            aria-hidden="true"
            className="block font-editorial not-italic text-6xl md:text-7xl leading-none text-[#c79a4a]/45 select-none mb-4"
          >
            &ldquo;
          </span>
          <blockquote className="font-editorial italic text-2xl md:text-3xl lg:text-4xl text-on-surface leading-[1.18] mb-8">
            I&rsquo;ve literally cut my workload in half while accomplishing double the work.
          </blockquote>
          <figcaption className="font-label text-[10px] md:text-[11px] tracking-[0.22em] uppercase leading-loose">
            <span className="block text-on-surface/70">Tony Phan</span>
            <span className="text-on-surface-variant/55">
              Chief Communications Officer · Roseville Joint Union High School District
            </span>
          </figcaption>
        </motion.figure>
      </section>

      {/* ══════════ HOW DISTRICTS GET IT ══════════ */}
      <section id="partnership" className="relative py-28 md:py-36 px-6 bg-surface scroll-mt-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={staggerContainerRelaxed}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-6"
          >
            How Districts Get It
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="font-editorial italic text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-8 text-tropical-gradient"
          >
            Your people, each with a way in.
          </motion.h2>
          <motion.p
            variants={staggerChild}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-4"
          >
            Districts bring the studios to their people, each with their own
            login, configured to your district. The studios travel inside a
            district partnership, extending the practice to every seat. The
            capability stays with your people.
          </motion.p>
          <motion.p
            variants={staggerChild}
            className="font-editorial italic text-sm text-on-surface-variant/70"
          >
            Configured to your district, and yours to run.
          </motion.p>
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/45 mt-9"
          >
            Built and run by Karst ·{' '}
            <Link
              to="/about"
              className="text-tertiary/80 hover:text-tertiary border-b border-tertiary/30 pb-0.5 transition-colors"
            >
              About the firm
            </Link>
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative bg-[#0e0e0c] overflow-hidden px-6 text-center">
        <AmbientParticles tone="white" />
        <div className="relative z-10">
          <div className="w-16 h-px bg-white/10 mx-auto mt-20" />
          <motion.div
            className="py-20 md:py-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: easeStandard }}
          >
            <p className="font-label text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">
              By Introduction and Referral
            </p>
            <h2 className="font-headline text-3xl md:text-4xl text-white/90 leading-snug mb-4 max-w-2xl mx-auto">
              Bring the studios to your district.
            </h2>
            <p className="font-editorial italic text-white/40 text-sm mb-10 max-w-md mx-auto">
              Tell us about your district. We&rsquo;ll be in touch to learn more.
            </p>
            <Link
              to="/contact"
              className="btn-cycle inline-block py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px]"
            >
              Request an Introduction
            </Link>
          </motion.div>
          <div className="w-16 h-px bg-white/10 mx-auto mb-20" />
        </div>
      </section>
    </PageShell>
  )
}
