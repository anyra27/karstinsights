import WireframeCube from './WireframeCube'

/**
 * CubeField — single hero-scale WireframeCube. The actual Karst Frame-app
 * background cube (canvas-rendered, 3×3 subdivided, depth-based alpha,
 * warm-charcoal #625e5a).
 *
 * sizeFactor is set so the cube's rotated vertices (max distance √3 × size
 * from center) fit comfortably within the canvas at any rotation angle.
 * Container is responsive: scales with the smaller viewport dimension and
 * never exceeds 900px.
 */
export default function CubeField({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 'min(82vmin, 900px)',
          height: 'min(82vmin, 900px)',
        }}
      >
        <WireframeCube
          sizeFactor={0.28}
          intensity={2.5}
          speed={0.22}
        />
      </div>
    </div>
  )
}
