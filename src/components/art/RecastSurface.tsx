import { useRef, useEffect } from 'react'

/**
 * RecastSurface — homepage "The Standard" band ("Mastery, not familiarity").
 *
 * Same sizing and dot vocabulary as WorkingSurfaceGlyph (the piece above it
 * on the page), but a different verb. The dots build a dashboard from
 * scatter — then REFLOW, form to form: dashboard → board memo → slide deck
 * (two slides; the dotted frame holds still while the slide content
 * transitions, the way a deck does) → back to the dashboard. One body of
 * work, carried between every form the district speaks in.
 *
 * The cursor commands it too: dots yield and brighten under the pointer,
 * and settle back when it leaves.
 *
 * Reduced motion: the dashboard, rendered once, still. Parks offscreen.
 */

interface RecastSurfaceProps {
  className?: string
}

/* ── Content space (matches WorkingSurfaceGlyph scale) ── */
const CW = 720
const CH = 240

const DOT = '30,42,74'
const A_FULL = 0.78
const A_DIM = 0.42

/* ── Timeline (s) ── */
const BUILD_S = 4.0
const BUILD_STAGGER_S = 1.5
/* hold on each form, then morph to the next. The slide-to-slide step is
   quicker — it reads as a deck transition, not a recast. */
const SEGMENTS = [
  { hold: 4.5, morph: 1.8 }, // dashboard → memo
  { hold: 4.5, morph: 1.8 }, // memo → slide 1
  { hold: 3.0, morph: 1.0 }, // slide 1 → slide 2 (deck transition)
  { hold: 3.0, morph: 1.8 }, // slide 2 → dashboard
]
const CYCLE_S = SEGMENTS.reduce((s, x) => s + x.hold + x.morph, 0)

function prand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

interface Dot {
  x: number
  y: number
  r: number
  dim?: boolean
}

/* ── Form A: the dashboard (WorkingSurfaceGlyph vocabulary) ── */
function dashboardDots(): Dot[] {
  const dots: Dot[] = []
  for (let c = 0; c < 14; c++) dots.push({ x: 30 + c * 14, y: 22, r: 1.4, dim: true })
  for (let t = 0; t < 3; t++) {
    const x0 = 30 + t * 150
    dots.push({ x: x0 + 10, y: 50, r: 3 })
    for (let c = 0; c < 7; c++) dots.push({ x: x0 + 24 + c * 6, y: 52, r: 1, dim: true })
    for (let c = 0; c < 5; c++) dots.push({ x: x0 + 10 + c * 6, y: 64, r: 0.9, dim: true })
    for (let i = 0; i < 14; i++) {
      const yJ = (prand(t * 31 + i * 3) - 0.5) * 18
      dots.push({ x: x0 + 10 + i * 8, y: 86 + yJ, r: 1.3 })
    }
  }
  for (let c = 0; c < 18; c++) {
    const barFrac = 0.25 + prand(5 + c * 7) * 0.7
    const n = Math.max(1, Math.floor((86 * barFrac) / 6))
    for (let i = 0; i < n; i++) dots.push({ x: 490 + c * 12, y: 100 - i * 6, r: 1.5 })
  }
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 26; c++)
      dots.push({ x: 30 + c * 14, y: 130 + r * 13, r: 1.4, dim: c === 0 || r === 0 })
  for (let i = 0; i < 44; i++) {
    const phase = prand(17 + Math.floor(i / 3)) * Math.PI * 2
    dots.push({
      x: 420 + i * 6,
      y: 175 + Math.sin(i * 0.4 + phase) * 28 + (prand(17 + i) - 0.5) * 4,
      r: 1.2,
    })
  }
  return dots
}

/* ── Form B: the board memo ── */
function memoDots(): Dot[] {
  const dots: Dot[] = []
  for (let c = 0; c < 16; c++) dots.push({ x: 150 + c * 11, y: 26, r: 1.8 })
  for (let c = 0; c < 9; c++) dots.push({ x: 150 + c * 8, y: 44, r: 1, dim: true })
  for (let c = 0; c < 12; c++) dots.push({ x: 150 + c * 8, y: 56, r: 1, dim: true })
  const paras = [4, 5, 3]
  let y = 78
  for (let p = 0; p < paras.length; p++) {
    for (let l = 0; l < paras[p]; l++) {
      const lineLen = l === paras[p] - 1 ? 0.45 + prand(p * 9 + l) * 0.3 : 0.92 + prand(p * 7 + l) * 0.06
      const cols = Math.floor((320 * lineLen) / 9)
      for (let c = 0; c < cols; c++) {
        if (prand(p * 131 + l * 37 + c) < 0.12) continue
        dots.push({ x: 150 + c * 9, y, r: 1.3 })
      }
      y += 12
    }
    y += 9
  }
  for (let c = 0; c < 8; c++) {
    const n = Math.max(1, Math.floor((40 * (0.3 + prand(43 + c * 7) * 0.7)) / 6))
    for (let i = 0; i < n; i++) dots.push({ x: 502 + c * 11, y: 120 - i * 6, r: 1.4 })
  }
  for (let c = 0; c < 6; c++) dots.push({ x: 502 + c * 12, y: 132, r: 0.9, dim: true })
  for (let c = 0; c < 8; c++)
    dots.push({ x: 470 + c * 9, y: 196 + Math.sin(c * 1.3) * 3, r: 1.4 })
  for (let c = 0; c < 10; c++) dots.push({ x: 470 + c * 7, y: 212, r: 0.9, dim: true })
  return dots
}

