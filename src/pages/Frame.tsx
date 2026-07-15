import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import CubeField from '../components/art/CubeField'
import AmbientParticles from '../components/art/AmbientParticles'
import DashboardShowcase from '../components/sections/DashboardShowcase'
import { ConversationGlyph, SynthesisGlyph, PublishedGlyph } from '../components/art/WorkflowGlyphs'
import WorkingSurfaceGlyph from '../components/art/WorkingSurfaceGlyph'
import { fadeSlideUpDelayed, staggerContainerRelaxed, staggerChild, easeStandard } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

export default function Frame() {
  usePageMeta(
    'Karst Frame',
    'Turn a working dashboard from a single conversation into a live page. Karst Frame publishes the work your team builds.',
  )
  return (
    <PageShell activeNav="frame">
      {/* ══════════ HERO ══════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#F0EEE6' }}
      >
        {/* Cube particle field — drifts behind everything */}
        <CubeField />

        {/* Gradient wash to keep text readable through the cubes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(240, 238, 230, 0.55) 0%, rgba(240, 238, 230, 0.85) 60%, rgba(240, 238, 230, 0.95) 100%)',
          }}
        />

        {/* Hero copy */}
        <div className="relative z-10 px-8 md:px-16 max-w-5xl mx-auto text-center pointer-events-none">
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.36em] uppercase text-on-surface-variant/70 mb-8"
          >
            Karst Frame
          </motion.p>

          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-on-surface leading-[1.02] mb-10 max-w-4xl mx-auto"
          >
            From any AI to <span className="text-sunset-cycle">published</span>.
          </motion.h1>

          <motion.div
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.55}
            className="flex flex-wrap gap-4 justify-center pointer-events-auto"
          >
            <Link
              to="/contact"
              className="inline-block bg-[#1a1816] text-[#F0EEE6] py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:bg-[#0e0e0c] transition-colors"
            >
              Request a Conversation
            </Link>
            <a
              href="#in-action"
              className="inline-block border border-[#1a1816]/25 text-[#1a1816]/75 py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:border-[#1a1816]/50 hover:text-[#1a1816] transition-all"
            >
              See It in Action
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 0.5 },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-30">
            <path
              d="M7 10l5 5 5-5"
              stroke="#1a1816"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* ══════════ THE CAPABILITY ══════════ */}
      <section className="relative py-32 md:py-44 px-6 bg-surface">
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
            The Capability
          </motion.p>

          <motion.h2
            variants={staggerChild}
            className="font-editorial italic text-3xl md:text-4xl lg:text-5xl text-on-surface leading-[1.1] mb-16 text-center max-w-3xl mx-auto"
            style={{
              backgroundImage: 'linear-gradient(135deg, #1e2a4a 0%, #4a6a8a 55%, #4a2d5a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            A working surface for whatever your AI built.
          </motion.h2>

          {/* Animated working-surface glyph — scattered → settled lattice with
              denser dashboard pockets and edge-fade for scrollable feel */}
          <motion.div
            variants={staggerChild}
            className="max-w-3xl mx-auto mb-16 md:mb-20"
          >
            <WorkingSurfaceGlyph />
          </motion.div>

          <motion.ul
            variants={staggerChild}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-left"
          >
            <li>
              <h3 className="font-headline text-lg md:text-xl text-on-surface leading-snug mb-2">
                Live and shareable in a link.
              </h3>
              <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                Not a screenshot. Not a PDF. A working page your team can open, comment on, and refresh against the latest data.
              </p>
            </li>
            <li>
              <h3 className="font-headline text-lg md:text-xl text-on-surface leading-snug mb-2">
                Branded the way your district presents.
              </h3>
              <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                Your typography, your palette, your voice. The artifact looks like it came from your communications team. Because, in effect, it did.
              </p>
            </li>
            <li>
              <h3 className="font-headline text-lg md:text-xl text-on-surface leading-snug mb-2">
                Editable by anyone in the room.
              </h3>
              <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                A new question doesn&rsquo;t wait on anyone. The next conversation produces the next page.
              </p>
            </li>
          </motion.ul>
        </motion.div>
      </section>

      {/* ══════════ THE WORKFLOW ══════════ */}
      <section className="relative py-32 md:py-40 px-6 bg-surface overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-tertiary/20" />
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
            How Frame Works
          </motion.p>

          <motion.h2
            variants={staggerChild}
            className="font-headline text-3xl md:text-5xl lg:text-6xl text-on-surface leading-[1.05] mb-20 md:mb-24 text-center max-w-3xl mx-auto"
          >
            Three steps. <span className="font-editorial italic">No ceremony.</span>
          </motion.h2>

          <motion.ol
            variants={staggerChild}
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-16"
          >
            {/* 01 — Conversation */}
            <li className="text-center">
              <div className="w-36 h-36 md:w-40 md:h-40 mx-auto mb-8">
                <ConversationGlyph />
              </div>
              <p className="font-label text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-tertiary/60 mb-4 tabular-nums">
                01 · Build
              </p>
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-4">
                Build it in your AI.
              </h3>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                Whatever tool fits the job. Chat, deep research, the prompt library you already trust. Frame works with what you use.
              </p>
            </li>

            {/* 02 — Synthesis */}
            <li className="text-center">
              <div className="w-36 h-36 md:w-40 md:h-40 mx-auto mb-8">
                <SynthesisGlyph />
              </div>
              <p className="font-label text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-tertiary/60 mb-4 tabular-nums">
                02 · Bring
              </p>
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-4">
                Bring it to Frame.
              </h3>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                Drop in the artifact. Frame composes the layout, brands the surface, frames the work: tables, charts, narrative arranged together.
              </p>
            </li>

            {/* 03 — Published */}
            <li className="text-center">
              <div className="w-36 h-36 md:w-40 md:h-40 mx-auto mb-8">
                <PublishedGlyph />
              </div>
              <p className="font-label text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-tertiary/60 mb-4 tabular-nums">
                03 · Publish
              </p>
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug mb-4">
                Send the link.
              </h3>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                Live the moment you publish it. Ready for the room. The next artifact arrives the same way.
              </p>
            </li>
          </motion.ol>
        </motion.div>
      </section>


      {/* ══════════ DEMOS ══════════ */}
      <section
        id="in-action"
        className="relative py-28 md:py-36 px-6 bg-surface-container overflow-hidden scroll-mt-24"
      >
        <motion.div
          className="max-w-3xl mx-auto text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          <p className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary mb-5">
            Frame · In Action
          </p>
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-5">
            Two surfaces. One conversation each.
          </h2>
          <div className="w-10 h-px bg-tertiary/40 mx-auto mb-5" />
          <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            Demo dashboards rendered the way Frame publishes them: clickable, styled, ready to share.
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

      {/* ══════════ THE OUTCOMES ══════════ */}
      <section className="relative py-32 md:py-40 px-6 bg-surface">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={staggerContainerRelaxed}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={staggerChild}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-8"
          >
            The Outcome
          </motion.p>

          <motion.h2
            variants={staggerChild}
            className="font-editorial italic text-4xl md:text-5xl lg:text-6xl text-on-surface leading-[1.05] mb-6 tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(135deg, #1e2a4a 0%, #4a6a8a 55%, #4a2d5a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Walk into the room with the answer.
          </motion.h2>

          <motion.p
            variants={staggerChild}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto mb-14"
          >
            The board meets in the morning. The question came up last night. Frame is the difference between a placeholder slide and a page everyone can see.
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="w-12 h-px bg-tertiary/30 mx-auto mb-12"
          />

          <motion.ul
            variants={staggerChild}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left md:text-center"
          >
            <li>
              <p className="font-headline text-3xl md:text-4xl font-light text-on-surface tabular-nums tracking-tight mb-2">
                Immediate
              </p>
              <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed">
                From the question being asked to the page being open in the room.
              </p>
            </li>
            <li>
              <p className="font-headline text-3xl md:text-4xl font-light text-on-surface tabular-nums tracking-tight mb-2">
                Shareable
              </p>
              <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed">
                Send the link. The whole conversation comes with it.
              </p>
            </li>
            <li>
              <p className="font-headline text-3xl md:text-4xl font-light text-on-surface tabular-nums tracking-tight mb-2">
                Repeatable
              </p>
              <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed">
                Anyone on your team can run the next one. The capability stays in the room.
              </p>
            </li>
          </motion.ul>
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
              See Frame on your data.
            </h2>
            <p className="font-editorial italic text-white/40 text-sm mb-10 max-w-md mx-auto">
              We'll walk through it on a working surface, yours or ours.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#0e0e0c] py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:bg-white/90 transition-colors"
            >
              Request a Conversation
            </Link>
          </motion.div>
          <div className="w-16 h-px bg-white/10 mx-auto mb-20" />
        </div>
      </section>
    </PageShell>
  )
}
