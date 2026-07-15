import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-outline-variant/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span
              className="font-label text-[12px] uppercase text-on-surface"
              style={{ fontWeight: 500, letterSpacing: '0.42em' }}
            >
              Karst
            </span>
            <p className="font-editorial italic text-xs text-outline-variant mt-1">
              Karst partners with school districts by introduction and referral.
            </p>
            <Link
              to="/from-anyra"
              className="font-label text-[9px] tracking-[0.18em] uppercase text-outline-variant/70 hover:text-primary transition-colors inline-block mt-2"
            >
              Formerly Anyra →
            </Link>
          </div>
          <div className="flex gap-6 text-xs font-body text-on-surface-variant">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
          </div>
        </div>
        <p className="text-[10px] text-outline-variant mt-6 text-center md:text-left font-label">
          &copy; {new Date().getFullYear()} Anyra Inc., operating as Karst. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
