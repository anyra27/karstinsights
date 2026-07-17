import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'
import PageShell from '../components/layout/PageShell'
import DashboardShowcase from '../components/sections/DashboardShowcase'
import DistrictLeadershipProof from '../components/sections/DistrictLeadershipProof'
import CapabilityGap from '../components/sections/CapabilityGap'
import FieldworkMethod from '../components/sections/FieldworkMethod'
import EngagementPaths from '../components/sections/EngagementPaths'
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
    title: 'See what matters.',
    desc: 'Turn raw district data into a board-ready view.',
  },
  {
    Vignette: SpeakVignette,
    title: 'One source. Every audience.',
    desc: 'Move from figures to memos, letters, and public updates.',
  },
  {
    Vignette: ConcertVignette,
    title: 'Use the right intelligence.',
    desc: 'Match the method to the question.',
  },
  {
    Vignette: ToolVignette,
    title: 'Build what the work needs.',
    desc: 'Forms, sites, and applications your team can use.',
  },
]

/* ── Three ways into the work: focused workshops, sustained fieldwork,
   and role-specific learning platforms. ── */
const offerings = [
  {
    label: 'Workshops',
    title: 'Build something real.',
    desc: 'Focused sessions built around live district priorities.',
    image: birdOfParadise,
    link: '/contact',
  },
  {
    label: 'Fieldwork',
    title: 'Build capability in the work.',
    desc: 'A school-year practice of building, operating, and improving alongside your team.',
    image: koi,
    imagePosition: 'right bottom',
    link: '/cohort/',
    native: true,
  },
  {
    label: 'Learning Platforms',
    title: 'Practice that scales.',
    desc: 'Role-specific studios for leaders, educators, students, and families.',
    image: gem4,
    link: '/studios',
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


      {/* ══════════ THREE DOORS — strong imagery and the offer architecture ══════════ */}
      <EngagementPaths paths={offerings} />


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
              Every engagement leaves a district-owned system for continuing the work.
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
            What Teams Make
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-5"
          >
            Real work. <span className="font-editorial italic font-normal">Ready to use.</span>
          </motion.h2>
          <motion.div variants={staggerChild} className="w-10 h-px bg-tertiary/40 mx-auto" />
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 border-t border-on-surface/10 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainerRelaxed}
        >
          {capabilities.map((cap, index) => {
            const Vignette = cap.Vignette
            return (
              <motion.article
                key={cap.title}
                variants={staggerChild}
                className="group relative grid min-h-[250px] items-center gap-4 border-b border-on-surface/10 py-8 sm:grid-cols-[0.88fr_1.12fr] md:gap-6 md:px-8 md:py-10 md:odd:border-r md:odd:pl-0 md:even:pr-0"
              >
                <span className="absolute left-0 top-5 font-label text-[8px] tracking-[0.24em] text-[#a8802a]/65 md:top-7">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Vignette className="w-full px-1 pt-5 sm:px-0 sm:pt-0" />
                <div className="flex flex-col py-1">
                  <h3 className="mb-3 font-headline text-lg leading-snug text-on-surface md:text-xl">
                    {cap.title}
                  </h3>
                  <p className="max-w-[34ch] font-body text-sm leading-relaxed text-on-surface-variant/75">
                    {cap.desc}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

      </section>


      {/* ══════════ DEMONSTRATION BAND — DASHBOARD SHOWCASE ══════════ */}
      <section
        data-karst-nav-dark
        className="relative overflow-hidden border-t border-white/8 bg-[#090908] px-6 py-24 text-[#fffcf7] md:px-10 md:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(196,154,67,0.12),transparent_31%),linear-gradient(145deg,rgba(255,255,255,0.025),transparent_42%)]"
        />
        <motion.div
          className="relative z-10 mx-auto mb-14 grid max-w-6xl gap-8 md:mb-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          <div>
            <p className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#c49a43] md:text-[11px]">
              In Practice
            </p>
            <h2 className="max-w-2xl font-headline text-3xl font-light leading-[1.14] text-[#fffcf7] md:text-5xl lg:text-[54px]">
              A dashboard,{' '}
              <span className="font-editorial font-normal italic text-[#e6d8b9]">ready for the board.</span>
            </h2>
          </div>
          <p className="max-w-[48ch] font-body text-base leading-[1.85] text-[#fffcf7]/60 md:text-lg">
            Built on district data. Clear enough to act on.
          </p>
        </motion.div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: easeStandard, delay: 0.15 }}
        >
          <DashboardShowcase />
        </motion.div>
      </section>


      {/* ══════════ CONTINUATION — the test of real capability ══════════ */}
      <section
        data-karst-nav-dark
        className="relative overflow-hidden bg-[#0e0e0c] px-6 py-24 text-[#fffcf7] md:px-10 md:py-36"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(196,154,67,0.1),transparent_30%)]"
        />
        <motion.div
          className="relative z-10 mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-24">
            <div>
              <motion.p
                variants={staggerChild}
                className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#c49a43] md:text-[11px]"
              >
                The Test
              </motion.p>
              <motion.h2
                variants={staggerChild}
                className="font-headline text-4xl font-light leading-[1.1] md:text-6xl"
              >
                The work keeps{' '}
                <span className="font-editorial font-normal italic text-[#e6d8b9]">moving.</span>
              </motion.h2>
            </div>
            <motion.p
              variants={staggerChild}
              className="max-w-[56ch] self-end font-body text-base leading-[1.85] text-[#fffcf7]/62 md:text-lg"
            >
              Operate it. Improve it. Extend the practice.
            </motion.p>
          </div>

          <motion.div
            variants={staggerChild}
            className="relative mt-16 grid border-y border-[#fffcf7]/10 md:mt-24 md:grid-cols-3"
          >
            {[
              ['01', 'Operate', 'Use it in the work.'],
              ['02', 'Improve', 'Refine it as conditions change.'],
              ['03', 'Extend', 'Carry the practice forward.'],
            ].map(([number, title, detail], index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: easeStandard }}
                className="relative border-b border-[#fffcf7]/10 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <span className="mb-10 block font-label text-[9px] tracking-[0.24em] text-[#c49a43]/75">
                  {number}
                </span>
                <h3 className="mb-3 font-headline text-xl text-[#fffcf7]">{title}</h3>
                <p className="max-w-[34ch] font-body text-sm leading-relaxed text-[#fffcf7]/50">
                  {detail}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>


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
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2.5 bg-white text-[#0e0e0c] py-4 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-14px_rgba(255,255,255,0.45)]"
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
