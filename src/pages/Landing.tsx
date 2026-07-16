import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'
import PageShell from '../components/layout/PageShell'
import ParallaxImage from '../components/layout/ParallaxImage'
import DashboardShowcase from '../components/sections/DashboardShowcase'
import DistrictLeadershipProof from '../components/sections/DistrictLeadershipProof'
import CapabilityGap from '../components/sections/CapabilityGap'
import FieldworkMethod from '../components/sections/FieldworkMethod'
import RecastSurface from '../components/art/RecastSurface'
import OperatingKitDiagram from '../components/art/OperatingKitDiagram'
import AmbientParticles from '../components/art/AmbientParticles'
import CinematicHomeHero from '../components/hero/CinematicHomeHero'
import {
  DashboardVignette,
  SpeakVignette,
  ConcertVignette,
  ToolVignette,
} from '../components/art/CapabilityVignettes'

import { usePageMeta } from '../lib/usePageMeta'
import pearlBg from '../assets/pearl-bg.webp'
import gem4 from '../assets/gem4.webp'
import birdOfParadise from '../assets/bird-of-paradise.webp'
import koi from '../assets/koi.webp'

/* District leadership proof — live testimonials provided for marketing use,
   with each leader's current role and organization stated individually. */
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

  return (
    <PageShell activeNav="home">

      {/* ══════════ HERO ══════════ */}
      <CinematicHomeHero />
      <div
        className="h-px bg-gradient-to-r from-transparent via-[#a8802a]/65 to-transparent opacity-70"
        aria-hidden="true"
      />


      {/* ══════════ THE PROBLEM — why access is not capability ══════════ */}
      <CapabilityGap />


      {/* ══════════ PROOF — DISTRICT LEADERS ══════════ */}
      {SHOW_PROOF && <DistrictLeadershipProof />}


      {/* ══════════ FIELDWORK — the response ══════════ */}
      <FieldworkMethod />


      {/* ══════════ THE OPERATING KIT — what Fieldwork leaves behind ══════════ */}
      <section
        data-karst-nav-dark
        className="relative overflow-hidden border-t border-[#fffcf7]/8 bg-[#090908] px-6 py-24 text-[#fffcf7] md:px-10 md:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(168,128,42,0.12),transparent_28%),linear-gradient(155deg,rgba(255,255,255,0.025),transparent_46%)]"
        />
        <motion.div
          className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <div>
            <motion.p
              variants={staggerChild}
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#c49a43] md:text-[11px]"
            >
              District AI Operating Kits
            </motion.p>

            <motion.h2
              variants={staggerChild}
              className="max-w-xl font-headline text-3xl font-light leading-[1.14] text-[#fffcf7] md:text-5xl lg:text-[50px]"
            >
              Built in the work.{' '}
              <span className="font-editorial font-normal italic text-[#e6d8b9]">Kept by the district.</span>
            </motion.h2>

            <motion.p
              variants={staggerChild}
              className="mt-7 max-w-[48ch] font-body text-sm leading-[1.85] text-[#fffcf7]/60 md:text-base"
            >
              Fieldwork leaves behind more than a finished artifact. It becomes a district-owned
              operating kit: the context, guardrails, workflows, tools, and patterns your team needs
              to keep the capability moving.
            </motion.p>

            <motion.p
              variants={staggerChild}
              className="mt-8 border-l border-[#c49a43]/45 pl-5 font-label text-[9px] uppercase leading-[1.8] tracking-[0.24em] text-[#fffcf7]/38"
            >
              District-owned · Designed and maintained by Karst
            </motion.p>
          </div>

          <motion.div variants={staggerChild}>
            <OperatingKitDiagram />
          </motion.div>
        </motion.div>
      </section>


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
                <Vignette className="w-full border-b border-black/40 bg-[#0e0e0c] px-2 py-4" />
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
