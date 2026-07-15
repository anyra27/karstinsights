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
    <div className="bg-[#f0eee6] px-4 py-3 flex items-center gap-3 border-b border-[#1e2a4a]/8">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/55" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/55" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/55" />
      </div>
      <div className="ml-2 text-[10px] md:text-[11px] font-mono text-[#3a3632]/55 truncate">
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
          <div className="inline-flex gap-1 p-1 bg-[#fffcf7] border border-[#1e2a4a]/10 rounded-[3px] shadow-sm">
            {DASHBOARDS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-label font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-[3px] transition-colors ${
                  d.id === activeId
                    ? 'bg-[#1e2a4a] text-[#fffcf7]'
                    : 'text-[#3a3632]/65 hover:text-[#1a1816]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline browser-framed iframe */}
        <div
          className="bg-[#fffcf7] rounded-[6px] overflow-hidden border border-[#1e2a4a]/10"
          style={{
            boxShadow:
              '0 30px 80px -20px rgba(30, 42, 74, 0.28), 0 6px 16px rgba(30, 42, 74, 0.06)',
          }}
        >
          <BrowserChrome
            url={dashboard.url}
            rightSlot={
              <button
                onClick={() => setIsOpen(true)}
                className="font-label text-[9px] md:text-[10px] tracking-[0.22em] uppercase font-semibold text-[#1e2a4a]/75 hover:text-[#1e2a4a] transition-colors flex items-center gap-1.5"
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
              style={{ height: 'min(80vh, 820px)', border: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: easeStandard }}
            />
          </AnimatePresence>
        </div>

        {/* Caption */}
        <p className="font-editorial italic text-center text-on-surface-variant/55 text-xs md:text-sm mt-6">
          Live ported dashboards · anonymized data · click <span className="not-italic font-label tracking-[0.2em] uppercase text-[10px]">Expand</span> for full screen.
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
              className="relative bg-[#fffcf7] rounded-[6px] overflow-hidden border border-[#1e2a4a]/10 w-full"
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
                    className="font-label text-[9px] md:text-[10px] tracking-[0.22em] uppercase font-semibold text-[#3a3632]/65 hover:text-[#1a1816] transition-colors flex items-center gap-1.5"
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
