import { motion } from 'framer-motion'
import { scrollReveal } from '../../lib/motion'

export default function ScrollSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={scrollReveal}
      className={className}
    >
      {children}
    </motion.section>
  )
}
