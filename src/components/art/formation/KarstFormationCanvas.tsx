import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import {
  HERO_FORMATION_SHOTS,
  buildHeroFormationGeometry,
  clamp01,
  formationStateAt,
  smoothstep,
} from './heroFormations'

export interface KarstFormationCanvasProps {
  /** Scroll progress for the full cinematic hero track, normalized to 0–1. */
  progress: MotionValue<number>
  className?: string
}

const BUCKET_COUNT = 6
const DEPTH_STYLES = [
  'rgba(172,170,163,0.12)',
  'rgba(192,191,184,0.20)',
  'rgba(211,212,208,0.32)',
  'rgba(229,230,226,0.48)',
  'rgba(244,241,233,0.66)',
  'rgba(255,252,244,0.84)',
] as const
const TAU = Math.PI * 2
const AUTO_YAW_RATE = 0.00009

function interpolate(a: number, b: number, mix: number) {
  return a + (b - a) * mix
}

function particleCount(width: number, coarse: boolean, saveData: boolean) {
  let count = coarse || width <= 720
    ? 4200
    : width > 1600
      ? 19000
      : width > 1100
        ? 16500
        : 13000
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    count = Math.floor(count * 0.7)
  }
  if (saveData) count = Math.min(count, 3800)
  return count
}

/**
 * The Fieldwork formation engine, adapted for the Karst homepage. The body is
 * still made from one deterministic set of particle IDs; scroll, camera and
 * light direct it as seven distinct shots rather than swapping illustrations.
 */
