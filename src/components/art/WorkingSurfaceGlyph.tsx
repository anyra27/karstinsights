/**
 * WorkingSurfaceGlyph — for the Frame page Capability section.
 *
 * Visualizes "A working surface, the moment the conversation ends." as a
 * dashboard layout that continuously scrolls vertically — like watching a
 * Frame-published page scroll past. Distinct widget types (KPI tiles,
 * bar charts, data tables, headers) render as dot patterns that read as
 * actual dashboard regions, not just denser lattice clusters.
 *
 * Continuous loop: content is rendered twice and translated -CONTENT_H over
 * 28 seconds, then resets — the second copy is in the original position at
 * loop end, so the visual transition is seamless.
 */

const VIEW_W = 720
const VIEW_H = 240
const CONTENT_H = 360 // virtual "page" height (1.5x viewport)

const DOT_FILL = 'rgba(30, 42, 74, 0.78)'
const DOT_FILL_DIM = 'rgba(30, 42, 74, 0.42)'

type WidgetType = 'header' | 'kpi' | 'bars' | 'line' | 'table'

interface Widget {
  type: WidgetType
  x: number
  y: number
  w: number
  h: number
  /** Optional seed for chart variation (so two bar charts look different) */
  seed?: number
}

/** Page layout — one full "page" of CONTENT_H, will be doubled for seamless scroll */
const WIDGETS: Widget[] = [
  // ── First section (top of page) ──
  { type: 'header', x: 30, y: 16, w: 200, h: 6 },
  { type: 'kpi',  x: 30,  y: 38, w: 130, h: 56, seed: 11 },
  { type: 'kpi',  x: 175, y: 38, w: 130, h: 56, seed: 23 },
  { type: 'kpi',  x: 320, y: 38, w: 130, h: 56, seed: 37 },
  { type: 'bars', x: 470, y: 38, w: 220, h: 56, seed: 5  },

  { type: 'header', x: 30, y: 110, w: 140, h: 6 },
  { type: 'table', x: 30, y: 130, w: 380, h: 70 },
  { type: 'line',  x: 425, y: 130, w: 265, h: 70, seed: 17 },

  // ── Second section (lower half of page) ──
  { type: 'header', x: 30, y: 218, w: 180, h: 6 },
  { type: 'bars',  x: 30,  y: 240, w: 200, h: 100, seed: 41 },
  { type: 'kpi',   x: 245, y: 240, w: 200, h: 48, seed: 47 },
  { type: 'kpi',   x: 245, y: 296, w: 200, h: 44, seed: 53 },
  { type: 'table', x: 460, y: 240, w: 230, h: 100 },
]

/* Deterministic pseudo-random */
function prand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/** Generate dots for a single widget — varies by type to read as different
 *  dashboard regions (KPI vs chart vs table) */
function generateWidgetDots(w: Widget): { x: number; y: number; r: number; dim?: boolean }[] {
  const dots: { x: number; y: number; r: number; dim?: boolean }[] = []
  const seed = w.seed ?? 1

  switch (w.type) {
    case 'header': {
      // Sparse single row — represents page-section heading
      const cols = Math.floor(w.w / 14)
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: w.x + 4 + c * 14,
          y: w.y + w.h / 2,
          r: 1.4,
          dim: true,
        })
      }
      return dots
    }

    case 'kpi': {
      // KPI tile: a "value" dot top-left + small grid label area + sparse "chart" trail
      // Top-left big stat dot
      dots.push({ x: w.x + 10, y: w.y + 10, r: 3 })
      // Label row (small dim dots forming a label line)
      for (let c = 0; c < 8; c++) {
        dots.push({ x: w.x + 24 + c * 6, y: w.y + 12, r: 1, dim: true })
      }
      // Subtitle row
      for (let c = 0; c < 6; c++) {
        dots.push({ x: w.x + 10 + c * 6, y: w.y + 24, r: 0.9, dim: true })
      }
      // Mini sparkline (line chart) at bottom
      const points = Math.floor((w.w - 20) / 8)
      for (let i = 0; i < points; i++) {
        const yJitter = (prand(seed + i * 3) - 0.5) * (w.h * 0.35)
        dots.push({
          x: w.x + 10 + i * 8,
          y: w.y + w.h - 12 + yJitter,
          r: 1.3,
        })
      }
      return dots
    }

    case 'bars': {
      // Bar chart: vertical columns of dots, varying heights
      const colSpacing = 11
      const dotSpacing = 6
      const cols = Math.floor((w.w - 12) / colSpacing)
      for (let c = 0; c < cols; c++) {
        // Bar height as fraction of widget height (varies by seed)
        const barFrac = 0.25 + prand(seed + c * 7) * 0.7
        const barPx = (w.h - 16) * barFrac
        const dotCount = Math.max(1, Math.floor(barPx / dotSpacing))
        for (let i = 0; i < dotCount; i++) {
          dots.push({
            x: w.x + 8 + c * colSpacing,
            y: w.y + w.h - 8 - i * dotSpacing,
            r: 1.5,
          })
        }
      }
      // Top axis sparse markers
      for (let i = 0; i < 4; i++) {
        dots.push({ x: w.x + 8 + i * (w.w / 4), y: w.y + 6, r: 0.9, dim: true })
      }
      return dots
    }

    case 'line': {
      // Line chart: connected wave of dots
      const points = Math.floor(w.w / 6)
      for (let i = 0; i < points; i++) {
        const phase = prand(seed + Math.floor(i / 3)) * Math.PI * 2
        const y = w.y + w.h / 2 + Math.sin((i * 0.4) + phase) * (w.h * 0.32) +
          (prand(seed + i) - 0.5) * 4
        dots.push({
          x: w.x + 6 + i * 6,
          y,
          r: 1.2,
        })
      }
      return dots
    }

    case 'table': {
      // Data table: even rows × cols of dots
      const rowH = 12
      const colW = 14
      const rows = Math.floor((w.h - 12) / rowH)
      const cols = Math.floor((w.w - 12) / colW)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Slightly dim the first column to suggest "header" column
          const isHeaderCol = c === 0
          const isHeaderRow = r === 0
          dots.push({
            x: w.x + 8 + c * colW,
            y: w.y + 8 + r * rowH,
            r: 1.4,
            dim: isHeaderCol || isHeaderRow,
          })
        }
      }
      return dots
    }
  }
}

