import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { usePageMeta } from '../lib/usePageMeta'

/* Accessibility statement for the Karst Insights firm/marketing site.
   Keep the known-limitations list honest and current. */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-headline font-semibold text-lg text-on-surface mb-3">{title}</h2>
      <div className="space-y-3 font-body text-[15px] text-on-surface-variant leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function Accessibility() {
  usePageMeta(
    'Accessibility',
    'Our accessibility commitment, the standard we build toward, and how to reach us about barriers.',
  )

  return (
    <PageShell>
      <div className="min-h-screen bg-surface px-8 md:px-16 pt-36 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-label text-[10px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-4">
            Karst
          </p>
          <h1 className="font-headline font-bold tracking-tight text-3xl md:text-4xl text-on-surface mb-3">
            Accessibility
          </h1>
          <p className="font-body text-sm text-on-surface-variant/70 mb-12">
            Statement updated July 15, 2026 · Applies to karstinsights.com and its public pages.
            Other Anyra/Karst domains have separate statements.
          </p>

          <Section title="Our commitment">
            <p>
              Everyone should be able to read this site, including people who rely on screen
              readers, keyboard navigation, or reduced motion. We build toward the Web Content
              Accessibility Guidelines (WCAG) 2.1, Level AA, and use that standard to guide our
              reviews. This statement does not claim that every page currently conforms.
            </p>
          </Section>

          <Section title="What we do">
            <ul className="list-disc pl-5 space-y-2">
              <li>Semantic structure, labeled form fields, and alt text on meaningful images.</li>
              <li>Keyboard operability with a visible focus indicator.</li>
              <li>Animation respects your system's reduced-motion setting.</li>
              <li>Color contrast reviewed against AA thresholds where practical.</li>
            </ul>
          </Section>

          <Section title="Known limitations">
            <p>
              Some decorative canvas scenes, including visualizations on the public cohort and
              student pages, are still being brought fully under reduced-motion and
              screen-reader support. We are also working through contrast on a few small caption
              labels. These are on our active list; email us if you need an equivalent way to
              access any content.
            </p>
          </Section>

          <Section title="Found a barrier?">
            <p>
              Tell us directly:{' '}
              <a href="mailto:kevin@anyra.ai" className="text-primary hover:text-primary-dim">
                kevin@anyra.ai
              </a>
              . Reports go to the person who builds the site. We aim to respond within five
              business days and to fix confirmed barriers promptly.
            </p>
          </Section>

          <p className="font-label text-[9px] tracking-[0.18em] uppercase text-on-surface-variant/40 mt-16 leading-relaxed">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  )
}
