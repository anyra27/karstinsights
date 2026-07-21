import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

type ActiveNav = 'home' | 'studios' | 'about' | 'frame' | 'briefings' | 'contact'

/** Frame icon — corner brackets enclosing a content block: a dashboard
 *  framed into a published page, which is what Frame does. Inline SVG so
 *  the homepage doesn't depend on the (now-deferred) Material Symbols font. */
function FrameIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* corner brackets — the frame */}
      <path d="M4 9 V5 a1 1 0 0 1 1 -1 H9" />
      <path d="M15 4 H19 a1 1 0 0 1 1 1 V9" />
      <path d="M20 15 V19 a1 1 0 0 1 -1 1 H15" />
      <path d="M9 20 H5 a1 1 0 0 1 -1 -1 V15" />
      {/* framed content */}
      <path d="M8.5 11 H15.5" />
      <path d="M8.5 14 H13" />
    </svg>
  )
}

/** Hamburger / close icons — inline SVG, no font dependency. */
function HamburgerIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" />
    </svg>
  )
}

export default function Navbar({ activeNav }: { activeNav?: ActiveNav }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkOverHero, setDarkOverHero] = useState(false)
  const location = useLocation()
  const isHomeHeroPage = activeNav === 'home' && location.pathname === '/'
  const navDark = isHomeHeroPage && darkOverHero

  useEffect(() => {
    if (!isHomeHeroPage) return

    const darkSections = Array.from(document.querySelectorAll<HTMLElement>('[data-karst-nav-dark]'))
    if (darkSections.length === 0) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setDarkOverHero(
          darkSections.some((section) => {
            const rect = section.getBoundingClientRect()
            return rect.bottom > 64 && rect.top < 64
          }),
        )
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isHomeHeroPage])

  const isActive = (nav: ActiveNav) =>
    activeNav === nav ||
    (nav === 'studios' && location.pathname === '/studios') ||
    (nav === 'about' && location.pathname === '/about') ||
    (nav === 'frame' && location.pathname === '/frame') ||
    (nav === 'briefings' && location.pathname === '/briefings') ||
    (nav === 'contact' && location.pathname === '/contact')

  const linkClass = (active: boolean) =>
    `text-sm font-body px-4 py-2 transition-colors duration-500 ${
      navDark
        ? active
          ? 'text-[#f0eee6] font-medium'
          : 'text-[#f0eee6]/62 hover:text-[#f0eee6]'
        : active
          ? 'text-primary font-medium'
          : 'text-on-surface-variant hover:text-primary'
    }`

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
          navDark
            ? 'border-[#f0eee6]/10 bg-[#0e0e0c]/78'
            : 'glass-nav border-outline-variant/10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            to="/"
            className={`font-label text-[12px] uppercase transition-colors duration-500 ${
              navDark ? 'text-[#f0eee6]' : 'text-on-surface'
            }`}
            style={{ fontWeight: 500, letterSpacing: '0.42em' }}
          >
            Karst
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-1 items-center">
            <Link to="/studios" className={linkClass(isActive('studios'))}>
              Studios
            </Link>
            <a href="/cohort/" className={linkClass(false)}>
              Fieldwork
            </a>
            {/* Students cohort unlinked from nav until it's field-proven; page stays live by URL */}
            <Link to="/about" className={linkClass(isActive('about'))}>
              About
            </Link>
            <Link
              to="/frame"
              className={`${linkClass(isActive('frame'))} flex items-center gap-1.5`}
            >
              <FrameIcon className="opacity-80" />
              Frame
            </Link>
            <Link to="/briefings" className={linkClass(isActive('briefings'))}>
              Briefings
            </Link>
            <Link to="/contact" className={linkClass(isActive('contact'))}>
              Contact
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`p-2 transition-colors duration-500 md:hidden ${
              navDark ? 'text-[#f0eee6]/72 hover:text-[#f0eee6]' : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-sm md:hidden"
          >
            <div className="pt-24 px-8 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                Home
              </Link>
              <Link
                to="/studios"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                Studios
              </Link>
              <a
                href="/cohort/"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                Fieldwork
              </a>
              {/* Students cohort unlinked from nav until it's field-proven; page stays live by URL */}
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                About
              </Link>
              <Link
                to="/frame"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10 flex items-center gap-2"
              >
                <FrameIcon className="opacity-80" />
                Frame
              </Link>
              <Link
                to="/briefings"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                Briefings
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg text-on-surface py-3 border-b border-outline-variant/10"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
