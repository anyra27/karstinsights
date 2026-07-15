import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

const LayeredSineWaves = lazy(() => import('../components/art/LayeredSineWaves'))
import {
  fadeSlideUpDelayed,
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'
import PageShell from '../components/layout/PageShell'
import ParallaxImage from '../components/layout/ParallaxImage'
import DashboardShowcase from '../components/sections/DashboardShowcase'
import RosevilleProof from '../components/sections/RosevilleProof'
import RecastSurface from '../components/art/RecastSurface'
import WorkingSurfaceGlyph from '../components/art/WorkingSurfaceGlyph'
import AmbientParticles from '../components/art/AmbientParticles'
import {
  DashboardVignette,
  SpeakVignette,
  ConcertVignette,
  ToolVignette,
} from '../components/art/CapabilityVignettes'

import { usePageMeta } from '../lib/usePageMeta'
import pearlBg from '../assets/pearl-bg.webp'
import karstCavern from '../assets/karst-cavern.webp'
import gem4 from '../assets/gem4.webp'
import birdOfParadise from '../assets/bird-of-paradise.webp'
import koi from '../assets/koi.webp'

/* Roseville proof — live. Testimonial from Tony Phan, Chief Communications
   Officer, RJUHSD (provided for marketing use, 2026-06-03). */
const SHOW_PROOF = true

/* ── Capabilities — what the district's own team walks out able to deliver.
   Framed as outcomes the team provides the district, never as mechanism. ── */
const capabilities = [
  {
    Vignette: DashboardVignette,
    title: 'Decision intelligence from your own data.',
    desc: 'A raw export becomes a clear, board-ready view of what matters. Built by your team, owned by your district.',
  },
  {
    Vignette: SpeakVignette,
    title: 'Write once. Speak everywhere.',
    desc: 'One set of figures becomes a board memo, a family letter, and a public summary, each in your district’s voice.',
  },
  {
    Vignette: ConcertVignette,
    title: 'The right intelligence for the question.',
    desc: 'Not one tool, but several working in concert, matched to whatever your team needs to answer.',
  },
  {
    Vignette: ToolVignette,
    title: 'A working tool, not a demonstration.',
    desc: 'A form, a site, an application your team relies on. Not a prototype that gathers dust.',
  },
]

/* ── Offerings — Executive Workshop leads; the Residency is the mature state a
   district grows into; the Platform is the engine behind both. ── */
const offerings = [
  {
    label: 'Executive Workshop',
    title: 'Your team walks out able to build.',
    desc: 'An on-site intensive for superintendents and their cabinets. Your team builds real, board-ready work on your own data, and keeps the capability.',
    image: birdOfParadise,
  },
  {
    label: 'The Insights Residency',
    title: 'A year working alongside your team.',
    desc: 'When the work goes deeper, we partner with your team for a year: dashboards, design systems, operational rhythms, built together on your data. By Year 1’s end, your team owns the practice.',
    image: koi,
    imagePosition: 'right bottom',
  },
  {
    label: 'Karst Platform',
    title: 'The platform behind the work.',
    desc: 'Learning Studio, Data Studio, and Karst Frame: the system that makes the practice compound.',
    image: gem4,
    link: '/studios',
    linkLabel: 'See the Studios',
    external: false,
  },
]

/* ════════════════════════════════════════ */

export default function Landing() {
  usePageMeta()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0])

  return (
    <PageShell activeNav="home">

      {/* ══════════ HERO ══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-end pb-24 md:pb-32 px-8 md:px-16 overflow-hidden bg-[#F0EEE6]"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <Suspense fallback={<div className="w-full h-full bg-[#F0EEE6]" />}>
            <LayeredSineWaves className="w-full h-full" />
          </Suspense>
        </motion.div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F0EEE6] via-[#F0EEE6]/40 to-transparent pointer-events-none" />

        <motion.div className="relative z-10 max-w-4xl pointer-events-none" style={{ opacity: heroOpacity }}>
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-6"
          >
            Practical AI Capability for School District Leadership
          </motion.p>

          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-on-surface leading-[1.02] mb-12 max-w-3xl"
          >
            Build capability that <span className="text-sunset-cycle">lasts.</span>
          </motion.h1>

          <motion.div
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="flex flex-wrap gap-4 pointer-events-auto"
          >
            <Link
              to="/contact"
              className="inline-block bg-[#1a1816] text-[#F0EEE6] py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:bg-[#0e0e0c] transition-colors"
            >
              Request an Introduction
            </Link>
            <Link
              to="/studios"
              className="inline-block border border-[#1a1816]/25 text-[#1a1816]/75 py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:border-[#1a1816]/50 hover:text-[#1a1816] transition-all"
            >
              See the Studios
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.5, duration: 0.5 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-30">
            <path d="M7 10l5 5 5-5" stroke="#1a1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>


      {/* ══════════ THE PROMISE — capability your team reaches ══════════ */}
      <section className="relative py-20 md:py-28 px-6 md:px-10 bg-surface overflow-hidden">
        <motion.div
          className="relative z-10 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/55 text-center mb-6"
          >
            Capability
          </motion.p>

          <motion.h2
            variants={staggerChild}
            className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug text-center max-w-3xl mx-auto mb-12 md:mb-14"
          >
            Your cabinet learns to build the systems, tools, and habits that make the district more capable.{' '}
            <span className="font-editorial italic font-normal">Not just talk about AI.</span>
          </motion.h2>

          <motion.div
            variants={staggerChild}
            className="w-full max-w-3xl mx-auto"
          >
            <WorkingSurfaceGlyph />
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════ BENEATH THE SURFACE — the karst story ══════════ */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
        <ParallaxImage src={karstCavern} className="min-h-[360px] md:min-h-0" />
        <div className="relative flex items-center px-10 md:px-16 lg:px-20 py-16 md:py-0 bg-surface-container">
          <motion.div
            className="relative z-10 max-w-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: easeStandard }}
          >
            <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
              Beneath the Surface
            </p>
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-5">
              The system beneath the surface.
            </h2>
            <div className="w-10 h-px bg-tertiary/40 mb-5" />
            <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
              A karst is a landscape shaped from below: structure carved into stone, unseen
              from above. A district holds the same hidden order. Your team learns to read
              what&rsquo;s underneath, and to act on it.
            </p>
          </motion.div>
        </div>
      </section>


      {/* ══════════ PROOF — ROSEVILLE (shared with /workshop) ══════════ */}
      {SHOW_PROOF && <RosevilleProof />}


      {/* ══════════ WHAT YOUR TEAM DELIVERS — capabilities ══════════ */}
      <section className="relative py-16 md:py-32 px-6 md:px-10 bg-surface overflow-hidden">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-14 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/55 mb-6"
          >
            What Your Team Delivers
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-5"
          >
            A new way to <span className="font-editorial italic font-normal">lead your district.</span>
          </motion.h2>
          <motion.div variants={staggerChild} className="w-10 h-px bg-tertiary/40 mx-auto mb-6" />
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-tertiary/70"
          >
            Insight · Direction · Clarity · Speed · Innovation
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainerRelaxed}
        >
          {capabilities.map((cap) => {
            const Vignette = cap.Vignette
            return (
              <motion.div
                key={cap.title}
                variants={staggerChild}
                className="ghost-border flex flex-col overflow-hidden"
              >
                <Vignette className="w-full border-b border-[#1e2a4a]/[0.08] bg-[#fffcf7] px-2 pt-3" />
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <h3 className="font-headline text-base md:text-lg text-on-surface leading-snug mb-3">
                    {cap.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed text-center max-w-2xl mx-auto mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          The point was never the technology. It is the insight, the clarity, and the command it
          puts in your team&rsquo;s hands.
        </motion.p>
      </section>


      {/* ══════════ DEMONSTRATION BAND — DASHBOARD SHOWCASE ══════════ */}
      <section className="relative py-28 md:py-36 px-6 bg-surface-container overflow-hidden">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          <p className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary mb-5">
            Built On Your Own Data
          </p>
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-5">
            A working dashboard,<br className="hidden md:inline" /> ready for the board.
          </h2>
          <div className="w-10 h-px bg-tertiary/40 mx-auto mb-5" />
          <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            The kind of working surface your team builds and owns, clear enough to show in the
            boardroom, current enough to trust.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: easeStandard, delay: 0.15 }}
        >
          <DashboardShowcase />
        </motion.div>
      </section>


      {/* ══════════ THE STANDARD — marks of mastery ══════════ */}
      <section
        className="relative py-32 md:py-44 px-6 overflow-hidden"
        style={{ backgroundImage: `url(${pearlBg})`, backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-surface/88" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-8"
          >
            The Standard
          </motion.p>

          <motion.h2
            variants={staggerChild}
            className="font-editorial italic text-4xl md:text-5xl lg:text-6xl text-on-surface leading-[1.18] pb-3 mb-3 tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(135deg, #1e2a4a 0%, #4a6a8a 55%, #4a2d5a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Mastery, not familiarity.
          </motion.h2>

          <motion.p
            variants={staggerChild}
            className="font-body text-lg md:text-xl lg:text-2xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Not passing familiarity with the tools. Genuine command of the work.
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="max-w-3xl mx-auto mb-10"
          >
            <RecastSurface className="w-full" />
          </motion.div>

        </motion.div>
      </section>


      {/* ══════════ OFFERINGS — EDITORIAL SPLITS ══════════ */}
      {offerings.map((item, i) => {
        const isFlipped = i % 2 === 1
        return (
        <section
          key={item.label}
          className="grid grid-cols-1 md:grid-cols-2 min-h-[650px]"
        >
          {/* Image — alternates sides */}
          <ParallaxImage
            src={item.image}
            objectPosition={'imagePosition' in item ? (item.imagePosition as string) : undefined}
            className={`min-h-[400px] md:min-h-0 ${isFlipped ? 'order-1 md:order-2' : ''}`}
          />

          {/* Content */}
          <div
            className={`relative flex items-center px-10 md:px-16 lg:px-20 py-16 md:py-0 ${
              isFlipped ? 'order-2 md:order-1 bg-surface-container' : ''
            }`}
            style={!isFlipped ? { backgroundImage: `url(${pearlBg})`, backgroundSize: 'cover' } : undefined}
          >
            {!isFlipped && <div className="absolute inset-0 bg-surface/88" />}
            <motion.div
              className={`relative z-10 max-w-lg ${isFlipped ? 'md:ml-auto' : ''}`}
              initial={{ opacity: 0, x: isFlipped ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: easeStandard }}
            >
              <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
                {item.label}
              </p>
              <h2 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-4">
                {item.title}
              </h2>
              <div className="w-10 h-px bg-tertiary/40 mb-5" />
              <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
                {item.desc}
              </p>
              {item.link &&
                (item.external ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-headline text-xs uppercase tracking-widest text-primary hover:text-primary-dim transition-colors inline-flex items-center gap-2"
                  >
                    {item.linkLabel} <span className="text-[10px]">↗</span>
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className="font-headline text-xs uppercase tracking-widest text-primary hover:text-primary-dim transition-colors"
                  >
                    {item.linkLabel} →
                  </Link>
                ))}
            </motion.div>
          </div>
        </section>
        )
      })}


      {/* ══════════ DARK CTA — ambition + the leader who brought it ══════════ */}
      <section className="relative bg-[#0e0e0c] overflow-hidden">
        <AmbientParticles tone="white" />
        <div className="relative z-10">
          <div className="w-16 h-px bg-white/10 mx-auto mt-20" />

          <motion.div
            className="py-24 px-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: easeStandard }}
          >
            <div className="max-w-2xl mx-auto">
              <p className="font-label text-[10px] tracking-[0.3em] uppercase text-white/35 mb-6">
                Reserved · By Introduction
              </p>
              <h2 className="font-headline text-3xl md:text-4xl text-white/95 leading-snug mb-6 max-w-xl mx-auto">
                Be the most capable district in your region.
              </h2>
              <p className="font-body text-sm md:text-base text-white/45 leading-relaxed max-w-lg mx-auto mb-12">
                The capability lives in your own people, and it stays there.
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
