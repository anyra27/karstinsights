import { motion, useReducedMotion } from 'framer-motion'

const LAYERS = [
  {
    number: '01',
    title: 'District context',
    detail: 'Priorities · language · local knowledge',
    mark: 'context',
  },
  {
    number: '02',
    title: 'Guardrails',
    detail: 'Data rules · review gates · boundaries',
    mark: 'guardrails',
  },
  {
    number: '03',
    title: 'Workflows',
    detail: 'Repeatable methods for consequential work',
    mark: 'workflows',
  },
  {
    number: '04',
    title: 'Tools',
    detail: 'Prompts · templates · working applications',
    mark: 'tools',
  },
  {
    number: '05',
    title: 'Ownership',
    detail: 'Files · knowledge · capability',
    mark: 'ownership',
  },
] as const

function LayerParticles({ type }: { type: (typeof LAYERS)[number]['mark'] }) {
  if (type === 'context') {
    const points = [
      [8, 22, 1.5], [18, 12, 1], [27, 25, 1.2], [38, 8, 1.4],
      [48, 19, 1], [61, 10, 1.2], [72, 24, 1.5], [84, 15, 1],
    ]
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        {points.map(([cx, cy, r], index) => (
          <circle key={cx} cx={cx} cy={cy} r={r} fill={index === 4 ? '#c49a43' : 'rgba(255,252,247,0.42)'} />
        ))}
      </svg>
    )
  }

  if (type === 'guardrails') {
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        <path d="M17 5v22M75 5v22" stroke="rgba(196,154,67,0.52)" strokeWidth="1" />
        {[28, 40, 52, 64].flatMap((cx) => [11, 21].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.35" fill="rgba(255,252,247,0.46)" />
        )))}
        <circle cx="52" cy="11" r="2.2" fill="#c49a43" />
      </svg>
    )
  }

  if (type === 'workflows') {
    const points = [[8, 22], [20, 18], [32, 20], [44, 11], [56, 14], [68, 9], [82, 13]]
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        <path d="M8 22L20 18l12 2 12-9 12 3 12-5 14 4" fill="none" stroke="rgba(255,252,247,0.18)" strokeWidth="1" />
        {points.map(([cx, cy], index) => (
          <circle key={cx} cx={cx} cy={cy} r={index === 3 ? 2.3 : 1.45} fill={index === 3 ? '#c49a43' : 'rgba(255,252,247,0.48)'} />
        ))}
      </svg>
    )
  }

  if (type === 'tools') {
    return (
      <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
        {[10, 20, 30].flatMap((cx) => [9, 16, 23].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="rgba(255,252,247,0.4)" />
        )))}
        <path d="M39 16h13" stroke="rgba(255,252,247,0.2)" />
        <rect x="57" y="7" width="10" height="18" rx="1" fill="none" stroke="rgba(255,252,247,0.36)" />
        <rect x="72" y="10" width="11" height="15" rx="1" fill="none" stroke="rgba(196,154,67,0.58)" />
        <circle cx="77.5" cy="17.5" r="2" fill="#c49a43" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 92 32" className="h-8 w-[92px]" aria-hidden="true">
      <path d="M46 3l28 9v11l-28 7-28-7V12l28-9Z" fill="none" stroke="rgba(255,252,247,0.24)" />
      <path d="M18 12l28 8 28-8M46 20v10" fill="none" stroke="rgba(196,154,67,0.38)" />
      {[[31, 13], [40, 15.5], [52, 14.5], [60, 12.5], [46, 20]].map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index === 4 ? 2.5 : 1.3} fill={index === 4 ? '#c49a43' : 'rgba(255,252,247,0.5)'} />
      ))}
    </svg>
  )
}

export default function OperatingKitDiagram() {
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-90px' }}
      className="relative overflow-hidden rounded-[3px] border border-[#fffcf7]/12 bg-[#171614]/92 shadow-[0_34px_100px_rgba(0,0,0,0.34)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_42%),radial-gradient(circle_at_86%_8%,rgba(196,154,67,0.11),transparent_31%)]"
      />

      <div className="relative flex items-center justify-between border-b border-[#fffcf7]/10 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.6 },
              visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.6 } },
            }}
            className="h-2 w-2 rounded-full bg-[#c49a43] shadow-[0_0_18px_rgba(196,154,67,0.55)]"
          />
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-[#fffcf7]/56">
            District AI Operating Kit
          </span>
        </div>
        <span className="hidden font-label text-[8px] uppercase tracking-[0.26em] text-[#fffcf7]/28 sm:block">
          District-owned
        </span>
      </div>

      <div className="relative p-5 md:p-7">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4 px-1">
          <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#c49a43]/75">
            Assembled through Fieldwork
          </p>
          <p className="font-label text-[8px] uppercase tracking-[0.24em] text-[#fffcf7]/25">
            01—05
          </p>
        </div>

        <div className="relative">
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { scaleY: reduceMotion ? 1 : 0 },
              visible: {
                scaleY: 1,
                transition: { duration: reduceMotion ? 0 : 1.25, delay: reduceMotion ? 0 : 0.18 },
              },
            }}
            className="absolute bottom-5 left-[22px] top-5 z-10 w-px origin-top bg-gradient-to-b from-[#c49a43]/70 via-[#c49a43]/30 to-[#c49a43]/5 md:left-[27px]"
          />

          <ol className="relative space-y-2">
            {LAYERS.map((layer, index) => (
              <motion.li
                key={layer.number}
                custom={index}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: reduceMotion ? 0 : index % 2 === 0 ? 26 : -26,
                    y: reduceMotion ? 0 : 10,
                  },
                  visible: (order: number) => ({
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: reduceMotion ? 0 : 0.78,
                      delay: reduceMotion ? 0 : 0.12 + order * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }),
                }}
                className="relative grid min-h-[76px] grid-cols-[36px_1fr] items-center gap-4 overflow-hidden rounded-[2px] border border-[#fffcf7]/10 bg-[#fffcf7]/[0.045] px-3 py-3.5 md:min-h-[84px] md:grid-cols-[44px_1fr_auto] md:px-4"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#c49a43]/15 via-[#c49a43]/70 to-[#c49a43]/15"
                />
                <span className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#c49a43]/45 bg-[#171614] font-label text-[8px] tracking-[0.1em] text-[#d9b66b] md:h-8 md:w-8">
                  {layer.number}
                </span>
                <span>
                  <span className="block font-headline text-[15px] font-medium text-[#fffcf7] md:text-[16px]">
                    {layer.title}
                  </span>
                  <span className="mt-1 block font-body text-[11px] leading-relaxed text-[#fffcf7]/50 md:text-[12px]">
                    {layer.detail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-[#fffcf7]/50 md:block"
                >
                  <LayerParticles type={layer.mark} />
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.88 },
          },
        }}
        className="relative grid gap-3 border-t border-[#fffcf7]/10 bg-black/35 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center md:px-7"
      >
        <p className="font-editorial text-[15px] italic text-[#e6d8b9]/90">
          One operating layer. Ready to keep evolving.
        </p>
        <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#fffcf7]/42">
          Maintained by Karst
        </p>
      </motion.div>
    </motion.div>
  )
}
