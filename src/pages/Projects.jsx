import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import TiltCard from '../components/TiltCard'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <PageTransition>
      <span className="eyebrow">Selected work</span>
      <h1 className="page-title">Projects</h1>
      <p className="page-sub">
        Full stack apps, blockchain and AI experiments, and a hackathon build. Things I've
        designed, built and shipped.
      </p>

      <div className="project-grid">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            className={`project-slot ${p.featured ? 'featured' : ''}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: 'easeOut' }}
          >
            <TiltCard className="project-card glass">
              <div className="project-top">
                <span className="project-index">0{i + 1}</span>
                <span className="project-type">{p.type}</span>
                {p.featured && <span className="badge">Featured</span>}
              </div>

              <h2>{p.title}</h2>
              <p>{p.description}</p>

              {p.stack.length > 0 && (
                <ul className="chips" aria-label={`${p.title} tech stack`}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}

              {(p.live || p.github) && (
                <div className="project-links">
                  {p.live && (
                    <a
                      className="btn btn-primary btn-sm"
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} live demo (opens in a new tab)`}
                    >
                      Live demo
                    </a>
                  )}
                  {p.github && (
                    <a
                      className="btn btn-ghost btn-sm"
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} on GitHub (opens in a new tab)`}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </TiltCard>
          </motion.article>
        ))}
      </div>
    </PageTransition>
  )
}