export default function KarstFormationCanvas({ progress, className = '' }: KarstFormationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const containerNode = containerRef.current
    const canvasNode = canvasRef.current
    if (!containerNode || !canvasNode) return
    const context = canvasNode.getContext('2d')
    if (!context) return
    const container: HTMLDivElement = containerNode
    const canvas: HTMLCanvasElement = canvasNode
    const ctx: CanvasRenderingContext2D = context

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    )

    let width = 0
    let height = 0
    let dpr = 1
    let count = 0
    let radius = 0
    let geometry = buildHeroFormationGeometry(1, 1)
    // Reduced motion holds the explanatory Assembly at its authored camera angle.
    let targetProgress = reducedMotion ? 0.56 : clamp01(progress.get())
    let renderedProgress = targetProgress
    let running = false
    let frame = 0
    let resizeFrame = 0
    let last = 0
    let elapsed = 0
    let autoYaw = 0.6

    // The body condenses once on first view, then remains entirely scroll-led.
    let boot = reducedMotion ? 1 : 0.06
    let bootStartedAt = 0

    // Eased camera parallax and the approved soft screen-space vortex.
    let pointerX = -10000
    let pointerY = -10000
    let targetPointerX = -10000
    let targetPointerY = -10000
    let pointerInfluence = 0
    let pointerInside = false

    const bucketX: Float32Array[] = []
    const bucketY: Float32Array[] = []
    const bucketSize: Float32Array[] = []
    const bucketLength = new Int32Array(BUCKET_COUNT)

    function composition() {
      const compact = width <= 720
      return {
        cx: width * (compact ? 0.5 : 0.54),
        cy: height * (compact ? 0.38 : 0.44),
        radius: Math.min(width, height) * (compact ? 0.27 : 0.31),
      }
    }

    function allocateBuckets() {
      bucketX.length = 0
      bucketY.length = 0
      bucketSize.length = 0
      for (let i = 0; i < BUCKET_COUNT; i++) {
        bucketX.push(new Float32Array(count))
        bucketY.push(new Float32Array(count))
        bucketSize.push(new Float32Array(count))
      }
    }

    function fit() {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      width = rect.width
      height = rect.height
      dpr = Math.max(1, Math.min(coarse ? 1.5 : 2, window.devicePixelRatio || 1))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true

      radius = composition().radius
      count = particleCount(width, coarse, saveData)
      geometry = buildHeroFormationGeometry(count, radius)
      allocateBuckets()
      draw()
    }

    function queueFit() {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(fit)
    }

    function drawAtmosphere(cx: number, cy: number, bodyRadius: number) {
      if (coarse) {
        // Phones skip the two drifting gradients: one static center wash
        // costs a third of the fills and reads the same at this size.
        const center = ctx.createRadialGradient(cx, cy, bodyRadius * 0.03, cx, cy, bodyRadius * 1.2)
        center.addColorStop(0, 'rgba(236,232,222,0.05)')
        center.addColorStop(0.5, 'rgba(202,193,177,0.018)')
        center.addColorStop(1, 'rgba(202,193,177,0)')
        ctx.fillStyle = center
        ctx.fillRect(0, 0, width, height)
        return
      }
      const breath = 1 + Math.sin(elapsed * 0.11) * 0.08
      const warmX = cx + Math.cos(elapsed * 0.05) * bodyRadius * 1.15
      const warmY = cy + Math.sin(elapsed * 0.038) * bodyRadius * 0.7
      const warm = ctx.createRadialGradient(
        warmX,
        warmY,
        0,
        warmX,
        warmY,
        bodyRadius * 1.25 * breath,
      )
      warm.addColorStop(0, 'rgba(190,145,88,0.055)')
      warm.addColorStop(1, 'rgba(190,145,88,0)')
      ctx.fillStyle = warm
      ctx.fillRect(0, 0, width, height)

      const coolX = cx + Math.cos(elapsed * 0.041 + 2.4) * bodyRadius * 1.3
      const coolY = cy + Math.sin(elapsed * 0.052 + 1.2) * bodyRadius * 0.82
      const cool = ctx.createRadialGradient(coolX, coolY, 0, coolX, coolY, bodyRadius * 1.4)
      cool.addColorStop(0, 'rgba(85,100,119,0.06)')
      cool.addColorStop(1, 'rgba(85,100,119,0)')
      ctx.fillStyle = cool
      ctx.fillRect(0, 0, width, height)

      const center = ctx.createRadialGradient(
        cx,
        cy,
        bodyRadius * 0.03,
        cx,
        cy,
        bodyRadius * 1.2,
      )
      center.addColorStop(0, 'rgba(236,232,222,0.05)')
      center.addColorStop(0.5, 'rgba(202,193,177,0.018)')
      center.addColorStop(1, 'rgba(202,193,177,0)')
      ctx.fillStyle = center
      ctx.fillRect(0, 0, width, height)
    }

    function draw() {
      if (!width || !height || !count) return
      ctx.clearRect(0, 0, width, height)

      const layout = composition()
      const state = formationStateAt(renderedProgress, reducedMotion)
      const fromShot = HERO_FORMATION_SHOTS[state.from]
      const toShot = HERO_FORMATION_SHOTS[state.to]
      const cameraMix = state.cameraMix
      const dxR = interpolate(fromShot.dxR, toShot.dxR, cameraMix)
      const dyR = interpolate(fromShot.dyR, toShot.dyR, cameraMix)
      const bodyScale = interpolate(fromShot.scale, toShot.scale, cameraMix)
      const shotPitch = interpolate(fromShot.pitch, toShot.pitch, cameraMix)
      const roll = interpolate(fromShot.roll, toShot.roll, cameraMix)
      const focalR = interpolate(fromShot.focalR, toShot.focalR, cameraMix)
      const compact = width <= 720
      const parallax = pointerInside ? pointerInfluence : 0

      const cx = layout.cx + dxR * radius * (compact ? 0.35 : 1) +
        (pointerX / Math.max(1, width) - 0.5) * 6 * parallax
      const cy = layout.cy + dyR * radius * (compact ? 0.6 : 1) +
        (pointerY / Math.max(1, height) - 0.5) * 4 * parallax
      const pitch = shotPitch +
        (pointerInside ? (pointerY / Math.max(1, height) - 0.5) * 0.02 * parallax : 0)
      const bodyRadius = radius * bodyScale

      drawAtmosphere(cx, cy, bodyRadius)

      const from = geometry.shapes[state.from]
      const to = geometry.shapes[state.to]
      const force = state.from < geometry.forces.length ? geometry.forces[state.from] : null
      const cosPitch = Math.cos(pitch)
      const sinPitch = Math.sin(pitch)
      const yawBias = interpolate(fromShot.yawBias, toShot.yawBias, cameraMix)
      const yaw = autoYaw + renderedProgress * 2.6 + yawBias
      const cosYaw = Math.cos(yaw)
      const sinYaw = Math.sin(yaw)
      const cosRoll = Math.cos(compact ? roll * 0.65 : roll)
      const sinRoll = Math.sin(compact ? roll * 0.65 : roll)
      const focal = radius * focalR
      const pointerActive = !coarse && pointerInfluence > 0.01
      const pointerSigma2 = 2 * 44 * 44
      const fieldPresence = state.from === 0 ? 1 - state.mix : 0

      bucketLength.fill(0)

      for (let i = 0; i < count; i++) {
        const ix = i * 3
        const stagger = geometry.staggers[i]
        const particleMix = state.mix <= 0
          ? 0
          : state.mix >= 1
            ? 1
            : smoothstep(clamp01((state.mix - stagger * 0.08) / 0.92))

        let x = interpolate(from[ix], to[ix], particleMix)
        let y = interpolate(from[ix + 1], to[ix + 1], particleMix)
        let z = interpolate(from[ix + 2], to[ix + 2], particleMix)

        if (force) {
          // Keep the morph dimensional without letting the transition arc become the event.
          const flightCurve = Math.sin(Math.PI * particleMix)
          const flight = flightCurve * flightCurve * 0.42
          x += force[ix] * flight
          y += force[ix + 1] * flight
          z += force[ix + 2] * flight
        }

        x *= bodyScale
        // Portrait screens crop a larger environmental field rather than shrinking it into a blob.
        y *= bodyScale * (1 + fieldPresence * (compact ? 1.25 : 0))
        z *= bodyScale

        const pitchedY = y * cosPitch - z * sinPitch
        const pitchedZ = y * sinPitch + z * cosPitch
        let rotatedX = x * cosYaw + pitchedZ * sinYaw
        const rotatedZ = -x * sinYaw + pitchedZ * cosYaw
        let rotatedY = pitchedY

        if (roll) {
          const rolledX = rotatedX * cosRoll - rotatedY * sinRoll
          rotatedY = rotatedX * sinRoll + rotatedY * cosRoll
          rotatedX = rolledX
        }

        const perspective = focal / (focal + rotatedZ)
        if (perspective <= 0) continue
        let px = cx + rotatedX * perspective
        let py = cy + rotatedY * perspective

        if (pointerActive) {
          const pointerDx = px - pointerX
          const pointerDy = py - pointerY
          const distanceSquared = pointerDx * pointerDx + pointerDy * pointerDy
          if (distanceSquared < 22500) {
            const falloff = Math.exp(-distanceSquared / pointerSigma2) * pointerInfluence
            const distance = Math.sqrt(distanceSquared) || 1
            px += (pointerDx / distance) * 0.7 * falloff + (-pointerDy / distance) * 1.4 * falloff
            py += (pointerDy / distance) * 0.7 * falloff + (pointerDx / distance) * 1.4 * falloff
          }
        }

        if (boot < 1) {
          const assembly = smoothstep(clamp01((boot - stagger * 0.35) / 0.65))
          const assemblyScale = 2 - assembly
          px = cx + (px - cx) * assemblyScale
          py = cy + (py - cy) * assemblyScale
          if (assembly < 0.04) continue
        }

        let apertureScale = 1
        if (fieldPresence > 0.15) {
          const apertureX = (px - width * 0.5) / Math.max(1, width * 0.3)
          const apertureY = (py - height * 0.5) / Math.max(1, height * 0.2)
          const aperture = Math.exp(-(apertureX * apertureX + apertureY * apertureY) * 1.8)
          // A stable size falloff keeps the headline legible without a hard, shimmering cutout.
          // `stagger` is precomputed per particle, so the mask adds no frame-time random work.
          apertureScale = Math.max(
            0.08,
            1 - aperture * (0.72 + stagger * 0.22) * fieldPresence,
          )
        }

        if (px < -4 || px > width + 4 || py < -4 || py > height + 4) continue

        const depth = clamp01((bodyRadius - rotatedZ) / Math.max(1, bodyRadius * 2))
        const bucket = Math.min(BUCKET_COUNT - 1, Math.floor(depth * BUCKET_COUNT))
        const bucketIndex = bucketLength[bucket]
        const size = Math.max(0.12, Math.min(1.36, 0.58 + perspective * 0.55) * apertureScale)
        bucketX[bucket][bucketIndex] = px
        bucketY[bucket][bucketIndex] = py
        bucketSize[bucket][bucketIndex] = size
        bucketLength[bucket] = bucketIndex + 1
      }

      for (let bucket = 0; bucket < BUCKET_COUNT; bucket++) {
        const length = bucketLength[bucket]
        if (!length) continue
        ctx.fillStyle = DEPTH_STYLES[bucket]
        const xs = bucketX[bucket]
        const ys = bucketY[bucket]
        const sizes = bucketSize[bucket]

        ctx.beginPath()
        for (let i = 0; i < length; i++) {
          const particleRadius = sizes[i] * 0.5
          ctx.moveTo(xs[i] + particleRadius, ys[i])
          ctx.arc(xs[i], ys[i], particleRadius, 0, TAU)
        }
        ctx.fill()
      }
    }

    function loop(now: number) {
      if (!running) return
      if (coarse && last && now - last < 1000 / 30) {
        frame = requestAnimationFrame(loop)
        return
      }
      const dt = last ? Math.min(48, now - last) : 16.67
      last = now
      if (!bootStartedAt) bootStartedAt = now
      boot = reducedMotion ? 1 : Math.min(1, (now - bootStartedAt) / 1500)
      elapsed += dt / 1000

      // A slower camera chase absorbs trackpad/touch-wheel spikes into a composed move.
      const chase = 1 - Math.pow(0.94, dt / 16.67)
      renderedProgress += (targetProgress - renderedProgress) * chase
      if (Math.abs(targetProgress - renderedProgress) < 0.00005) renderedProgress = targetProgress
      autoYaw += dt * AUTO_YAW_RATE

      const pointerChase = 1 - Math.pow(0.9, dt / 16.67)
      if (pointerInside) {
        if (pointerX < -1000) {
          pointerX = targetPointerX
          pointerY = targetPointerY
        } else {
          pointerX += (targetPointerX - pointerX) * pointerChase
          pointerY += (targetPointerY - pointerY) * pointerChase
        }
      }
      pointerInfluence += ((pointerInside ? 1 : 0) - pointerInfluence) * pointerChase

      draw()
      frame = requestAnimationFrame(loop)
    }

    function start() {
      if (reducedMotion || running) return
      running = true
      last = 0
      frame = requestAnimationFrame(loop)
    }

    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(frame)
    }

    function updatePointer(event: PointerEvent) {
      const rect = container.getBoundingClientRect()
      pointerInside = event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom
      if (!pointerInside) return
      targetPointerX = event.clientX - rect.left
      targetPointerY = event.clientY - rect.top
    }

    function onPointerMove(event: PointerEvent) {
      updatePointer(event)
    }

    function onPointerLeave() {
      pointerInside = false
    }

    function onWindowBlur() {
      pointerInside = false
    }

    const unsubscribeProgress = reducedMotion
      ? () => undefined
      : progress.on('change', (value) => {
          targetProgress = clamp01(value)
        })

    const observer = new ResizeObserver(queueFit)
    observer.observe(container)
    fit()

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start()
          else stop()
        }
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(container)

    if (!reducedMotion && !coarse) {
      container.addEventListener('pointermove', onPointerMove, { passive: true })
      container.addEventListener('pointerleave', onPointerLeave)
      window.addEventListener('blur', onWindowBlur)
    }

    if (reducedMotion) {
      renderedProgress = 0.56
      targetProgress = 0.56
      draw()
    }

    return () => {
      stop()
      cancelAnimationFrame(resizeFrame)
      observer.disconnect()
      visibilityObserver.disconnect()
      unsubscribeProgress()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [progress])

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', overflow: 'hidden', touchAction: 'pan-y' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
