import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// The 3D scene is a separate chunk so the text and buttons appear instantly
const HeroScene = lazy(() => import('../components/HeroScene'))

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

// The 3D scene is heavy, so it starts on the first sign of a real visitor
// (mouse move, touch, scroll, key press) or after 6 seconds, whichever is first.
// Until then the static CSS balls are shown. People who prefer reduced motion
// keep the static balls for good.
const WAKE_EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown']

function useDeferred3D() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let idle
    const cleanup = () => {
      clearTimeout(timer)
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake))
    }
    const wake = () => {
      cleanup()
      // Let the interaction frame finish before the heavy work starts
      if ('requestIdleCallback' in window) idle = requestIdleCallback(() => setOn(true), { timeout: 400 })
      else setOn(true)
    }
    const timer = setTimeout(wake, 6000)
    WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }))

    return () => {
      cleanup()
      if (idle && 'cancelIdleCallback' in window) cancelIdleCallback(idle)
    }
  }, [])
  return on
}

export default function Home() {
  const show3D = useDeferred3D()
  const [ready, setReady] = useState(false)

  return (
    <PageTransition>
      <section className="hero">
        <div>
          <span className="eyebrow">Hello, I'm Anay</span>
          {/* Heading and intro are not animated so they paint immediately */}
          <h1>
            I build <em>full stack</em> web experiences.
          </h1>
          <p>
            B.Tech Computer Science &amp; Design student and MERN developer, with a growing
            focus on Web3 and AI-integrated apps. Open to freelance work and remote
            opportunities.
          </p>

          <motion.div className="hero-actions" {...fadeUp(0.1)}>
            <Link to="/projects" className="btn btn-primary">
              View projects
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </motion.div>

          <motion.ul className="hero-stats glass" {...fadeUp(0.2)}>
            <li>
              <strong>10+</strong>
              <span>Projects built</span>
            </li>
            <li>
              <strong>5+</strong>
              <span>Hackathons</span>
            </li>
            <li>
              <strong>15+</strong>
              <span>Technologies</span>
            </li>
          </motion.ul>
        </div>

        <motion.div className="hero-visual" {...fadeUp(0.15)}>
          {/* Static CSS balls: shown first, and kept for reduced-motion / no-WebGL */}
          <div className={`orbs ${ready ? 'hide' : ''}`} aria-hidden="true">
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
            <span className="orb orb-4" />
            <span className="orb orb-5" />
            <span className="orb orb-6" />
          </div>

          <div className={`scene-layer ${ready ? 'ready' : ''}`} aria-hidden="true">
            {show3D && (
              <Suspense fallback={null}>
                <HeroScene onReady={() => setReady(true)} />
              </Suspense>
            )}
          </div>

          <div className="photo-wrap">
            <span>
              Your photo
              <br />
              goes here
            </span>
          </div>

          <div className="chip glass">
            <i aria-hidden="true" />
            Open to freelance work
          </div>
        </motion.div>
      </section>
    </PageTransition>
  )
}
