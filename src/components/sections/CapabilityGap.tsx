import { motion } from 'framer-motion'
import { easeStandard, staggerChild, staggerContainerRelaxed } from '../../lib/motion'

const SIGNALS = [
  {
    number: '01',
    title: 'Access expands.',
    detail: 'Capacity does not.',
  },
  {
    number: '02',
    title: 'Work stays fragmented.',
    detail: 'Useful experiments never become shared practice.',
  },
  {
    number: '03',
    title: 'Dependence grows.',
    detail: 'Every new need returns to a vendor—or one employee.',
  },
]

export default function CapabilityGap() {
  return (
    <section className="relative overflow-hidden bg-surface px-6 py-24 md:px-10 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8802a]/45 to-transparent"
      />
      <motion.div
        className="relative mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainerRelaxed}
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <motion.p
              variants={staggerChild}
              className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]"
            >
              The Capability Gap
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="max-w-2xl font-headline text-3xl font-light leading-[1.14] text-on-surface md:text-5xl lg:text-[54px]"
            >
              The tools are here.{' '}
              <span className="font-editorial font-normal italic">The time to build is not.</span>
            </motion.h2>
          </div>

          <motion.div variants={staggerChild} className="flex items-end">
            <p className="max-w-[54ch] font-body text-base leading-[1.85] text-on-surface-variant/75 md:text-lg">
              District teams are expected to evaluate, learn, and implement AI while carrying a full
              workload. The missing layer is the capacity to decide what to buy, what to build, and
              what the district should own.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={staggerChild}
          className="mt-16 grid border-y border-on-surface/10 md:mt-24 md:grid-cols-3"
        >
          {SIGNALS.map((signal, index) => (
            <motion.article
              key={signal.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: easeStandard }}
              className="border-b border-on-surface/10 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <p className="mb-8 font-label text-[9px] tracking-[0.24em] text-[#a8802a]/75">
                {signal.number}
              </p>
              <h3 className="mb-3 font-headline text-xl font-medium text-on-surface">
                {signal.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant/65">
                {signal.detail}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
