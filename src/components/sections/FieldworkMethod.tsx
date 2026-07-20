import { motion, useReducedMotion } from 'framer-motion'
import AmbientParticles from '../art/AmbientParticles'
import FieldworkTransformDiagram from './FieldworkTransformDiagram'

const STEPS = [
  {
    number: '01',
    label: 'Bring the work',
    detail:
      'The board packet, the enrollment question, the process that eats a week. A real backlog, chosen by your team, not workshop exercises.',
  },
  {
    number: '02',
    label: 'Build beside Karst',
    detail:
      'Guided sessions inside the workday, with an expert partner in the room. Different people build different things: dashboards, presentations, communications, workflow tools.',
  },
  {
    number: '03',
    label: 'Leave it running',
    detail:
      'Every build lands in the Operating Kit: documented, district-owned, easy to run again, and ready to keep improving.',
  },
]

/* The gold survey line draws over LINE_DURATION; each node activates as the
   line's leading edge reaches its position (0%, 33.3%, 66.6% of the width). */
const LINE_DELAY = 0.25
const LINE_DURATION = 1.6
const nodeArrival = (index: number) => LINE_DELAY + LINE_DURATION * (index / 3)

export default function FieldworkMethod() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section className="relative overflow-hidden bg-[#fffcf7] px-6 py-24 text-[#1a1816] md:px-10 md:py-36">
      <AmbientParticles />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(168,128,42,0.06),transparent_34%)]"
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
            <p className="mb-6 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
              Fieldwork
            </p>
            <h2 className="font-headline text-3xl font-light leading-[1.14] md:text-5xl">
              Not time away from the work.{' '}
              <span className="text-sunset-cycle inline-block pb-[0.12em] font-editorial font-normal italic">
                Time to improve it.
              </span>
            </h2>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.7 } },
            }}
            className="max-w-[52ch] self-end font-body text-base leading-[1.85] text-[#6e6355] md:text-lg"
          >
            The change happens person by person. When your people work differently, the district
            works differently.
          </motion.p>
        </div>

        <FieldworkTransformDiagram />

        <div className="relative mt-16 grid gap-0 md:mt-24 md:grid-cols-3">
          {/* The survey line, drawn left to right */}
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { scaleX: reduceMotion ? 1 : 0 },
              visible: {
                scaleX: 1,
                transition: {
                  duration: reduceMotion ? 0 : LINE_DURATION,
                  delay: reduceMotion ? 0 : LINE_DELAY,
                  ease: 'linear',
                },
              },
            }}
            className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-gradient-to-r from-[#a8802a]/70 via-[#a8802a]/35 to-[#a8802a]/25 md:block"
          />
          {/* The work, traveling the line — briefing grammar: ink in, teal build,
              gold when it lands in the kit. Loops like the Fable 5 model dot. */}
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="absolute -top-[3px] hidden h-[7px] w-[7px] rounded-full md:block"
              initial={{ left: '0%', opacity: 0 }}
              animate={{
                left: ['0%', '33.3%', '66.6%', '99.5%', '99.5%'],
                backgroundColor: ['#1e2a4a', '#2d5a5a', '#5a6aaa', '#a8802a', '#a8802a'],
                opacity: [0, 1, 1, 1, 0],
                boxShadow: [
                  '0 0 0 0 rgba(30,42,74,0)',
                  '0 0 10px 1px rgba(45,90,90,0.35)',
                  '0 0 10px 1px rgba(90,106,170,0.35)',
                  '0 0 12px 2px rgba(168,128,42,0.45)',
                  '0 0 0 0 rgba(168,128,42,0)',
                ],
              }}
              transition={{
                duration: 7,
                times: [0, 0.36, 0.68, 0.9, 1],
                delay: LINE_DELAY + LINE_DURATION + 0.4,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: 'linear',
              }}
            />
          )}
          {STEPS.map((step, index) => {
            const arrival = reduceMotion ? 0 : nodeArrival(index)
            return (
              <motion.article
                key={step.number}
                variants={{
                  hidden: { opacity: 0, y: reduceMotion ? 0 : 26 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduceMotion ? 0 : 0.75, delay: arrival },
                  },
                }}
                className="relative border-t border-[#1a1816]/12 py-8 md:border-t-0 md:border-r md:border-[#1a1816]/10 md:px-9 md:pt-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                {/* Node: lights as the line arrives, with a one-shot ring pulse */}
                <span className="absolute -top-1.5 left-0 hidden h-3 w-3 md:block" aria-hidden="true">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[#a8802a]/45"
                    variants={{
                      hidden: { scale: 1, opacity: 0 },
                      visible: reduceMotion
                        ? { opacity: 0 }
                        : {
                            scale: [1, 2.4],
                            opacity: [0.55, 0],
                            transition: { duration: 0.9, delay: arrival, ease: 'easeOut' },
                          },
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full border"
                    variants={{
                      hidden: reduceMotion
                        ? { scale: 1, backgroundColor: '#a8802a', borderColor: 'rgba(168,128,42,0.7)' }
                        : {
                            scale: 0.4,
                            backgroundColor: '#fffcf7',
                            borderColor: 'rgba(168,128,42,0.35)',
                          },
                      visible: {
                        scale: 1,
                        backgroundColor: '#a8802a',
                        borderColor: 'rgba(168,128,42,0.7)',
                        transition: { duration: reduceMotion ? 0 : 0.45, delay: arrival, ease: 'easeOut' },
                      },
                    }}
                  />
                  {/* Standing spark — the briefing's vSpark, staggered per node */}
                  {!reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#a8802a]/40"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: [1, 1.9, 1], opacity: [0, 0.45, 0] }}
                      transition={{
                        duration: 4.5,
                        delay: LINE_DELAY + LINE_DURATION + 1 + index * 1.5,
                        repeat: Infinity,
                        repeatDelay: 2.2,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </span>
                <p className="mb-10 font-label text-[9px] tracking-[0.24em] text-[#a8802a]/85">
                  {step.number}
                </p>
                <h3 className="mb-3 font-headline text-xl text-[#1a1816]">{step.label}</h3>
                <p className="max-w-[36ch] font-body text-sm leading-relaxed text-[#6e6355]">
                  {step.detail}
                </p>
              </motion.article>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