/* ── The slide frame, shared by both slides — because it's identical in
   each, the frame holds still during the slide-to-slide morph and only
   the content travels: a deck transition. 16:9, centered. ── */
const SLIDE = { x: 205, y: 28, w: 310, h: 174 }
function slideFrameDots(): Dot[] {
  const dots: Dot[] = []
  const step = 13
  for (let x = SLIDE.x; x <= SLIDE.x + SLIDE.w; x += step) {
    dots.push({ x, y: SLIDE.y, r: 0.9, dim: true })
    dots.push({ x, y: SLIDE.y + SLIDE.h, r: 0.9, dim: true })
  }
  for (let y = SLIDE.y + step; y < SLIDE.y + SLIDE.h; y += step) {
    dots.push({ x: SLIDE.x, y, r: 0.9, dim: true })
    dots.push({ x: SLIDE.x + SLIDE.w, y, r: 0.9, dim: true })
  }
  return dots
}

/* ── Form C: slide 1 — title slide with a chart ── */
function slide1Dots(): Dot[] {
  const dots = slideFrameDots()
  // title
  for (let c = 0; c < 13; c++) dots.push({ x: SLIDE.x + 26 + c * 12, y: SLIDE.y + 34, r: 1.9 })
  // subtitle
  for (let c = 0; c < 16; c++) dots.push({ x: SLIDE.x + 26 + c * 8, y: SLIDE.y + 52, r: 1, dim: true })
  // bar chart, lower left of slide
  for (let c = 0; c < 10; c++) {
    const n = Math.max(1, Math.floor((52 * (0.3 + prand(57 + c * 7) * 0.7)) / 6.5))
    for (let i = 0; i < n; i++)
      dots.push({ x: SLIDE.x + 30 + c * 12, y: SLIDE.y + 138 - i * 6.5, r: 1.4 })
  }
  // bullet lines, right
  for (let l = 0; l < 4; l++)
    for (let c = 0; c < 9 - (l % 2); c++)
      dots.push({ x: SLIDE.x + 172 + c * 9, y: SLIDE.y + 88 + l * 16, r: 1.2 })
  return dots
}

/* ── Form D: slide 2 — the stat slide ── */
function slide2Dots(): Dot[] {
  const dots = slideFrameDots()
  // one commanding stat: a big dot with a ring
  const cx = SLIDE.x + 92
  const cy = SLIDE.y + 88
  dots.push({ x: cx, y: cy, r: 4.4 })
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2
    dots.push({ x: cx + Math.cos(a) * 26, y: cy + Math.sin(a) * 26, r: 1.2 })
  }
  // stat label beneath
  for (let c = 0; c < 8; c++) dots.push({ x: cx - 28 + c * 8, y: cy + 44, r: 1, dim: true })
  // supporting lines, right
  for (let l = 0; l < 5; l++)
    for (let c = 0; c < 10 - (l % 3); c++)
      dots.push({ x: SLIDE.x + 168 + c * 9, y: SLIDE.y + 52 + l * 18, r: 1.2 })
  // source line, bottom
  for (let c = 0; c < 11; c++)
    dots.push({ x: SLIDE.x + 26 + c * 8, y: SLIDE.y + SLIDE.h - 16, r: 0.9, dim: true })
  return dots
}

/* Pair dots between forms by reading order so each reflow sweeps coherently. */
const byReadingOrder = (a: Dot, b: Dot) => a.y * 2 + a.x - (b.y * 2 + b.x)
const FORMS: Dot[][] = [
  dashboardDots().sort(byReadingOrder),
  memoDots().sort(byReadingOrder),
  slide1Dots().sort(byReadingOrder),
  slide2Dots().sort(byReadingOrder),
]
const N = Math.max(...FORMS.map((f) => f.length))
const dotAt = (form: number, i: number) =>
  FORMS[form][Math.floor((i * FORMS[form].length) / N)]

const SCATTER = Array.from({ length: N }, (_, i) => {
  const angle = prand(i * 13 + 1) * Math.PI * 2
  const radius = 50 + prand(i * 17 + 3) * 180
  return {
    dx: Math.cos(angle) * radius,
    dy: Math.sin(angle) * radius,
    delay: prand(i * 29 + 7) * BUILD_STAGGER_S,
    mDelay: prand(i * 41 + 11) * 0.35,
  }
})

