import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export interface EngagementPath {
  label: string
  title: string
  desc: string
  image: string
  imagePosition?: string
  link: string
}

export default function EngagementPaths({ paths }: { paths: EngagementPath[] }) {
  const [activePath, setActivePath] = useState(0)
  const reduceMotion = Boolean(useReducedMotion())

  return (
    <section className="overflow-hidden bg-[#f6f4ec] py-20 md:py-28">
      <motion.div
        className="mx-auto mb-12 flex max-w-6xl items-end justify-between px-6 md:mb-16 md:px-10"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div>
          <p className="mb-5 font-label text-[10px] uppercase tracking-[0.32em] text-[#a8802a] md:text-[11px]">
            Ways In
          </p>
          <h2 className="font-headline text-3xl font-light leading-tight text-[#1a1816] md:text-5xl">
            Three ways in.
          </h2>
        </div>
        <p aria-hidden="true" className="hidden font-label text-[9px] uppercase tracking-[0.24em] text-[#1a1816]/52 md:block">
          Choose the depth
        </p>
      </motion.div>

      <motion.div
        className="mx-auto flex max-w-[1500px] flex-col overflow-hidden border-y border-black/10 bg-[#0e0e0c] md:h-[680px] md:flex-row md:border-x"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setActivePath(0)}
      >
        {paths.map((path, index) => {
          const active = activePath === index

          return (
            <motion.article
              key={path.label}
              data-active={active}
              className="engagement-path relative h-[430px] min-w-0 shrink-0 overflow-hidden border-b border-white/15 last:border-b-0 md:h-full md:shrink md:border-b-0 md:border-r md:last:border-r-0"
              onMouseEnter={() => setActivePath(index)}
              onFocusCapture={() => setActivePath(index)}
            >
              <Link
                to={path.link}
                className="group absolute inset-0 block overflow-hidden text-[#fffcf7]"
                aria-label={`${path.label}: ${path.title}`}
              >
                <motion.img
                  src={path.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: path.imagePosition }}
                  animate={{ scale: active && !reduceMotion ? 1.035 : 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.12),rgba(8,8,7,0.18)_34%,rgba(8,8,7,0.9)_100%)] transition-colors duration-700 group-hover:bg-[linear-gradient(180deg,rgba(8,8,7,0.04),rgba(8,8,7,0.12)_34%,rgba(8,8,7,0.88)_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.16] mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,0.8)_0.55px,transparent_0.55px)] [background-size:5px_5px]"
                />

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between md:left-8 md:right-8 md:top-8">
                  <span className="font-label text-[9px] tracking-[0.28em] text-white/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/20 text-sm text-white/75 backdrop-blur-md transition-all duration-500 group-hover:border-[#d9c39b]/60 group-hover:bg-[#d9c39b] group-hover:text-[#0e0e0c] group-focus-visible:border-[#d9c39b]/60 group-focus-visible:bg-[#d9c39b] group-focus-visible:text-[#0e0e0c]">
                    ↗
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
                  <p className="mb-4 font-label text-[9px] uppercase tracking-[0.3em] text-[#d9c39b] md:text-[10px]">
                    {path.label}
                  </p>
                  <h3 className="max-w-[18ch] font-headline text-2xl font-light leading-[1.16] md:text-3xl">
                    {path.title}
                  </h3>
                  <p className="mt-4 max-w-[42ch] font-body text-sm leading-relaxed text-white/65">
                    {path.desc}
                  </p>
                </div>
              </Link>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}
