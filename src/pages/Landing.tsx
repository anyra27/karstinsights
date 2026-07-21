import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'
import PageShell from '../components/layout/PageShell'
import DashboardShowcase from '../components/sections/DashboardShowcase'
import ParallelAnalysisFan from '../components/sections/ParallelAnalysisFan'
import DistrictLeadershipProof from '../components/sections/DistrictLeadershipProof'
import FieldworkMethod from '../components/sections/FieldworkMethod'
import WhatTeamsBuild from '../components/sections/WhatTeamsBuild'
import PartnershipSequence from '../components/sections/PartnershipSequence'
import OperatingKitDiagram from '../components/art/OperatingKitDiagram'
import AmbientParticles from '../components/art/AmbientParticles'
import CinematicHomeHero from '../components/hero/CinematicHomeHero'

import { usePageMeta } from '../lib/usePageMeta'

/* District leadership proof — live testimonials provided for marketing use,
   with each leader's current role and organization stated individually. */
const SHOW_PROOF = true


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


      {/* ══════════ WHAT YOUR TEAM BUILDS — concrete evidence, straight after the hero ══════════ */}
      <WhatTeamsBuild />


      {/* ══════════ PROOF — DISTRICT LEADERS ══════════ */}
      {SHOW_PROOF && <DistrictLeadershipProof />}


      {/* ══════════ HOW THE PARTNERSHIP WORKS ══════════ */}
      <FieldworkMethod />


      {/* ══════════ THE OPERATING KIT — what Fieldwork leaves behind ══════════ */}
      <section className="relative overflow-hidden border-t border-[#1a1816]/8 bg-[#f6f4ec] px-6 py-24 text-[#1a1816] md:px-10 md:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(45,90,90,0.06),transparent_28%)]"
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
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#2d5a5a] md:text-[11px]"
            >
              The District AI Operating Kit
            </motion.p>

            <motion.h2
              variants={staggerChild}
              className="max-w-xl font-headline text-3xl font-light leading-[1.14] text-[#1a1816] md:text-5xl lg:text-[50px]"
            >
              Everything works,{' '}
              <span className="text-sunset-cycle inline-block pb-[0.1em] font-editorial font-normal italic">
                in one place.
              </span>
            </motion.h2>

            <motion.p
              variants={staggerChild}
              className="mt-7 max-w-[48ch] font-body text-sm leading-[1.85] text-[#6e6355] md:text-base"
            >
              Every dashboard, presentation, and application your team builds lives in one organized
              kit. Documented in plain language. Easy to find, easy to run again, easy to update,
              and easy to hand to the next person. Karst maintains it with you through the
              engagement, and the kit stays with the district.
            </motion.p>

            <motion.p
              variants={staggerChild}
              className="mt-8 border-l border-[#2d5a5a]/45 pl-5 font-label text-[9px] uppercase leading-[1.8] tracking-[0.24em] text-[#6e6355]/80"
            >
              District-owned · Built with Karst · Easy to continue
            </motion.p>
          </div>

          <motion.div variants={staggerChild}>
            <OperatingKitDiagram />
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════ DEMONSTRATION BAND — DASHBOARD SHOWCASE ══════════ */}
      <section
        id="live-dashboards"
        className="relative overflow-hidden border-t border-[#1a1816]/8 bg-[#fffcf7] px-6 py-24 text-[#1a1816] md:px-10 md:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(168,128,42,0.07),transparent_31%),linear-gradient(145deg,rgba(255,255,255,0.5),transparent_42%)]"
        />
        <motion.div
          className="relative z-10 mx-auto mb-14 grid max-w-6xl gap-8 md:mb-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          <div>
            <p className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
              In Practice
            </p>
            <h2 className="max-w-2xl font-headline text-3xl font-light leading-[1.14] text-[#1a1816] md:text-5xl lg:text-[54px]">
              A dashboard,{' '}
              <span className="font-editorial font-normal italic text-[#a8802a]">ready for the board.</span>
            </h2>
          </div>
          <p className="max-w-[48ch] font-body text-base leading-[1.85] text-[#6e6355] md:text-lg">
            A working example, built on district data. Explore it yourself.
          </p>
        </motion.div>

        {/* the scale of looking behind the dashboard — the briefing's dot field */}
        <div className="relative z-10">
          <ParallelAnalysisFan />
        </div>

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



      {/* ══════════ THE PARTNERSHIP — one engagement, built in sequence ══════════ */}
      <PartnershipSequence />


      {/* ══════════ THE STANDARD — big-picture close, bookend to the hero ══════════ */}
      <section
        data-karst-nav-dark
        className="relative min-h-[86svh] flex items-center overflow-hidden bg-[#0e0e0c]"
      >
        <AmbientParticles tone="white" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(90,106,170,0.12),transparent_52%),radial-gradient(circle_at_50%_120%,rgba(14,14,12,0.9),transparent_60%)]"
        />
        <motion.div
          className="relative z-10 mx-auto w-full max-w-4xl px-6 py-28 text-center md:py-36"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainerRelaxed}
        >
          <motion.p
            variants={staggerChild}
            className="mb-8 font-label text-[10px] uppercase tracking-[0.34em] text-[#8a8ec8]/70 md:text-[11px]"
          >
            The Standard
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="mx-auto max-w-[20ch] font-headline text-[clamp(34px,5.2vw,68px)] font-light leading-[1.08] tracking-[-0.02em] text-[#f3efe6]"
          >
            Few districts will ever build capability like this.{' '}
            <span className="text-sunset-cycle-light inline-block pb-[0.08em] font-editorial font-normal italic">
              Yours can be one of them.
            </span>
          </motion.h2>
          <motion.p
            variants={staggerChild}
            className="mx-auto mt-8 max-w-[50ch] font-body text-[15px] leading-[1.8] text-[#f3efe6]/64 md:text-[16.5px]"
          >
            It takes protected time and a partner who builds beside you. Karst gives district teams
            both, and the standing that comes with getting there first.
          </motion.p>
          <motion.div variants={staggerChild} className="mt-11">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 rounded-[3px] bg-[#f3efe6] px-10 py-4 font-headline text-xs uppercase tracking-widest text-[#0e0e0c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_44px_-14px_rgba(255,255,255,0.45)]"
            >
              Request an Introduction
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </PageShell>
  )
}
