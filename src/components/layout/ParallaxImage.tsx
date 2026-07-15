import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxImage({
  src,
  className,
  objectPosition,
}: {
  src: string
  className?: string
  /** CSS object-position — e.g. 'right bottom' to keep a subject in frame */
  objectPosition?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3])

  return (
    <div ref={ref} className={`relative md:aspect-auto overflow-hidden ${className ?? ''}`}>
      <motion.img
        src={src}
        alt=""
        style={{ y, opacity, objectPosition }}
        className="absolute inset-0 w-full h-[125%] object-cover"
        loading="lazy"
      />
    </div>
  )
}
