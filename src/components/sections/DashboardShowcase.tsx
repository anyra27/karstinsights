import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easeStandard } from '../../lib/motion'

/* ────────────────────────────────────────────
   Dashboard registry
   Each entry points to a ported, anonymized
   Karst dashboard in /public/dashboards.
   ──────────────────────────────────────────── */

interface Dashboard {
  id: string
  label: string
  src: string
  url: string
}

const DASHBOARDS: Dashboard[] = [
  {
    id: 'strategic',
    label: 'Strategic Input',
    src: '/dashboards/strategic/index.html',
    url: 'demo.karst.build / strategic-input',
  },
  {
    id: 'cte',
    label: 'CTE Pathways',
    src: '/dashboards/cte/index.html',
    url: 'demo.karst.build / cte-pathways',
  },
]

function BrowserChrome({
  url,
  rightSlot,
}: {
  url: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#fffcf7]/10 bg-[#151411] px-4 py-3">
      <div className="flex gap-1.5">
        <div className="h-2 w-2 rounded-full bg-[#c49a43]/80" />
        <div className="h-2 w-2 rounded-full bg-[#fffcf7]/24" />
        <div className="h-2 w-2 rounded-full bg-[#fffcf7]/12" />
      </div>
      <div className="ml-2 truncate font-mono text-[10px] text-[#fffcf7]/34 md:text-[11px]">
        {url}
      </div>
      {rightSlot && <div className="ml-auto flex items-center">{rightSlot}</div>}
    </div>
  )
}

export default function DashboardShowcase() {
  const [activeId, setActiveId] = useState(DASHBOARDS[0].id)
  const [isOpen, setIsOpen] = useState(false)
  const dashboard = DASHBOARDS.find((d) => d.id === activeId)!

  // ESC closes modal + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        {/* Dashboard switcher pills */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-flex gap-1 rounded-[3px] border border-[#1a1816]/12 bg-white/70 p-1 shadow-[0_10px_30px_-18px_rgba(26,24,22,0.35)]">
            {DASHBOARDS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-label font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-[3px] transition-colors ${
                  d.id === activeId
                    ? 'bg-[#1a1816] text-[#fffcf7]'
                    : 'text-[#1a1816]/60 hover:text-[#1a1816]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline browser-framed iframe */}
        <div
          className="relative overflow-hidden rounded-[4px] border border-[#1a1816]/14 bg-[#0e0e0c]"
          style={{
            boxShadow:
              '0 42px 100px -36px rgba(26, 24, 22, 0.45), 0 0 0 1px rgba(168, 128, 42, 0.06)',
          }}
        >
          <span className="pointer-events-none absolute left-0 top-0 z-10 h-8 w-8 border-l border-t border-[#c49a43]/45" aria-hidden="true" />
          <span className="pointer-events-none absolute right-0 top-0 z-10 h-8 w-8 border-r border-t border-[#c49a43]/45" aria-hidden="true" />
          <BrowserChrome
            url={dashboard.url}
            rightSlot={
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fffcf7]/48 transition-colors hover:text-[#fffcf7] md:text-[10px]"
              >
                Expand
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 1H1V3M7 1H9V3M3 9H1V7M7 9H9V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            }
          />
          <AnimatePresence mode="wait">
            <motion.iframe
              key={dashboard.id}
              src={dashboard.src}
              title={dashboard.label}
              loading="lazy"
              className="w-full block bg-[#fffcf7]"
              style={{ height: 'min(68vh, 720px)', border: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: easeStandard }}
            />
          </AnimatePresence>
        </div>

        {/* Caption */}
        <p className="mt-6 text-center font-editorial text-xs italic text-[#6e6355] md:text-sm">
          Live ported dashboards · anonymized data · click <span className="font-label text-[10px] not-italic uppercase tracking-[0.2em] text-[#1a1816]/70">Expand</span> for full screen.
        </p>
      </div>

      {/* ════════════════ FULL-SCREEN MODAL ════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className="absolute inset-0 bg-[#0e0e0c]/75"
              style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            />
            <motion.div
              className="relative w-full overflow-hidden rounded-[4px] border border-[#fffcf7]/14 bg-[#0e0e0c]"
              style={{
                maxWidth: 'min(96vw, 1640px)',
                height: 'min(94vh, 1100px)',
                boxShadow:
                  '0 50px 120px -30px rgba(0, 0, 0, 0.55), 0 12px 28px rgba(0, 0, 0, 0.18)',
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 12 }}
              transition={{ duration: 0.28, ease: easeStandard }}
            >
              <BrowserChrome
                url={dashboard.url}
                rightSlot={
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 font-label text-[9px] font-semibold uppercase tracking-[0.22em] text-[#fffcf7]/48 transition-colors hover:text-[#fffcf7] md:text-[10px]"
                    aria-label="Close"
                  >
                    Close
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                }
              />
              <iframe
                src={dashboard.src}
                title={`${dashboard.label} (expanded)`}
                className="w-full bg-[#fffcf7]"
                style={{ height: 'calc(100% - 49px)', border: 0 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
