import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// Load the 3D scene separately so the text and buttons appear instantly
const HeroScene = lazy(() => import('../components/HeroScene'))

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

export default function Home() {
  return (
    <PageTransition>
      <section className="hero">
        <div>
          <motion.span className="eyebrow" {...fadeUp(0.1)}>
            Hello, I'm Anay
          </motion.span>
          <motion.h1 {...fadeUp(0.2)}>
            I build <em>full stack</em> web experiences.
          </motion.h1>
          <motion.p {...fadeUp(0.3)}>
            B.Tech Computer Science &amp; Design student and MERN developer, with a growing
            focus on Web3 and AI-integrated apps. Open to freelance work and remote
            opportunities.
          </motion.p>
          <motion.div className="hero-actions" {...fadeUp(0.4)}>
            <Link to="/projects" className="btn btn-primary">
              View projects
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </motion.div>

          <motion.ul className="hero-stats" {...fadeUp(0.55)}>
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

        <motion.div className="hero-visual" {...fadeUp(0.3)}>
          {/* 3D scene sits behind the photo */}
          <div className="scene-layer" aria-hidden="true">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>

          <div className="photo-wrap">
            <span>
              Your photo
              <br />
              goes here
            </span>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  )
}
