import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'

const Landing = lazy(() => import('./pages/Landing'))
const Studios = lazy(() => import('./pages/Studios'))
const About = lazy(() => import('./pages/About'))
const Frame = lazy(() => import('./pages/Frame'))
const Briefings = lazy(() => import('./pages/Briefings'))
const Contact = lazy(() => import('./pages/Contact'))
const Note = lazy(() => import('./pages/Note'))
const Basin = lazy(() => import('./pages/Basin'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Accessibility = lazy(() => import('./pages/Accessibility'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/about" element={<About />} />
            <Route path="/frame" element={<Frame />} />
            <Route path="/briefings" element={<Briefings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/basin" element={<Basin />} />
            <Route path="/from-anyra" element={<Note />} />
            <Route path="/anyra" element={<Note />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
