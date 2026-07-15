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
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32">
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${pearlBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 z-[1] bg-surface/85" />

        <motion.div
          className="relative z-10 max-w-5xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
                By Introduction and Referral
              </p>
              <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight mb-5">
                Request an Introduction
              </h1>
              <p className="font-body text-base text-on-surface-variant leading-relaxed">
                Tell us about your district. We&rsquo;ll be in touch to learn more.
              </p>

              <div className="mt-10">
                <p className="font-label text-[10px] tracking-[0.26em] uppercase text-tertiary/70 mb-5">
                  What happens next
                </p>
                <ol className="space-y-4">
                  {[
                    'You send a note.',
                    'We reply to learn about your district.',
                    'Together we map what fits: a workshop, a residency, or the studios.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="font-headline text-sm text-tertiary/70 tabular-nums shrink-0 pt-0.5">
                        {`0${i + 1}`}
                      </span>
                      <span className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <figure className="mt-10 pt-8 border-t border-outline-variant/15">
                <blockquote className="font-editorial italic text-lg md:text-xl text-on-surface leading-snug mb-4">
                  I&rsquo;ve literally cut my workload in half while accomplishing double the work.
                </blockquote>
                <figcaption className="font-label text-[9px] tracking-[0.2em] uppercase text-on-surface-variant/55 leading-loose">
                  Tony Phan
                  <br />
                  Chief Communications Officer · Roseville Joint Union High School District
                </figcaption>
              </figure>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-surface-container p-8 md:p-10"
            >
              <div className="flex min-h-[360px] flex-col justify-center">
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">
                  Start the conversation
                </p>
                <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-5">
                  Email Kevin directly.
                </h2>
                <p className="font-body text-base text-on-surface-variant leading-relaxed mb-8">
                  There is no form or site database here. Send a note from your usual email and we can take it from there.
                </p>
                <a href="mailto:kevin@anyra.ai?subject=Karst%20introduction" className="w-full bg-primary text-on-primary py-4 px-10 font-headline uppercase tracking-widest text-xs rounded-[3px] hover:bg-primary-dim transition-colors flex items-center justify-center gap-3">
                  Email kevin@anyra.ai
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
                <p className="font-body text-[11px] text-on-surface-variant/60 text-center leading-relaxed mt-6">
                  Email is handled by your email provider. Read our{' '}
                  <Link to="/privacy" className="underline hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </PageShell>
  )
}
