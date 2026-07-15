import { useRef, useEffect } from 'react'

interface WireframeCubeProps {
  className?: string
  /** Cube size as fraction of min(width, height) of container. 0.4 default. */
  sizeFactor?: number
  /** Multiplier on edge/dot alpha. 1.0 = base, >1 = darker. Default 1.0. */
  intensity?: number
  /** Hex/rgb color for edges + dots. Defaults to Karst grayscale `#625e5a`. */
  color?: string
  /** Rotation speed multiplier. 1.0 = original ModelTiers speed (fast).
   *  0.3 = meditative, 0.15 = barely moving. Default 0.3. */
  speed?: number
}

/**
 * Standalone wireframe cube — extracted from the ModelTiers art piece
 * (`drawLargeModel`) so it can be used as ambient page art without the
 * Small/Frontier siblings, labels, or active-tier glow ring.
 *
 * Auto-sizes to its container via ResizeObserver, runs at devicePixelRatio
 * for crisp rendering, never decodes its background (transparent canvas
 * fillRect ensures it composites over whatever's behind). Always animates
 * — slow, subtle rotation. ~60fps.
 */
export default function WireframeCube({
  className,
  sizeFactor = 0.4,
  intensity = 1.0,
  color = '98,94,90',
  speed = 0.3,
}: WireframeCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

    const draw = () => {
      const { w, h } = sizeRef.current
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(draw)
        return
      }

      timeRef.current += speed
      const t = timeRef.current * 0.01
      const cx = w / 2
      const cy = h / 2
      const size = Math.min(w, h) * sizeFactor
      const rotY = t * 0.25
      const rotX = t * 0.18
      const divisions = 3

      // Clear (transparent)
      ctx.clearRect(0, 0, w, h)

      // Generate surface vertices of a 3x3x3 subdivided cube
      const verts: [number, number, number][] = []
      for (let xi = 0; xi <= divisions; xi++) {
        for (let yi = 0; yi <= divisions; yi++) {
          for (let zi = 0; zi <= divisions; zi++) {
            if (
              xi === 0 ||
              xi === divisions ||
              yi === 0 ||
              yi === divisions ||
              zi === 0 ||
              zi === divisions
            ) {
              const x = (xi / divisions - 0.5) * 2
              const y = (yi / divisions - 0.5) * 2
              const z = (zi / divisions - 0.5) * 2
              verts.push([x, y, z])
            }
          }
        }
      }

      // Project (rotate Y then X)
      const projected = verts.map(([vx, vy, vz]) => {
        const c1 = Math.cos(rotY), s1 = Math.sin(rotY)
        const x1 = vx * c1 + vz * s1
        const z1 = -vx * s1 + vz * c1
        const c2 = Math.cos(rotX), s2 = Math.sin(rotX)
        const y2 = vy * c2 - z1 * s2
        const z2 = vy * s2 + z1 * c2
        return [cx + x1 * size, cy + y2 * size, z2] as [number, number, number]
      })

      // Edges: connect pairs that share 2 coords and differ by 1 grid step on the 3rd
      const threshold = 2 / divisions + 0.01
      ctx.lineWidth = 0.8
      for (let i = 0; i < verts.length; i++) {
        for (let j = i + 1; j < verts.length; j++) {
          const dx = Math.abs(verts[i][0] - verts[j][0])
          const dy = Math.abs(verts[i][1] - verts[j][1])
          const dz = Math.abs(verts[i][2] - verts[j][2])
          const diffs = [dx, dy, dz].sort()
          if (
            diffs[0] < 0.01 &&
            diffs[1] < 0.01 &&
            diffs[2] > 0.01 &&
            diffs[2] < threshold
          ) {
            // Depth-based alpha (0.12..0.42 base, scaled by intensity)
            const avgZ = (projected[i][2] + projected[j][2]) / 2
            const depthAlpha = (0.12 + (avgZ + 1) * 0.15) * intensity
            ctx.strokeStyle = `rgba(${color},${Math.min(depthAlpha, 1)})`
            ctx.beginPath()
            ctx.moveTo(projected[i][0], projected[i][1])
            ctx.lineTo(projected[j][0], projected[j][1])
            ctx.stroke()
          }
        }
      }

      // Vertex dots
      for (const [px, py, pz] of projected) {
        const depthAlpha = (0.2 + (pz + 1) * 0.25) * intensity
        ctx.beginPath()
        ctx.arc(px, py, Math.max(1.5, size * 0.012), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${Math.min(depthAlpha, 1)})`
        ctx.fill()
      }

      // prefers-reduced-motion: hold on this frame instead of looping
      if (!reducedMotion) animRef.current = requestAnimationFrame(draw)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) timeRef.current = 40 // a pleasant static angle
    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [sizeFactor, intensity, color, speed])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
