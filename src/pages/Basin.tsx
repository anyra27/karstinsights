import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import AmbientParticles from '../components/art/AmbientParticles'
import LivingPhoto from '../components/art/LivingPhoto'
import { usePageMeta } from '../lib/usePageMeta'
import mirrorPoolImg from '../assets/mirror-pool.webp'
import cairnImg from '../assets/cairn.webp'
import tidePoolImg from '../assets/tide-pool.webp'
import slotCanyonImg from '../assets/slot-canyon.webp'
import {
  fadeSlideUpDelayed,
  staggerContainerRelaxed,
  staggerChild,
  easeStandard,
} from '../lib/motion'

/* ── Basin — the marketing homepage for Karst Basin. Outcome-level only:
   what a district gets, never how the machinery works. No pricing, no
   district names, no method detail. Compliance language is exact — Basin
   is "architected to best practices"; it does not make a regulatory certification claim. ── */

type BasinChapter = {
  id: string
  eyebrow: string
  title: string
  body: string
  fact: string
  image: string
  alt: string
  imagePos?: string
}

const chapters: BasinChapter[] = [
  {
    id: 'compose',
    eyebrow: 'The Conversation',
    title: 'Ask in plain language. Watch the answer form.',
    body: 'No canvas to learn, no chart library to fight. Describe what you want to understand, and the dashboard composes itself in front of you: attendance by school, grades by student group, the trend since fall. Refine it by talking.',
    fact: 'Every number computed from your data · every answer begins with a sentence',
    image: mirrorPoolImg,
    alt: 'A still mountain pool holding a perfect reflection: the data, ready to read.',
    imagePos: 'center',
  },
  {
    id: 'decks',
    eyebrow: 'The Boardroom',
    title: 'From working dashboard to board deck.',
    body: 'The dashboard you built in the morning becomes the presentation you give that night: charts redrawn to an editorial standard, findings stated plainly, methodology noted. It reads like it was made by hand, because the standard it fills was.',
    fact: 'Board-ready output · downloadable, presentable, on your letterhead',
    image: cairnImg,
    alt: 'A cairn of carefully stacked stones: deliberate, balanced, built to be seen.',
    imagePos: 'center',
  },
  {
    id: 'community',
    eyebrow: 'The Community',
    title: 'Publish what the public should see.',
    body: 'Accountability reports, school-site pages, family surveys: published from the same place the data lives, scoped to exactly what each audience should see, current every time it is opened. A link or a QR code is all anyone needs.',
    fact: 'Public reports and forms · always current, never a stale PDF',
    image: tidePoolImg,
    alt: 'A tide pool at the edge of the sea: a small, clear window into deep water.',
    imagePos: 'center',
  },
  {
    id: 'intake',
    eyebrow: 'The Door',
    title: 'One governed door in.',
    body: 'Data enters Basin through a single, watched entrance. What comes in is classified, mapped, and logged; what was never agreed to is refused at the threshold, with the reason stated. Your data custodian can see the whole picture at a glance.',
    fact: 'Field-level control · full provenance on every file that enters',
    image: slotCanyonImg,
    alt: 'A slot canyon carved by water: one narrow, deliberate channel through stone.',
    imagePos: 'center',
  },
]

const standard = [
  {
    title: 'The read, not the chart.',
    body: 'Basin leads with the finding in a sentence, then shows the numbers behind it. You leave understanding something, not squinting at a legend.',
  },
  {
    title: 'True numbers only.',
    body: 'Every figure is computed directly from your data. The writing explains the numbers; it never invents them.',
  },
  {
    title: 'Governed by design.',
    body: 'Architected to FERPA and NDPA best practices. Student data is served only as protected aggregates, behind a signed data-privacy agreement.',
  },
]

