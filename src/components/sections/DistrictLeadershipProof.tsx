import { motion } from 'framer-motion'
import { staggerContainerRelaxed, staggerChild } from '../../lib/motion'

/* Testimonials gathered 2026-06-03, used with name + title approval.
   Current roles and organizations are stated per person because these leaders
   no longer all serve the same district. */

const VOICES = [
  {
    quote:
      'Before Kevin, I really only used AI to check the grammar in my emails. After working with him, I can build dashboards, forms, and full presentations myself. It’s a completely different level of capability.',
    name: 'Dr. Tu Moua-Carroz',
    title: 'Superintendent',
    district: 'Twin Rivers Unified School District',
  },
  {
    quote: 'I’ve literally cut my workload in half while accomplishing double the work.',
    name: 'Tony Phan',
    title: 'Chief Officer of Strategic Communication and Engagement',
    district: 'Roseville Joint Union High School District',
  },
  {
    quote:
      'We’re building predictive data solutions we’d never have imagined on our own — work that once required outside help, or simply went undone.',
    name: 'Josh Mason',
    title: 'Executive Director, Data, Assessment and Accountability',
    district: 'Roseville Joint Union High School District',
  },
]

export default function DistrictLeadershipProof() {
  return (
    <section className="relative overflow-hidden bg-surface-container px-6 py-20 md:px-10 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8802a]/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[-30%] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(168,128,42,0.055),transparent_68%)]"
      />
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainerRelaxed}
      >
        <motion.div variants={staggerChild} className="mb-14 max-w-2xl md:mb-20">
          <p className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
            In Their Words
          </p>
          <h2 className="font-headline text-3xl font-light leading-tight text-on-surface md:text-4xl">
            District leaders on what changes when capability becomes real.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-stretch">
          {VOICES.map((v) => (
            <motion.figure
              key={v.name}
              variants={staggerChild}
              className="flex h-full flex-col border-t border-on-surface/10 pt-7"
            >
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
                <span className="block text-on-surface-variant/55">{v.title}</span>
                <span className="mt-1 block text-on-surface-variant/38">{v.district}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
