/**
 * HeroParticles — the studios-site hero, reborn as a particle field.
 *
 * Revives the cursor-reactive "wind tunnel" from the early Anyra design
 * (Archive SoundWaveGlyph) and points it at this site's story: navy dots
 * stream in from the left in five bands — one per studio — and FUNNEL into
 * a single seam on the right. Five audiences, one standard, made of moving
 * particles. The cursor is an obstacle: dots part around your pointer and
 * reform behind it. Brass/teal sparkles carry the brand's living color.
 *
 * Canvas 2D, rAF, dpr-aware, ResizeObserver. Reduced motion → a single
 * static converged frame. Touch keeps the flow, skips cursor repulsion.
 */
import { useEffect, useRef } from 'react'

const NAVY = '30, 42, 74'
const TEAL = '45, 90, 90'
const BRASS = '168, 128, 42'

const BAND_Y = [0.2, 0.35, 0.5, 0.65, 0.8] // normalized baselines, one per studio
const PER_BAND = 72
const SPARKLE_CHANCE = 0.13

function prand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
function smoothstep(a: number, b: number, t: number) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

interface P {
  band: number
  jitter: number // px offset within band
  x: number // px
  speed: number // px/ms
  radius: number
  seed: number
  sparkle: boolean
  warm: boolean // sparkle hue: brass vs teal
}

export default function HeroParticles({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let w = 0
    let h = 0
    let particles: P[] = []

    const build = () => {
      // particle count scales with width (mobile stays light)
      const count = Math.max(60, Math.min(BAND_Y.length * PER_BAND, Math.floor(w / 3.2)))
      const perBand = Math.ceil(count / BAND_Y.length)
      particles = []
      for (let b = 0; b < BAND_Y.length; b++) {
        for (let c = 0; c < perBand; c++) {
          const i = b * perBand + c
          particles.push({
            band: b,
            jitter: (prand(i * 13 + 1) - 0.5) * h * 0.07,
            x: prand(i * 17 + 3) * (w + 200) - 100,
            speed: (0.018 + prand(i * 29 + 7) * 0.03) * (w / 1200),
            radius: 0.8 + prand(i * 41 + 11) * 1.4,
            seed: prand(i * 53 + 17) * Math.PI * 2,
            sparkle: prand(i * 67 + 23) < SPARKLE_CHANCE,
            warm: prand(i * 71 + 5) < 0.5,
          })
        }
      }
    }

    const fit = () => {
      const rect = wrap.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    // geometry helpers (recomputed from live w/h so resize just works)
    const seam = () => ({ x: w * 0.88, y: h * 0.5 })
    const convergeStart = () => w * 0.42

    // a particle's resting position at horizontal x
    function restY(p: P, x: number) {
      const baseY = BAND_Y[p.band] * h + p.jitter
      const sx = seam()
      const ct = smoothstep(convergeStart(), sx.x, x)
      const drift = Math.sin(x * 0.01 + p.seed) * 5 * (1 - ct)
      return baseY * (1 - ct) + sx.y * ct + drift
    }

    const paint = (now: number, animated: boolean) => {
      ctx.clearRect(0, 0, w, h)
      const sm = seam()
      for (const p of particles) {
        const x = p.x
        let y = restY(p, x)
        // cursor repulsion — part around the pointer
        let px = x
        if (cursorActive) {
          const cdx = x - mouseX
          const cdy = y - mouseY
          const d2 = cdx * cdx + cdy * cdy
          const SIG = 100 // wider, softer field
          const fall = Math.exp(-d2 / (2 * SIG * SIG))
          const dist = Math.sqrt(d2) || 1
          const f = fall * influence
          // gentle vortex: a little outward room + a tangential swirl
          const radial = 10 * f
          const swirl = 22 * f
          px = x + (cdx / dist) * radial + (-cdy / dist) * swirl
          y = y + (cdy / dist) * radial + (cdx / dist) * swirl
        }
        // alpha: fade in from the left edge, dim toward the far right tail
        const inFade = smoothstep(-100, 80, x)
        const ct = smoothstep(convergeStart(), sm.x, x)
        const depth = 0.4 + ((p.radius - 0.8) / 1.4) * 0.4
        let alpha = depth * inFade * (1 - 0.5 * smoothstep(sm.x, w + 60, x))
        let rgb = NAVY
        if (p.sparkle && animated) {
          rgb = p.warm ? BRASS : TEAL
          alpha *= 0.5 + 0.5 * Math.sin(now * 0.0016 + p.seed * 4)
        } else if (p.sparkle) {
          rgb = p.warm ? BRASS : TEAL
        }
        // tighten + warm slightly as they reach the seam
        const r = p.radius * (1 - 0.25 * ct)
        if (alpha <= 0.02) continue
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`
        ctx.beginPath()
        ctx.arc(px, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      // the seam — a living focal point where the five become one
      const seamPulse = animated ? 0.55 + 0.35 * Math.sin(now * 0.0012) : 0.7
      ctx.fillStyle = `rgba(${BRASS}, ${seamPulse})`
      ctx.beginPath()
      ctx.arc(sm.x, sm.y, 3.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = `rgba(${TEAL}, ${seamPulse * 0.4})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(sm.x, sm.y, 9, 0, Math.PI * 2)
      ctx.stroke()
    }

    // ── cursor state ──
    let targetX = -9999
    let targetY = -9999
    let mouseX = -9999
    let mouseY = -9999
    let influence = 0
    let cursorActive = false
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    }
    const onLeave = () => {
      targetX = -9999
      targetY = -9999
    }

    if (reduce) {
      // single static converged frame — no loop, no listeners
      paint(0, false)
      return () => ro.disconnect()
    }

    if (!coarse) {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
    }

    let raf = 0
    let last = performance.now()
    const render = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now

      const lerpK = 1 - Math.pow(0.88, dt / 16.67) // gentler ease toward the cursor
      if (targetX > -1000) {
        if (mouseX < -1000) {
          mouseX = targetX
          mouseY = targetY
        } else {
          mouseX += (targetX - mouseX) * lerpK
          mouseY += (targetY - mouseY) * lerpK
        }
        influence += (1 - influence) * lerpK
      } else {
        influence += (0 - influence) * lerpK
      }
      cursorActive = influence > 0.01

      for (const p of particles) {
        p.x += p.speed * dt
        if (p.x > w + 120) p.x = -100 - prand(p.seed * 31 + p.band) * 200
      }

      paint(now, true)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
