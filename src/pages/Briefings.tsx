import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import { staggerContainerRelaxed, staggerChild, easeStandard } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

/* Briefings index. The individual briefings are rich standalone static pages
   under public/briefings/<slug>/; this React page is the branded library that
   links to them. Newest first. */

/* date drives the order — newest first, so new briefings auto-sort.
   Only the month/year is shown; the day is just a sort key. */
const BRIEFINGS = [
  {
    slug: 'sonnet-5',
    date: '2026-06-18',
    eyebrow: 'Claude Sonnet 5 · June 2026',
    title: 'For people who already build with Claude.',
    dek: 'What the everyday tier now carries, and where it fits in a district practice.',
    image: '/briefings/assets/sonnet-5.webp',
  },
  {
    slug: 'fable-5',
    date: '2026-06-09',
    eyebrow: 'Claude Fable 5 · June 2026',
    title: 'From a coding agent to a thought partner.',
    dek: 'What changed, what the people building with it are saying, and how Karst runs it in practice.',
    image: '/briefings/assets/koi.webp',
  },
  {
    slug: 'ultracode',
    date: '2026-05-28',
    eyebrow: 'Claude Ultracode · May 2026',
    title: 'When Claude runs a team of itself.',
    dek: 'Dynamic workflows and parallel sub-agents: what they do, and when the depth is worth the cost.',
    image: '/briefings/assets/fish-school.webp',
  },
  {
    slug: 'opus-4-8',
    date: '2026-05-14',
    eyebrow: 'Claude Opus 4.8 · May 2026',
    title: 'A briefing for school leaders.',
    dek: 'A plain-English read on the upgrade: what it means for your work, and what stays the same.',
    image: '/briefings/assets/emerald-crystal.webp',
  },
].sort((a, b) => (a.date < b.date ? 1 : -1))

export default function Briefings() {
  usePageMeta(
    'Briefings',
    'Karst briefings: plain, considered reads on what changes in AI and what it means for the work. Written for the people who run the organization.',
  )

  return (
    <PageShell activeNav="briefings">
      {/* ══════════ HEADER ══════════ */}
      <section className="relative pt-44 pb-16 md:pt-56 md:pb-20 px-8 md:px-16 bg-[#F0EEE6]">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-6">
            Briefings
          </p>
          <h1 className="font-headline font-bold tracking-tight text-4xl md:text-5xl text-on-surface leading-[1.05] mb-8">
            What changed, and{' '}
            <span className="font-editorial italic font-normal">what it means.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            When something material shifts in AI, Karst reads it for executive teams, plainly,
            without the noise. A considered take on the work, not the launch.
          </p>
        </div>
      </section>

      {/* ══════════ GRID ══════════ */}
      <section className="relative pb-28 md:pb-36 px-6 md:px-10 bg-surface">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainerRelaxed}
        >
          {BRIEFINGS.map((b, i) => (
            <motion.a
              key={b.slug}
              href={`/briefings/${b.slug}/`}
              variants={staggerChild}
              className="ghost-border overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={b.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0c]/45 to-transparent" />
                {i === 0 && (
                  <span className="absolute top-3 left-3 font-label text-[9px] tracking-[0.22em] uppercase text-white/95 bg-[#0e0e0c]/55 backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                    Latest
                  </span>
                )}
              </div>
              <div className="p-7 flex flex-col flex-1">
                <p className="font-label text-[10px] tracking-[0.22em] uppercase text-tertiary/65 mb-3">
                  {b.eyebrow}
                </p>
                <h2 className="font-headline text-base md:text-lg text-on-surface leading-snug mb-3">
                  {b.title}
                </h2>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-5">
                  {b.dek}
                </p>
                <span className="mt-auto font-headline text-xs uppercase tracking-widest text-primary group-hover:text-primary-dim transition-colors">
                  Read the briefing →
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          className="font-editorial italic text-base md:text-lg text-on-surface-variant/70 text-center max-w-xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: easeStandard }}
        >
          More as the landscape moves.
        </motion.p>
      </section>
    </PageShell>
  )
}
