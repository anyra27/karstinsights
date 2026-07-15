import Navbar from './Navbar'
import Footer from './Footer'

type ActiveNav = 'home' | 'studios' | 'about' | 'frame' | 'briefings' | 'contact'

export default function PageShell({
  activeNav,
  children,
}: {
  activeNav?: ActiveNav
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface min-h-screen">
      <Navbar activeNav={activeNav} />
      {children}
      <Footer />
    </div>
  )
}
