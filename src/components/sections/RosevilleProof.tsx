import { motion } from 'framer-motion'
import { staggerContainerRelaxed, staggerChild } from '../../lib/motion'
import AmbientParticles from '../art/AmbientParticles'

/* Roseville proof — testimonials gathered 2026-06-03, used with name +
   title approval. Full verbatim bank: marketing/testimonials-rjuhsd-2026-06.md */

/* All three voices are from one district — named once at the section
   level below, not repeated on every card. */
const DISTRICT = 'Roseville Joint Union High School District'

const VOICES = [
  {
    quote:
      'Before Kevin, I really only used AI to check the grammar in my emails. After working with him, I can build dashboards, forms, and full presentations myself. It’s a completely different level of capability.',
    name: 'Dr. Tu Moua Carroz',
    title: 'Superintendent, Twin Rivers Unified School District',
  },
  {
    quote: 'I’ve literally cut my workload in half while accomplishing double the work.',
    name: 'Tony Phan',
    title: 'Chief Communications Officer',
  },
  {
    quote:
      'We’re building predictive data solutions we’d never have imagined on our own — work that once required outside help, or simply went undone.',
    name: 'Josh Mason',
    title: 'Executive Director of Data, Assessment & Accountability',
  },
]

export default function RosevilleProof() {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-10 bg-surface-container overflow-hidden">
      {/* the studios' warm-sand wind field — the proof moves like the modules */}
      <AmbientParticles />
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainerRelaxed}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-stretch">
          {VOICES.map((v) => (
            <motion.figure key={v.name} variants={staggerChild} className="flex flex-col h-full">
              {/* brass opening quote — the human signature, editorial flourish */}
              <span
                aria-hidden="true"
                className="font-editorial not-italic text-5xl md:text-6xl leading-none text-[#a8802a]/40 select-none mb-3"
              >
                &ldquo;
              </span>
              <blockquote className="font-editorial italic text-lg md:text-xl text-on-surface leading-snug">
                {v.quote}
              </blockquote>
              {/* attribution pinned to the bottom so all three line up across the row */}
              <figcaption className="mt-auto pt-8 font-label text-[10px] md:text-[11px] tracking-[0.22em] uppercase leading-loose">
                <span className="block text-on-surface/70">{v.name}</span>
                <span className="text-on-surface-variant/45">{v.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.p
          variants={staggerChild}
          className="font-label text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-on-surface-variant/45 mt-12 md:mt-16"
        >
          {DISTRICT}
        </motion.p>
      </motion.div>
    </section>
  )
}
