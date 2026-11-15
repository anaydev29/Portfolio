import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import TiltCard from '../components/TiltCard'
import { skillGroups, softSkills } from '../data/skills'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

export default function Skills() {
  return (
    <PageTransition>
      <span className="eyebrow">What I work with</span>
      <h1 className="page-title">Skills</h1>
      <p className="page-sub">
        From responsive interfaces to smart contracts and AI-powered backends: the tools I use
        to take an idea all the way to a deployed product.
      </p>

      <div className="skills-grid">
        {skillGroups.map((group, i) => (
          <motion.article key={group.id} className="skill-slot" {...reveal((i % 3) * 0.08)}>
            <TiltCard className="skill-card glass">
              <div className="project-top">
                <span className="project-index">0{i + 1}</span>
              </div>
              <h2>{group.title}</h2>
              <ul className="chips" aria-label={`${group.title} skills`}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </TiltCard>
          </motion.article>
        ))}
      </div>

      <motion.section className="soft-strip glass" {...reveal(0.05)}>
        <div>
          <h2>{softSkills.title}</h2>
          <p>{softSkills.note}</p>
        </div>
        <ul className="chips" aria-label="Soft skills">
          {softSkills.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.section>
    </PageTransition>
  )
}
