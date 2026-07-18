import { motion, useReducedMotion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    label: 'Bring the work',
    detail: 'The brief, the dashboard, the process that eats a week. Chosen by your team.',
  },
  {
    number: '02',
    label: 'Build beside Karst',
    detail: 'Guided sessions inside the workday. Different people build different things.',
  },
  {
    number: '03',
    label: 'Leave it running',
    detail: 'Every build lands in the Operating Kit, documented and easy to run again.',
  },
]

export default function FieldworkMethod() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section
      data-karst-nav-dark
      className="relative overflow-hidden bg-[#0e0e0c] px-6 py-24 text-[#fffcf7] md:px-10 md:py-36"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(168,128,42,0.14),transparent_34%),linear-gradient(120deg,rgba(255,255,255,0.025),transparent_42%)]"
      />
      <motion.div
        className="relative mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-90px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
        }}
      >
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.7 } },
            }}
          >
            <p className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#c49a43] md:text-[11px]">
              Fieldwork
            </p>
            <h2 className="font-headline text-3xl font-light leading-[1.14] md:text-5xl">
              Real work in.{' '}
              <span className="font-editorial font-normal italic text-[#e6d8b9]">Working systems out.</span>
            </h2>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.7 } },
            }}
            className="max-w-[56ch] self-end font-body text-base leading-[1.85] text-[#fffcf7]/62 md:text-lg"
          >
            A school year of guided build sessions, inside the workday. Your team brings the work
            already in front of them, and Karst supplies the guidance and methods to build with it.
            Everyone leaves with working systems they can keep improving.
          </motion.p>
        </div>

        <div className="relative mt-16 grid gap-0 md:mt-24 md:grid-cols-3">
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { scaleX: reduceMotion ? 1 : 0 },
              visible: {
                scaleX: 1,
                transition: { duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.22 },
              },
            }}
            className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-gradient-to-r from-[#c49a43]/70 via-[#fffcf7]/18 to-[#c49a43]/25 md:block"
          />
          {STEPS.map((step, index) => (
            <motion.article
              key={step.number}
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 26 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : index * 0.1 },
                },
              }}
              className="relative border-t border-[#fffcf7]/12 py-8 md:border-t-0 md:border-r md:border-[#fffcf7]/10 md:px-9 md:pt-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="absolute -top-1.5 left-0 hidden h-3 w-3 rounded-full border border-[#c49a43]/70 bg-[#0e0e0c] md:block" />
              <p className="mb-10 font-label text-[9px] tracking-[0.24em] text-[#c49a43]/75">
                {step.number}
              </p>
              <h3 className="mb-3 font-headline text-xl text-[#fffcf7]">{step.label}</h3>
              <p className="max-w-[34ch] font-body text-sm leading-relaxed text-[#fffcf7]/52">
                {step.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
