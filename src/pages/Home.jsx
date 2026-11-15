import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <section className="hero">
        <div>
          <span className="eyebrow">Hello, I'm Anay</span>
          <h1>
            I build <em>full stack</em> web experiences.
          </h1>
          <p>
            B.Tech Computer Science &amp; Design student and MERN developer, with a growing
            focus on Web3 and AI-integrated apps. Open to freelance work and remote
            opportunities.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              View projects
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>

        <div className="photo-wrap">
          <span>
            Your photo
            <br />
            goes here
          </span>
        </div>
      </section>
    </PageTransition>
  )
}