import { useEffect, useRef, useState } from 'react'

const ALL_DOTS = WIDGETS.flatMap(generateWidgetDots)

const BUILD_DURATION_S = 4.5
const BUILD_STAGGER_S = 1.5
const SCROLL_DURATION_S = 14

/* Per-dot scatter origin + stagger — deterministic from index */
const DOT_ANIM = ALL_DOTS.map((d, i) => {
  const angle = prand(i * 13 + 1) * Math.PI * 2
  const radius = 80 + prand(i * 17 + 3) * 220
  const dx = Math.cos(angle) * radius - (d.x - VIEW_W / 2) * 0.15
  const dy = Math.sin(angle) * radius - (d.y - VIEW_H / 2) * 0.15
  const delay = prand(i * 29 + 7) * BUILD_STAGGER_S
  return { dx, dy, delay }
})

export default function WorkingSurfaceGlyph({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      data-armed={armed ? 'true' : 'false'}
      style={{
        // Edge fade — top/bottom — implies the page scrolls beyond the visible frame
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <style>{`
        @keyframes ws-build {
          0%   { transform: translate(var(--dx), var(--dy)); opacity: 0; }
          55%  { opacity: 1; }
          100% { transform: translate(0, 0); opacity: 1; }
        }
        .ws-dot {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          transform: translate(var(--dx), var(--dy));
        }
        [data-armed="true"] .ws-dot {
          animation: ws-build ${BUILD_DURATION_S}s cubic-bezier(0.25, 0.85, 0.35, 1) forwards;
        }
        @keyframes ws-scroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${CONTENT_H}px); }
        }
        [data-armed="true"] .ws-scroll-layer {
          animation: ws-scroll ${SCROLL_DURATION_S}s linear infinite;
          /* Hold still until the build-in finishes, then start scrolling. */
          animation-delay: ${BUILD_DURATION_S + 0.3}s;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        aria-hidden="true"
      >
        <g className="ws-scroll-layer">
          {ALL_DOTS.map((d, i) => {
            const a = DOT_ANIM[i]
            return (
              <circle
                key={`a${i}`}
                className="ws-dot"
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill={d.dim ? DOT_FILL_DIM : DOT_FILL}
                style={{
                  ['--dx' as string]: `${a.dx}px`,
                  ['--dy' as string]: `${a.dy}px`,
                  animationDelay: `${a.delay}s`,
                }}
              />
            )
          })}
          <g transform={`translate(0, ${CONTENT_H})`}>
            {ALL_DOTS.map((d, i) => {
              const a = DOT_ANIM[i]
              return (
                <circle
                  key={`b${i}`}
                  className="ws-dot"
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill={d.dim ? DOT_FILL_DIM : DOT_FILL}
                  style={{
                    ['--dx' as string]: `${a.dx}px`,
                    ['--dy' as string]: `${a.dy}px`,
                    animationDelay: `${a.delay}s`,
                  }}
                />
              )
            })}
          </g>
        </g>
      </svg>
    </div>
  )
}
