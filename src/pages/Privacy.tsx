import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { usePageMeta } from '../lib/usePageMeta'

/* Privacy policy for the Karst Insights firm/marketing site.
   Every sentence here is a legal representation. Keep it aligned with the
   actual code and deployed vendor configuration. */

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

export default function Privacy() {
  usePageMeta(
    'Privacy Policy',
    'What the Karst site collects, what it does not, and how to reach us about your information.',
  )

  return (
    <PageShell>
      <div className="min-h-screen bg-surface px-8 md:px-16 pt-36 pb-24">
        <div className="max-w-2xl mx-auto">
          <p className="font-label text-[10px] tracking-[0.32em] uppercase text-on-surface-variant/70 mb-4">
            Karst
          </p>
          <h1 className="font-headline font-bold tracking-tight text-3xl md:text-4xl text-on-surface mb-3">
            Privacy Policy
          </h1>
          <p className="font-body text-sm text-on-surface-variant/70 mb-12">
            Effective July 15, 2026 · Applies to karstinsights.com and its public pages. Other
            Anyra/Karst domains have separate notices.
          </p>

          <Section title="Who we are">
            <p>
              This site is operated by Karst (Anyra Inc.). Questions, corrections, and
              requests go to{' '}
              <a href="mailto:kevin@anyra.ai" className="text-primary hover:text-primary-dim">
                kevin@anyra.ai
              </a>
              .
            </p>
          </Section>

          <Section title="What we collect">
            <p>
              The <Link to="/contact" className="text-primary hover:text-primary-dim">contact page</Link>{' '}
              provides a link to email Kevin directly. If you choose to send a message, your
              email provider handles that correspondence; this site does not collect it through
              a form or site database.
            </p>
            <p>
              There are no accounts and no sign-in on this site. Browsing it does not ask you
              for anything.
            </p>
          </Section>

          <Section title="What we do not do">
            <p>We do not sell or share personal information. We never have.</p>
            <p>
              We do not use advertising or cross-site tracking. If Cloudflare Web Analytics is
              enabled for this site, it receives privacy-focused page-performance measurements
              such as load timing; it does not use cookies or track you across websites.
            </p>
            <p>We do not build profiles of visitors.</p>
          </Section>

          <Section title="Cookies and browser storage">
            <p>
              This site does not intentionally set first-party cookies. Third-party providers
              such as Google and Cloudflare may use their own technical storage or processing
              under their own privacy practices.
            </p>
            <p>
              Some browsers send a Do Not Track or Global Privacy Control signal. We do not
              track visitors in the first place, so this site behaves the same way whether or
              not those signals are present.
            </p>
          </Section>

          <Section title="Services this site relies on">
            <p>Serving any website involves a few providers. Ours are:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-on-surface">Cloudflare</strong> hosts and serves the
                site, and processes visitor IP addresses to do so, as every host does.
              </li>
              <li>
                <strong className="text-on-surface">Your email provider</strong> handles any
                correspondence you choose to send through the contact link.
              </li>
              <li>
                <strong className="text-on-surface">Google Fonts</strong> serves the site's
                typefaces, which means your browser requests font files from Google and Google
                sees your IP address in that request.
              </li>
              <li>
                <strong className="text-on-surface">jsDelivr</strong>, a public CDN, serves the
                charting library on our demonstration dashboard pages.
              </li>
            </ul>
            <p>
              The site itself does not receive or store the contents of your email.
            </p>
          </Section>

          <Section title="Retention and your choices">
            <p>
              Email correspondence is handled through email systems and retained according to
              our operational needs. If you want to ask about correspondence associated with
              you, email{' '}
              <a href="mailto:kevin@anyra.ai" className="text-primary hover:text-primary-dim">
                kevin@anyra.ai
              </a>.
            </p>
          </Section>

          <Section title="California residents">
            <p>
              California law (CalOPPA) requires this policy to be posted conspicuously, and we
              have written it to match our actual practices. We do not sell or share personal
              information as described above. If the California Consumer Privacy Act applies
              to Anyra Inc. based on the business's circumstances, California residents may
              have additional rights; requests can be made through the contact method above.
              The access and deletion process above is available to you regardless of where you
              live.
            </p>
          </Section>

          <Section title="Students and children">
            <p>
              This site is written for the adults who run school districts. Our student cohort
              page describes a program for high school students, but participation runs through
              the student's district, not through this website. This site is not directed to
              children under 13 and we do not knowingly collect information from them. If a
              student under 18 emails us, a parent, guardian, or district administrator can
              contact us at the address above.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              If our practices change, this page changes first, with a new effective date.
              A material change to how we handle information already collected would be
              communicated to the people it affects before taking effect.
            </p>
          </Section>

          <p className="font-label text-[9px] tracking-[0.18em] uppercase text-on-surface-variant/40 mt-16 leading-relaxed">
            <Link to="/accessibility" className="hover:text-primary transition-colors">
              Accessibility
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  )
}
