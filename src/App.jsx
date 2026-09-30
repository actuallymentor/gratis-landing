import Icon from './components/atoms/Icon.jsx'
import ReadingControls from './components/molecules/ReadingControls.jsx'
import { projects } from './projects.js'

/** Mentor’s project directory, rendered on the server and client. */
export default function App() {

    return <>
        <a className="skip-link" href="#projects">Skip to projects</a>

        <header className="site-header wrap">
            <a className="wordmark" href="#" aria-label="gratis.sh home">gratis<span>.sh</span></a>
            <nav aria-label="Main navigation">
                <a href="#projects">Projects</a>
                <a href="https://github.com/actuallymentor">GitHub <Icon /></a>
            </nav>
        </header>

        <main className="wrap">
            <section className="hero" aria-labelledby="hero-heading">
                <p className="eyebrow">MENTOR / @ACTUALLYMENTOR</p>
                <h1 id="hero-heading">AI experiments<br />and side projects.</h1>
                <p className="hero-description">I’m Mentor, a programmer. This is my AI playground: tools I’m building and experiments I’m working on.</p>
                <a className="primary-link" href="#projects">View projects <Icon kind="down" /></a>
            </section>

            <section id="projects" className="projects-section" aria-labelledby="projects-heading">
                <div className="section-heading">
                    <h2 id="projects-heading">Projects</h2>
                    <span className="collection-count">{ projects.length } projects</span>
                </div>

                <div className="project-grid">
                    { projects.map( project => <a className="project-card" href={ `https://${ project.domain }` } key={ project.domain }>
                        <div className="card-top">
                            <span>{ project.category }</span>
                            <Icon />
                        </div>
                        <div className="card-copy">
                            <h3>{ project.name }</h3>
                            <p>{ project.description }</p>
                        </div>
                        { project.note && <span className="project-note">{ project.note }</span> }
                        <div className="card-bottom">{ project.domain }</div>
                    </a> ) }
                </div>
            </section>
        </main>

        <footer className="site-footer wrap">
            <p>Mentor <span>/ @actuallymentor</span></p>
            <div className="footer-links">
                <a href="https://github.com/actuallymentor">GitHub <Icon /></a>
                <a href="https://x.com/actuallymentor">X <Icon /></a>
                <ReadingControls />
            </div>
        </footer>
    </>
}
