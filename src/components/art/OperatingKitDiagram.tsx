import { motion, useReducedMotion } from 'framer-motion'

const LAYERS = [
  {
    number: '01',
    title: 'District context',
    detail: 'Priorities, language, brand, and local knowledge.',
    mark: 'context',
  },
  {
    number: '02',
    title: 'Guardrails',
    detail: 'Data rules, review gates, and responsible-use boundaries.',
    mark: 'guardrails',
  },
  {
    number: '03',
    title: 'Workflows',
    detail: 'Repeatable methods built around real district work.',
    mark: 'workflows',
  },
  {
    number: '04',
    title: 'Tools',
    detail: 'Prompts, templates, applications, and reusable patterns.',
    mark: 'tools',
  },
  {
    number: '05',
    title: 'Ownership',
    detail: 'The files, knowledge, and capability stay with the district.',
    mark: 'ownership',
  },
] as const

function LayerMark({ type }: { type: (typeof LAYERS)[number]['mark'] }) {
  if (type === 'context') {
    return (
      <svg viewBox="0 0 54 24" className="h-6 w-[54px]" aria-hidden="true">
        <path d="M2 18C10 18 10 7 18 7s8 10 16 10 8-8 18-8" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="7" r="2" fill="currentColor" />
        <circle cx="34" cy="17" r="2" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'guardrails') {
    return (
      <svg viewBox="0 0 54 24" className="h-6 w-[54px]" aria-hidden="true">
        <path d="M8 4h38v16H8z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M18 4v16M36 4v16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      </svg>
    )
  }

  if (type === 'workflows') {
    return (
      <svg viewBox="0 0 54 24" className="h-6 w-[54px]" aria-hidden="true">
        <circle cx="8" cy="12" r="3" fill="none" stroke="currentColor" />
        <circle cx="27" cy="12" r="3" fill="none" stroke="currentColor" />
        <circle cx="46" cy="12" r="3" fill="none" stroke="currentColor" />
        <path d="M11 12h13M30 12h13" stroke="currentColor" />
      </svg>
    )
  }

  if (type === 'tools') {
    return (
      <svg viewBox="0 0 54 24" className="h-6 w-[54px]" aria-hidden="true">
        <rect x="6" y="5" width="12" height="14" fill="none" stroke="currentColor" />
        <rect x="22" y="5" width="12" height="14" fill="none" stroke="currentColor" />
        <rect x="38" y="5" width="10" height="14" fill="none" stroke="currentColor" />
        <path d="M9 9h6M25 9h6M41 9h4" stroke="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 54 24" className="h-6 w-[54px]" aria-hidden="true">
      <path d="M27 3l17 6v7l-17 5-17-5V9l17-6Z" fill="none" stroke="currentColor" />
      <path d="M10 9l17 6 17-6M27 15v6" fill="none" stroke="currentColor" />
      <circle cx="27" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}

export default function OperatingKitDiagram() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative overflow-hidden rounded-[3px] border border-[#1e2a4a]/14 bg-[#f3f0e8] shadow-[0_28px_80px_rgba(30,42,74,0.08)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),transparent_46%),radial-gradient(circle_at_88%_16%,rgba(168,128,42,0.08),transparent_32%)]"
      />

      <div className="relative flex items-center justify-between border-b border-[#1e2a4a]/10 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#a8802a] shadow-[0_0_0_5px_rgba(168,128,42,0.08)]" />
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#1e2a4a]/62">
            District AI Operating Kit
          </span>
        </div>
        <span className="hidden font-label text-[8px] uppercase tracking-[0.26em] text-[#1e2a4a]/36 sm:block">
          District-owned
        </span>
      </div>

      <div className="relative px-5 py-5 md:px-7 md:py-7">
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-[35px] top-10 w-px bg-gradient-to-b from-[#a8802a]/0 via-[#a8802a]/38 to-[#a8802a]/0 md:left-[43px]"
        />

        <ol className="relative space-y-2.5">
          {LAYERS.map((layer, index) => (
            <motion.li
              key={layer.number}
              custom={index}
              variants={{
                hidden: {
                  opacity: 0,
                  x: reduceMotion ? 0 : -22,
                },
                visible: (order: number) => ({
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: reduceMotion ? 0 : 0.7,
                    delay: reduceMotion ? 0 : 0.12 + order * 0.13,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }),
              }}
              className="group grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-[3px] border border-[#1e2a4a]/10 bg-[#fffdf8]/78 px-3 py-3.5 transition-colors duration-500 hover:bg-[#fffdf8] md:grid-cols-[42px_1fr_auto] md:gap-4 md:px-4 md:py-4"
            >
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#a8802a]/35 bg-[#f3f0e8] font-label text-[8px] tracking-[0.12em] text-[#8a6820] md:h-8 md:w-8">
                {layer.number}
              </span>
              <span>
                <span className="block font-headline text-[15px] font-medium text-[#171512] md:text-[16px]">
                  {layer.title}
                </span>
                <span className="mt-0.5 block max-w-[50ch] font-body text-[11px] leading-relaxed text-[#1e2a4a]/48 md:text-[12px]">
                  {layer.detail}
                </span>
              </span>
              <span className="hidden text-[#1e2a4a]/34 transition-colors duration-500 group-hover:text-[#a8802a]/70 sm:block">
                <LayerMark type={layer.mark} />
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.9 },
          },
        }}
        className="relative grid grid-cols-1 gap-2 border-t border-[#1e2a4a]/10 bg-[#1e2a4a]/[0.035] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center md:px-7"
      >
        <p className="font-editorial text-[15px] italic text-[#1e2a4a]/72">
          One operating layer. Ready for real district work.
        </p>
        <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#1e2a4a]/42">
          Designed with Karst · Built to evolve
        </p>
      </motion.div>
    </motion.div>
  )
}
