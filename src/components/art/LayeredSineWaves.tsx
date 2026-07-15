import { useRef, useEffect } from 'react'

interface LayeredSineWavesProps {
  className?: string
}

const LAYERS = 80
const POINTS = 200
const WAVE_AMPLITUDE = 40
const BG = '#F0EEE6'
const LINE_COLOR = '50, 50, 50'


export default function LayeredSineWaves({ className }: LayeredSineWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let running = true

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = rect.width
      const h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w, h }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    // Seed random vertical lines once
    const verticalLines: { x: number; draw: boolean }[] = []
    for (let i = 0; i < 100; i++) {
      verticalLines.push({ x: i / 100, draw: Math.random() < 0.4 })
    }

    const draw = () => {
      const { w, h } = sizeRef.current
      if (w === 0 || h === 0) {
        if (running) animRef.current = requestAnimationFrame(draw)
        return
      }

      timeRef.current += 0.0085
      const t = timeRef.current

      ctx.fillStyle = BG
      ctx.fillRect(0, 0, w, h)

      // Draw wave layers — passive, no mouse influence
      for (let layer = 0; layer < LAYERS; layer++) {
        const layerPosition = (layer / LAYERS) * h * 0.8 + h * 0.1
        const layerFrequency = 0.5 + layer * 0.03
        const layerPhase = t * 0.13 + layer * 0.05
        const layerAmplitude = WAVE_AMPLITUDE *
          (0.65 + 0.35 * Math.sin(layer * 0.1 + t * 0.16))

        const baseOpacity = 0.2 + 0.6 * Math.pow(Math.sin((layer / LAYERS) * Math.PI), 2)
        const timeEffect = 0.12 * Math.sin(t * 0.18 + layer * 0.1)
        const opacity = Math.min(0.9, Math.max(0.1, baseOpacity + timeEffect))

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity})`
        ctx.lineWidth = 0.6

        for (let i = 0; i <= POINTS; i++) {
          const x = (i / POINTS) * w

          let y = layerPosition
          const xFreq = x * 0.01 * (550 / w)
          y += layerAmplitude * Math.sin(xFreq * layerFrequency + layerPhase)
          y += layerAmplitude * 0.22 * Math.sin(xFreq * 2 * layerFrequency + layerPhase * 1.5)
          y += layerAmplitude * 0.08 * Math.sin(xFreq * 4 * layerFrequency - layerPhase * 0.7)

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // Draw connecting vertical lines
      const spacing = w / verticalLines.length
      for (let i = 0; i < verticalLines.length; i++) {
        if (!verticalLines[i].draw) continue

        const x = i * spacing
        const vlOpacity = 0.1 + 0.2 * Math.sin(x * 0.05 * (550 / w) + t)

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${LINE_COLOR}, ${Math.max(0, vlOpacity)})`
        ctx.lineWidth = 0.3

        const startY = h * 0.1 + verticalLines[i].x * h * 0.2
        const endY = h * 0.7 + (1 - verticalLines[i].x) * h * 0.2

        ctx.moveTo(x, startY)
        ctx.lineTo(x, endY)
        ctx.stroke()
      }

      // Reduced motion: one settled frame, no loop.
      if (!reduce && running) animRef.current = requestAnimationFrame(draw)
    }

    // Park the loop while the hero is scrolled out of view.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const wasRunning = running
        running = e.isIntersecting
        if (reduce) continue
        if (running && !wasRunning) {
          cancelAnimationFrame(animRef.current)
          animRef.current = requestAnimationFrame(draw)
        } else if (!running) {
          cancelAnimationFrame(animRef.current)
        }
      }
    })
    io.observe(container)

    ctx.fillStyle = BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