export default function Basin() {
  usePageMeta(
    'Karst Basin',
    'Karst Basin is a premium data platform for school districts: ask in plain language, and dashboards, board decks, and public reports form in front of you, governed at the door.',
  )

  return (
    <PageShell>
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-end pb-24 md:pb-32 px-8 md:px-16 overflow-hidden bg-[#F0EEE6]">
        <AmbientParticles />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#F0EEE6] via-[#F0EEE6]/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.36em] uppercase text-on-surface-variant/70 mb-6"
          >
            Karst · Basin
          </motion.p>
          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-5xl md:text-7xl text-on-surface leading-[1.02] mb-8"
          >
            Your district&rsquo;s data,{' '}
            <span className="font-editorial italic font-normal text-sunset-cycle">
              ready to read.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.42}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-4"
          >
            Basin collects a district&rsquo;s data in one governed place and turns it into
            the things leadership actually needs: a dashboard that answers the question,
            a deck for tonight&rsquo;s board meeting, a report the community can open.
          </motion.p>
          <motion.div
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.55}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link
              to="/contact"
              className="btn-cycle inline-block py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px]"
            >
              Request an Introduction
            </Link>
            <a
              href="#compose"
              className="inline-block border border-[#1a1816]/25 text-[#1a1816]/75 py-3.5 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:border-[#1a1816]/50 hover:text-[#1a1816] transition-all"
            >
              See What It Does
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
            Not a cockpit of charts.{' '}
            <span className="font-editorial italic font-normal text-tropical-gradient">
              A briefing.
            </span>
          </motion.h2>
          <motion.ul
            variants={staggerChild}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
          >
            {standard.map((s) => (
              <li key={s.title} className="text-left md:text-center">
                <div className="w-8 h-px bg-tertiary/50 mb-6 md:mx-auto" />
                <h3 className="font-editorial italic text-xl md:text-2xl text-on-surface mb-3">
                  {s.title}
                </h3>
                <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* ══════════ THE FOUR CHAPTERS ══════════ */}
      <div id="chapters">
        {chapters.map((chapter, i) => {
          const tinted = i % 2 === 0
          const reversed = i % 2 === 1
          return (
            <section
              key={chapter.id}
              id={chapter.id}
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
                <div className="lg:[direction:ltr]">
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-tertiary/75 mb-5"
                  >
                    {chapter.eyebrow}
                  </motion.p>
                  <motion.h2
                    variants={staggerChild}
                    className="font-headline text-3xl md:text-4xl text-on-surface leading-[1.08] mb-6"
                  >
                    {chapter.title}
                  </motion.h2>
                  <motion.p
                    variants={staggerChild}
                    className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-6"
                  >
                    {chapter.body}
                  </motion.p>
                  <motion.p
                    variants={staggerChild}
                    className="font-label text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/60"
                  >
                    {chapter.fact}
                  </motion.p>
                </div>

                <motion.div variants={staggerChild} className="lg:[direction:ltr]">
                  <LivingPhoto
                    src={chapter.image}
                    alt={chapter.alt}
                    objectPosition={chapter.imagePos}
                    className="aspect-[4/3] w-full"
                  />
                </motion.div>
              </motion.div>
            </section>
          )
        })}
      </div>

      {/* ══════════ GOVERNANCE — the trust anchor ══════════ */}
      <section className="relative py-24 md:py-32 px-6 bg-surface">
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
            Data Stewardship
          </motion.p>
          <motion.h2
            variants={staggerChild}
            className="font-editorial italic text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-8 text-tropical-gradient"
          >
            Built for the data you cannot afford to mishandle.
          </motion.h2>
          <motion.p
            variants={staggerChild}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-4"
          >
            Basin is architected to FERPA and NDPA best practices. Each district runs in
            its own isolated instance. Student data is served only as protected
            aggregates, never as individual records, and only behind a signed
            data-privacy agreement. Every AI request is logged and auditable, and the
            record shows exactly what was sent.
          </motion.p>
          <motion.p
            variants={staggerChild}
            className="font-editorial italic text-sm text-on-surface-variant/70"
          >
            The platform enforces the agreement. It does not rely on someone remembering it.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ HOW DISTRICTS GET IT ══════════ */}
      <section id="partnership" className="relative py-24 md:py-32 px-6 bg-[#F0EEE6] scroll-mt-20">
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
            className="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface leading-snug mb-8 max-w-2xl mx-auto"
          >
            Invitation-only, a few districts at a time.
          </motion.h2>
          <motion.p
            variants={staggerChild}
            className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-4"
          >
            Basin is not self-serve software. Each district&rsquo;s instance is set up,
            branded, and run with the firm, and the roster is deliberately small so every
            district gets the same standard of care.
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
              Bring Basin to your district.
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
