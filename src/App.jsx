import { ArrowDown, ArrowUpRight, Info, KeyRound, Lock, Users } from 'lucide-react'
import ProjectArt from './components/atoms/ProjectArt.jsx'
import ReadingControls from './components/molecules/ReadingControls.jsx'
import { projects } from './projects.js'

// Shared Lucide settings: fine strokes, hidden from assistive tech since labels carry meaning
const icon_props = { size: 16, strokeWidth: 1.5, 'aria-hidden': true, className: `icon` }

// Access requirement → status pill icon
const access_icons = { key: KeyRound, members: Users, invite: Lock }

/** Small tinted pill describing how a project can be accessed. */
const AccessStatus = ( { access, note } ) => {

    const StatusIcon = access_icons[ access ] || Info
    return <span className="status-pill"><StatusIcon { ...icon_props } />{ note }</span>
}

/** Mentor’s project directory, rendered on the server and client. */
export default function App() {

    return <>
        <a className="skip-link" href="#projects">Skip to projects</a>

        { /* Header */ }
        <header className="site-header wrap">
            <a className="wordmark" href="#" aria-label="gratis.sh home">gratis<span>.sh</span></a>
            <nav aria-label="Main navigation">
                <a href="#projects">Projects</a>
                <a href="https://github.com/actuallymentor">GitHub <ArrowUpRight { ...icon_props } /></a>
            </nav>
        </header>

        <main className="wrap">

            { /* Introduction */ }
            <section className="hero" aria-labelledby="hero-heading">
                <p className="eyebrow">MENTOR / @ACTUALLYMENTOR</p>
                <h1 id="hero-heading">AI experiments<br />and side projects.</h1>
                <p className="hero-description">I’m Mentor, a programmer. This is my AI playground: tools I’m building and experiments I’m working on.</p>
                <a className="primary-link" href="#projects">View projects <ArrowDown { ...icon_props } /></a>
            </section>

            { /* Project directory */ }
            <section id="projects" className="projects-section" aria-labelledby="projects-heading">
                <div className="section-heading">
                    <h2 id="projects-heading">Projects</h2>
                    <span className="collection-count">{ projects.length } projects</span>
                </div>

                <div className="project-grid">
                    { projects.map( ( { name, domain, category, description, note, access, art } ) => <a className="project-card" href={ `https://${ domain }` } key={ domain }>
                        <ProjectArt motif={ art } seed={ domain } />
                        <div className="card-top">
                            <span>{ category }</span>
                            <ArrowUpRight { ...icon_props } />
                        </div>
                        <div className="card-copy">
                            <h3>{ name }</h3>
                            <p>{ description }</p>
                        </div>
                        { note && <AccessStatus access={ access } note={ note } /> }
                        <div className="card-bottom">{ domain }</div>
                    </a> ) }
                </div>
            </section>

        </main>

        { /* Footer */ }
        <footer className="site-footer wrap">
            <p>Mentor <span>/ @actuallymentor</span></p>
            <div className="footer-links">
                <a href="https://github.com/actuallymentor">GitHub <ArrowUpRight { ...icon_props } /></a>
                <a href="https://x.com/actuallymentor">X <ArrowUpRight { ...icon_props } /></a>
                <ReadingControls />
            </div>
        </footer>
    </>
}