export default function RecastSurface({ className }: RecastSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })
  const armedAtRef = useRef(0)
  const ptrRef = useRef({ px: -1e4, py: -1e4, tpx: -1e4, tpy: -1e4, active: 0, tactive: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w: rect.width, h: rect.height }
    }
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) drawFrame(performance.now())
    })
    ro.observe(container)
    resize()

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const p = ptrRef.current
      p.tpx = e.clientX - rect.left
      p.tpy = e.clientY - rect.top
      p.tactive = 1
    }
    const onLeave = () => {
      ptrRef.current.tactive = 0
    }
    if (!reduce) {
      container.addEventListener('pointermove', onMove)
      container.addEventListener('pointerleave', onLeave)
    }

    const drawFrame = (now: number) => {
      const { w, h } = sizeRef.current
      if (w === 0 || h === 0) return
      ctx.clearRect(0, 0, w, h)

      const armed = armedAtRef.current
      const tb = reduce ? BUILD_S + 1 : armed > 0 ? (now - armed) / 1000 : -1
      if (tb < 0) return

      /* Desktop: contain the full stage. Narrow screens: cover-fit — zoom
         into the artifact's center so the dots stay legible instead of
         shrinking the whole stage to lint. */
      const narrow = w < 560
      const scale = narrow ? Math.max(w / CW, h / CH) : Math.min(w / CW, h / CH)
      const ox = (w - CW * scale) / 2
      const oy = (h - CH * scale) / 2

      /* which form are we on, and how far into the morph to the next? */
      let formIdx = 0
      let mBase = 0
      if (!reduce && tb > BUILD_S + 0.3) {
        let ct = (tb - (BUILD_S + 0.3)) % CYCLE_S
        for (let s = 0; s < SEGMENTS.length; s++) {
          const seg = SEGMENTS[s]
          if (ct < seg.hold) {
            formIdx = s
            mBase = 0
            break
          }
          ct -= seg.hold
          if (ct < seg.morph) {
            formIdx = s
            mBase = ct / seg.morph
            break
          }
          ct -= seg.morph
        }
      }
      const nextIdx = (formIdx + 1) % FORMS.length

      /* pointer easing */
      const p = ptrRef.current
      p.px += (p.tpx - p.px) * 0.16
      p.py += (p.tpy - p.py) * 0.16
      p.active += (p.tactive - p.active) * 0.08
      // pointer in content coords
      const cpx = (p.px - ox) / scale
      const cpy = (p.py - oy) / scale
      const R = 64 // content-space influence radius

      for (let i = 0; i < N; i++) {
        const sc = SCATTER[i]
        const src = dotAt(formIdx, i)
        const dst = dotAt(nextIdx, i)

        // staggered morph progress per dot
        const m = mBase === 0 ? 0 : smoothstep(mBase * 1.35 - sc.mDelay)

        let x = src.x + (dst.x - src.x) * m
        let y = src.y + (dst.y - src.y) * m
        // dots lift slightly off the page mid-flight
        if (mBase > 0) y -= Math.sin(m * Math.PI) * 7

        const dim = m < 0.5 ? src.dim : dst.dim
        const r = src.r + (dst.r - src.r) * m
        let alpha = dim ? A_DIM : A_FULL

        // build-in from scatter
        if (tb < BUILD_S + 0.5) {
          const bp = smoothstep((tb - sc.delay) / (BUILD_S - BUILD_STAGGER_S))
          if (bp <= 0) continue
          x += sc.dx * (1 - bp)
          y += sc.dy * (1 - bp)
          alpha *= Math.min(1, bp * 1.8)
        } else if (p.active > 0.01) {
          // the cursor commands the surface: dots yield and brighten
          const ddx = x - cpx
          const ddy = y - cpy
          const d = Math.hypot(ddx, ddy)
          if (d < R) {
            const f = (1 - d / R) * p.active
            const push = f * f * 13
            const inv = d > 0.001 ? 1 / d : 0
            x += ddx * inv * push
            y += ddy * inv * push
            alpha = Math.min(0.95, alpha + 0.16 * f)
          }
        }

        if (alpha <= 0.01) continue
        ctx.beginPath()
        ctx.arc(ox + x * scale, oy + y * scale, Math.max(narrow ? 1.15 : 0.9, r * scale), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${DOT},${alpha})`
        ctx.fill()
      }
    }

    let visible = false
    const loop = (now: number) => {
      drawFrame(now)
      if (visible) animRef.current = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting
          if (e.isIntersecting) {
            if (armedAtRef.current === 0) armedAtRef.current = performance.now()
            if (!reduce) {
              cancelAnimationFrame(animRef.current)
              animRef.current = requestAnimationFrame(loop)
            } else {
              drawFrame(performance.now())
            }
          } else {
            cancelAnimationFrame(animRef.current)
          }
        }
      },
      { threshold: 0.2 },
    )
    io.observe(container)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        // taller stage on phones so the cover-fit has room to breathe
        aspectRatio:
          typeof window !== 'undefined' && window.innerWidth < 560 ? '2.1 / 1' : '3 / 1',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
