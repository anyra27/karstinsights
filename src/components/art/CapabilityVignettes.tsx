import type { ReactNode } from 'react'

const IVORY = 'rgba(255,252,247,0.82)'
const IVORY_SOFT = 'rgba(255,252,247,0.38)'
const IVORY_FAINT = 'rgba(255,252,247,0.16)'
const BRASS = '#c49a43'
const BRASS_SOFT = 'rgba(196,154,67,0.48)'

const PARTICLE_STYLES = `
  @keyframes cvParticleBreathe {
    0%, 100% { opacity: 0.34; }
    45%, 70% { opacity: 1; }
  }
  @keyframes cvParticleRoute {
    0%, 10% { stroke-dashoffset: 120; opacity: 0.2; }
    38%, 88% { stroke-dashoffset: 0; opacity: 0.7; }
    100% { stroke-dashoffset: -120; opacity: 0.2; }
  }
  @keyframes cvParticleResolve {
    0%, 24% { opacity: 0.2; transform: scale(0.7); }
    42%, 88% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.2; transform: scale(0.7); }
  }
  .cv-particle { animation: cvParticleBreathe 8s ease-in-out infinite; }
  .cv-particle-route {
    stroke-dasharray: 120;
    animation: cvParticleRoute 8s ease-in-out infinite;
  }
  .cv-particle-resolve {
    transform-box: fill-box;
    transform-origin: center;
    animation: cvParticleResolve 8s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .cv-particle, .cv-particle-route, .cv-particle-resolve { animation: none !important; opacity: 1; }
  }
`

function VignetteFrame({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={className}>
      <style>{PARTICLE_STYLES}</style>
      <svg viewBox="0 0 280 100" className="h-auto w-full" aria-hidden="true">
        {children}
      </svg>
    </div>
  )
}

export function DashboardVignette({ className = '' }: { className?: string }) {
  const rows = [0, 1, 2, 3]
  const cols = [0, 1, 2, 3, 4]
  const bars = [4, 7, 3, 8, 6]

  return (
    <VignetteFrame className={className}>
      {rows.flatMap((row) => cols.map((col) => (
        <circle
          key={`${row}-${col}`}
          className="cv-particle"
          cx={27 + col * 13}
          cy={31 + row * 13}
          r="1.55"
          fill={IVORY_SOFT}
          style={{ animationDelay: `${(row * cols.length + col) * 0.05}s` }}
        />
      )))}
      <path className="cv-particle-route" d="M96 50h28" stroke={BRASS_SOFT} strokeWidth="1" />
      {bars.flatMap((count, column) => Array.from({ length: count }, (_, row) => (
        <circle
          key={`${column}-${row}`}
          className="cv-particle"
          cx={150 + column * 19}
          cy={78 - row * 8}
          r={row === count - 1 ? 2 : 1.55}
          fill={row === count - 1 && column === 3 ? BRASS : IVORY}
          style={{ animationDelay: `${0.5 + column * 0.12 + row * 0.04}s` }}
        />
      )))}
      <path d="M150 53l19-20 19 33 19-45 19 16" fill="none" stroke={IVORY_FAINT} strokeWidth="1" />
    </VignetteFrame>
  )
}

export function SpeakVignette({ className = '' }: { className?: string }) {
  const source = [0, 1, 2, 3].flatMap((row) => [0, 1, 2].map((col) => [42 + col * 9, 37 + row * 9]))
  const destinations = [24, 50, 76]

  return (
    <VignetteFrame className={className}>
      {source.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}`} className="cv-particle" cx={cx} cy={cy} r="1.6" fill={index === 5 ? BRASS : IVORY_SOFT} style={{ animationDelay: `${index * 0.07}s` }} />
      ))}
      <path className="cv-particle-route" d="M75 50C118 50 126 24 174 24" fill="none" stroke={IVORY_SOFT} />
      <path className="cv-particle-route" d="M75 50h99" fill="none" stroke={BRASS_SOFT} style={{ animationDelay: '0.2s' }} />
      <path className="cv-particle-route" d="M75 50c43 0 51 26 99 26" fill="none" stroke={IVORY_SOFT} style={{ animationDelay: '0.4s' }} />
      {destinations.flatMap((cy, group) => [0, 1, 2, 3, 4].map((col) => (
        <circle
          key={`${group}-${col}`}
          className="cv-particle"
          cx={188 + col * 11}
          cy={cy}
          r={col === 4 ? 2 : 1.45}
          fill={group === 1 && col === 4 ? BRASS : IVORY}
          style={{ animationDelay: `${0.7 + group * 0.18 + col * 0.05}s` }}
        />
      )))}
    </VignetteFrame>
  )
}

export function ConcertVignette({ className = '' }: { className?: string }) {
  const streams = [
    { y: 24, path: 'M55 24C103 24 120 45 168 49' },
    { y: 50, path: 'M55 50h113' },
    { y: 76, path: 'M55 76c48 0 65-21 113-25' },
  ]

  return (
    <VignetteFrame className={className}>
      {streams.map((stream, index) => (
        <g key={stream.y}>
          {[0, 1, 2].map((col) => (
            <circle key={col} className="cv-particle" cx={35 + col * 10} cy={stream.y} r={col === 2 ? 2 : 1.35} fill={index === 1 && col === 2 ? BRASS : IVORY} style={{ animationDelay: `${index * 0.22 + col * 0.06}s` }} />
          ))}
          <path className="cv-particle-route" d={stream.path} fill="none" stroke={index === 1 ? BRASS_SOFT : IVORY_SOFT} style={{ animationDelay: `${index * 0.22}s` }} />
        </g>
      ))}
      {[0, 1, 2, 3].map((index) => (
        <circle key={index} className="cv-particle" cx={177 + index * 11} cy="50" r="1.45" fill={IVORY_SOFT} style={{ animationDelay: `${0.8 + index * 0.08}s` }} />
      ))}
      <circle cx="232" cy="50" r="13" fill="none" stroke={BRASS_SOFT} />
      <circle className="cv-particle-resolve" cx="232" cy="50" r="4.5" fill={BRASS} />
    </VignetteFrame>
  )
}

export function ToolVignette({ className = '' }: { className?: string }) {
  const frameDots = [
    ...Array.from({ length: 9 }, (_, index) => [58 + index * 19, 22]),
    ...Array.from({ length: 9 }, (_, index) => [58 + index * 19, 78]),
    ...Array.from({ length: 4 }, (_, index) => [58, 33 + index * 11]),
    ...Array.from({ length: 4 }, (_, index) => [210, 33 + index * 11]),
  ]
  const modules = [
    [87, 44], [98, 44], [87, 55], [98, 55],
    [145, 38], [156, 38], [167, 38], [145, 49], [156, 49], [167, 49], [145, 60], [156, 60], [167, 60],
  ]

  return (
    <VignetteFrame className={className}>
      {frameDots.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}-${index}`} className="cv-particle" cx={cx} cy={cy} r="1.3" fill={IVORY_FAINT} style={{ animationDelay: `${index * 0.025}s` }} />
      ))}
      {modules.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}`} className="cv-particle" cx={cx} cy={cy} r={index === 3 ? 2.2 : 1.55} fill={index === 3 ? BRASS : IVORY} style={{ animationDelay: `${0.45 + index * 0.05}s` }} />
      ))}
      <path className="cv-particle-route" d="M112 50h20" stroke={BRASS_SOFT} />
      <circle className="cv-particle-resolve" cx="190" cy="49" r="4" fill={BRASS} />
    </VignetteFrame>
  )
}
