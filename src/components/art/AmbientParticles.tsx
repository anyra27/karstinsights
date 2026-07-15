/**
 * AmbientParticles — the warm-sand wind field from the learning-studio modules,
 * ported verbatim so the marketing surfaces move exactly like the modules do.
 *
 * Sand + dust blow rightward and lift, color-cycling through a palette, with
 * per-particle turbulence and mouse repulsion.
 *   tone="sand"  — warm palette for cream surfaces (the studio default)
 *   tone="white" — small white grains for near-black surfaces (the dark CTA)
 *
 * Marketing-only additions over the studio original: a reduced-motion still frame
 * and IntersectionObserver parking (the studio runs it full-viewport; here these
 * sit mid-page, so they shouldn't burn rAF offscreen).
 */
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  baseAlpha: number
  colorPhase: number
  speed: number
  kind: 'sand' | 'dust'
  turbulenceOffset: number
}

// Warm sand palette (RGB) — identical to the studio modules (cream surfaces)
const SAND_COLORS = [
  [95, 82, 65],
  [75, 62, 48],
  [110, 95, 74],
  [60, 50, 38],
  [85, 72, 56],
  [100, 88, 68],
]

// White palette — the same field, for near-black surfaces (the dark CTA)
const WHITE_COLORS = [
  [245, 244, 240],
  [255, 255, 255],
  [226, 228, 232],
  [236, 234, 228],
  [214, 216, 222],
  [248, 246, 240],
]

function lerpColor(t: number, colors: number[][]): [number, number, number] {
  const len = colors.length
  const scaled = (((t % 1) + 1) % 1) * (len - 1)
  const i = Math.floor(scaled)
  const frac = scaled - i
  const a = colors[i]
  const b = colors[Math.min(i + 1, len - 1)]
  const f = (1 - Math.cos(frac * Math.PI)) * 0.5
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}

function spawnSand(w: number, h: number): Particle {
  const spawnFromLeft = Math.random() < 0.6
  return {
    x: spawnFromLeft ? -10 : Math.random() * w * 0.5,
    y: h * (0.7 + Math.random() * 0.3),
    vx: Math.random() * 0.2 + 0.075,
    vy: -(Math.random() * 0.1 + 0.025),
    size: Math.random() * 1.8 + 0.4,
    baseAlpha: Math.random() * 0.2 + 0.1,
    alpha: 0,
    colorPhase: Math.random(),
    speed: Math.random() * 0.2 + 0.1,
    kind: 'sand',
    turbulenceOffset: Math.random() * Math.PI * 2,
  }
}

function spawnDust(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: h * (0.5 + Math.random() * 0.5),
    vx: Math.random() * 0.075 + 0.025,
    vy: -(Math.random() * 0.0375 + 0.0125),
    size: Math.random() * 25 + 12,
    baseAlpha: Math.random() * 0.04 + 0.02,
    alpha: 0,
    colorPhase: Math.random(),
    speed: Math.random() * 0.1 + 0.05,
    kind: 'dust',
    turbulenceOffset: Math.random() * Math.PI * 2,
  }
}

export default function AmbientParticles({
  className,
  tone = 'sand',
}: {
  className?: string
  /** 'sand' = warm palette for cream surfaces; 'white' = small white grains for near-black */
  tone?: 'sand' | 'white'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const colors = tone === 'white' ? WHITE_COLORS : SAND_COLORS
    const sizeScale = tone === 'white' ? 0.6 : 1
    let w = 0
    let h = 0

    function resize() {
      if (!canvas) return
      w = canvas.parentElement?.clientWidth || window.innerWidth
      h = canvas.parentElement?.clientHeight || window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function makeSand(): Particle {
      const p = spawnSand(w, h)
      p.size *= sizeScale
      return p
    }
    function makeDust(): Particle {
      const p = spawnDust(w, h)
      p.size *= sizeScale
      return p
    }

    function initParticles() {
      const area = w * h
      const sandCount = Math.min(400, Math.floor(area / 4000))
      const dustCount = Math.min(20, Math.floor(area / 70000))
      const sand: Particle[] = Array.from({ length: sandCount }, () => {
        const p = makeSand()
        p.x = Math.random() * w
        p.y = h * (0.3 + Math.random() * 0.7)
        p.alpha = p.baseAlpha
        return p
      })
      const dust: Particle[] = Array.from({ length: dustCount }, () => {
        const p = makeDust()
        p.x = Math.random() * w
        p.alpha = p.baseAlpha
        return p
      })
      particlesRef.current = [...dust, ...sand]
    }

    resize()
    initParticles()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement || canvas)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    let time = 0
    let running = false

    function step(loop: boolean) {
      if (!ctx) return
      time += 0.004
      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        const colorT = p.colorPhase + time * p.speed
        const [r, g, b] = lerpColor(colorT, colors)
        const turbX = Math.sin(time * 0.3 + p.turbulenceOffset) * 0.04
        const turbY = Math.cos(time * 0.2 + p.turbulenceOffset * 1.5) * 0.02

        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repulseRadius = p.kind === 'dust' ? 150 : 100
        if (dist < repulseRadius && dist > 0) {
          const force = ((repulseRadius - dist) / repulseRadius) * 0.4
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        p.x += p.vx + turbX
        p.y += p.vy + turbY

        if (p.alpha < p.baseAlpha) p.alpha = Math.min(p.baseAlpha, p.alpha + 0.001)

        const heightFade = p.y < h * 0.4 ? Math.max(0, p.y / (h * 0.4)) : 1
        const drawAlpha = p.alpha * heightFade

        if (p.x > w + 20 || p.y < -20 || p.x < -40) {
          Object.assign(p, p.kind === 'sand' ? makeSand() : makeDust())
          continue
        }
        if (drawAlpha <= 0) continue

        if (p.kind === 'dust') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          grad.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${drawAlpha * 0.6})`)
          grad.addColorStop(0.5, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${drawAlpha * 0.25})`)
          grad.addColorStop(1, `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${drawAlpha})`
          ctx.fill()
        }
      }

      if (loop && running) animRef.current = requestAnimationFrame(() => step(true))
    }

    if (reduce) {
      step(false) // single settled frame, no loop, no listeners
      return () => ro.disconnect()
    }

    window.addEventListener('mousemove', handleMouse)

    // park offscreen — only run while the section is in view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !running) {
            running = true
            animRef.current = requestAnimationFrame(() => step(true))
          } else if (!e.isIntersecting && running) {
            running = false
            cancelAnimationFrame(animRef.current)
          }
        })
      },
      { threshold: 0.02 },
    )
    io.observe(canvas.parentElement || canvas)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
