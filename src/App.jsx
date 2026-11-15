import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Magnetic from './components/Magnetic'
import PageWipe from './components/PageWipe'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'

// Page title + description per route (helps SEO and browser tabs)
const META = {
  '/': [
    'Anay Shivhare | Full Stack Developer',
    'Portfolio of Anay Shivhare, a full stack MERN developer building responsive web apps, Web3 and AI-powered products. Available for freelance work.',
  ],
  '/projects': [
    'Projects | Anay Shivhare',
    'Selected projects by Anay Shivhare: a blockchain crop insurance DApp, a campus marketplace, a wellness PWA and more.',
  ],
  '/skills': [
    'Skills | Anay Shivhare',
    'React, Node.js, MongoDB, Solidity, Three.js and more: the tools Anay Shivhare uses to build full stack products.',
  ],
  '/contact': [
    'Contact | Anay Shivhare',
    'Get in touch with Anay Shivhare for freelance projects, collaborations or remote opportunities.',
  ],
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const [title, description] = META[location.pathname] ?? META['/']
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [location.pathname])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <Magnetic />
      <PageWipe />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
