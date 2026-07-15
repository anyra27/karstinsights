import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import { fadeSlideUpDelayed } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

/* A note on the name — the firm formerly known as Anyra now operates as
   Karst. Quiet, stated once. Lives at /from-anyra (and /anyra) so the old
   name resolves here. */

export default function Note() {
  usePageMeta(
    'Anyra is now Karst',
    'The firm formerly known as Anyra now operates as Karst. Same people, same practice, same standard. Engagements, agreements, and the platform continue unchanged.',
  )

  return (
    <PageShell>
      <section className="relative min-h-screen flex items-center px-8 md:px-16 bg-[#F0EEE6]">
        <div className="max-w-2xl mx-auto py-40">
          <motion.p
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-6"
          >
            A Note on the Name
          </motion.p>

          <motion.h1
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-headline font-bold tracking-tight text-4xl md:text-5xl text-on-surface leading-[1.05] mb-8"
          >
            Anyra is now Karst.
          </motion.h1>

          <motion.div
            variants={fadeSlideUpDelayed}
            initial="hidden"
            animate="visible"
            custom={0.45}
          >
            <div className="w-10 h-px bg-tertiary/40 mb-8" />

            <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-6">
              A karst is a landscape shaped from below: structure carved into stone, read at
              the surface. It is how this firm has always thought about the work: the decisions
              that matter live beneath the figures on the page.
            </p>

            <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-6">
              The firm is the same. Anyra Inc. now operates as Karst. Same people, same
              practice, same standard. Engagements, agreements, and the platform continue
              unchanged.
            </p>

            <p className="font-editorial italic text-lg md:text-xl text-on-surface leading-snug mb-12">
              Districts that knew us as Anyra know the work already. The name caught up to it.
            </p>

            <Link
              to="/"
              className="font-headline text-xs uppercase tracking-widest text-primary hover:text-primary-dim transition-colors"
            >
              Enter the Site →
            </Link>

            <p className="font-label text-[9px] tracking-[0.18em] uppercase text-on-surface-variant/40 mt-16 leading-relaxed">
              Karst™ is a trademark of Anyra Inc.
            </p>
          </motion.div>
        </div>
      </section>
    </PageShell>
  )
}
