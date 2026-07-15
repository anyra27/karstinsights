/**
 * LivingPhoto — a Karst nature photo that breathes.
 *
 * Per the design canon: the photo lives (a slow scale drift) but nothing
 * sits over it that moves — copy lives beside it in the split, so no scrim.
 * Subject is anchored via objectPosition so the crop never decapitates it.
 * Reduced motion: the photo holds still.
 *
 * Pass an aspect class (e.g. "aspect-[4/3]") via className for the frame.
 */
export default function LivingPhoto({
  src,
  alt,
  objectPosition = 'center',
  className = '',
}: {
  src: string
  alt: string
  objectPosition?: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-[3px] ghost-border ${className}`}>
      <style>{`
        @keyframes lpDrift { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .lp-img { animation: lpDrift 34s ease-in-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .lp-img { animation: none; } }
      `}</style>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="lp-img block w-full h-full object-cover"
        style={{ objectPosition }}
      />
      {/* barely-there inner edge — keeps the photo seated in the cream */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[3px]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(30,42,74,0.06)' }}
      />
    </div>
  )
}
