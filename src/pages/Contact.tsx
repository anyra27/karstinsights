import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import { usePageMeta } from '../lib/usePageMeta'
import pearlBg from '../assets/pearl-bg.webp'

export default function Contact() {
  usePageMeta(
    'Contact',
    'Request an introduction. Karst partners with school districts by introduction and referral.',
  )

  return (
    <PageShell activeNav="contact">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 md:py-40">
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${pearlBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 z-[1] bg-surface/85" />

        <motion.div
          className="relative z-10 max-w-6xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="max-w-4xl">
              <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
                By Introduction and Referral
              </p>
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl text-on-surface leading-[1.05] mb-7">
                Tell me what your district is trying to make possible.
              </h1>
              <p className="max-w-2xl font-body text-lg md:text-xl text-on-surface-variant leading-relaxed">
                You do not need a polished brief. A few lines about the work, the people involved,
                and what feels stuck are enough to begin.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-14 bg-primary p-7 md:p-10 lg:p-12 text-on-primary"
            >
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="font-label text-[10px] tracking-[0.3em] uppercase text-on-primary/55 mb-4">
                    Write Kevin directly
                  </p>
                  <a
                    href="mailto:kevin@anyra.ai?subject=Karst%20district%20conversation"
                    className="font-headline text-2xl md:text-4xl text-on-primary underline decoration-on-primary/25 underline-offset-8 transition-colors hover:text-on-primary/75"
                  >
                    kevin@anyra.ai
                  </a>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="mailto:kevin@anyra.ai?subject=Karst%20district%20conversation"
                  className="flex min-w-52 items-center justify-center gap-3 rounded-[3px] bg-on-primary px-7 py-4 font-headline text-xs uppercase tracking-widest text-primary transition-colors hover:bg-on-primary/85"
                >
                  Write an email
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kevin%40anyra.ai&su=Karst%20district%20conversation"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-52 items-center justify-center rounded-[3px] border border-on-primary/25 px-7 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-primary transition-colors hover:bg-on-primary/10"
                  >
                    Open in Gmail
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 flex flex-col gap-3 border-t border-outline-variant/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-sm text-on-surface-variant/70">
                A Workshop opens the work. Fieldwork builds the capability.
              </p>
              <p className="font-body text-xs text-on-surface-variant/55">
                Read our{' '}
                <Link to="/privacy" className="underline hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </PageShell>
  )
}
