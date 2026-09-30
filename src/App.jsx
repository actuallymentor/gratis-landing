import Icon from './components/atoms/Icon.jsx'
import ProjectArt from './components/atoms/ProjectArt.jsx'
import ReadingControls from './components/molecules/ReadingControls.jsx'
import { projects } from './projects.js'

/** Mentor’s personal directory of experiments, rendered on the server and client. */
export default function App() {

    return <>
        <a className="skip-link" href="#projects">Skip to projects</a>
        <header className="site-header wrap">
            <a className="wordmark" href="#" aria-label="gratis.sh home">gratis<span>.sh</span><span className="brand-star"><Icon kind="star" /></span></a>
            <nav aria-label="Main navigation"><a href="#projects">The playground <span><Icon kind="southwest" /></span></a><a href="https://github.com/actuallymentor" className="profile-link">@actuallymentor <span><Icon kind="arrow" /></span></a></nav>
        </header>

        <main>
            <section className="hero wrap" aria-labelledby="hero-heading">
                <div className="hero-copy">
                    <p className="eyebrow"><span className="status-dot" /> A PERSONAL AI PLAYGROUND</p>
                    <h1 id="hero-heading">A little curiosity.<br />A lot of <span className="possibility">possibility<svg viewBox="0 0 550 22" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15 Q260 -2 545 11 M35 20 Q290 6 505 18" /></svg></span>.</h1>
                    <p className="hero-description">Hey, I’m Mentor. This is where I follow my curiosity,<br className="desktop-break" /> build with AI, and leave the door open for you.</p>
                    <a className="primary-link" href="#projects">Come have a play <span><Icon kind="down" /></span></a>
                </div>
                <div className="hero-art" aria-hidden="true">
                    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                    <div className="big-asterisk"><Icon kind="star" /></div>
                    <div className="art-label label-top">ideas welcome.</div>
                    <div className="art-label label-bottom">always a work in play <span><Icon kind="arrow" /></span></div>
                    <span className="tiny-plus plus-one">+</span><span className="tiny-plus plus-two">+</span>
                </div>
                <div className="hero-footnote"><span>SMALL EXPERIMENTS. OPEN POSSIBILITIES.</span><span>Made by a human. With a little AI.</span></div>
            </section>

            <section id="projects" className="projects-section wrap" aria-labelledby="projects-heading">
                <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2 id="projects-heading">Things you can play with<span className="heading-dot">.</span></h2></div><span className="collection-count">{ String( projects.length ).padStart( 2, `0` ) } experiments & counting</span></div>
                <div className="project-grid">
                    { projects.map( ( project, index ) => <a className={ `project-card card-${ project.kind }` } href={ `https://${ project.domain }` } key={ project.domain }>
                        <div className="card-top"><span>{ String( index + 1 ).padStart( 2, `0` ) } / { project.category }</span><span className="card-arrow"><Icon kind="arrow" /></span></div>
                        <ProjectArt kind={ project.kind } />
                        <div className="card-copy"><h3>{ project.name }{ project.note && <span className="project-note">{ project.note }</span> }</h3><p>{ project.description }</p></div>
                        <div className="card-bottom"><span>{ project.domain }</span><span aria-hidden="true"><Icon kind="arrow" /></span></div>
                        <span className="sr-only">{ project.label }</span>
                    </a> ) }
                    <div className="next-card"><span className="next-spark" aria-hidden="true"><Icon kind="star" /></span><h3>What’s next?<br />Good question.</h3><p>There’s usually another idea brewing.<br />Follow along to see what sticks.</p><a href="https://x.com/actuallymentor">Find me on X <span><Icon kind="arrow" /></span></a></div>
                </div>
            </section>

            <section className="about-section wrap" aria-labelledby="about-heading"><span className="about-star" aria-hidden="true"><Icon kind="star" /></span><div><p className="eyebrow">A NOTE FROM THE MAKER</p><h2 id="about-heading">Built out of curiosity.<br />Shared in the same spirit.</h2><p>This isn’t a startup pitch. It’s my corner of the internet for trying things, learning in public, and making tools I want to use. Some are practical. Some are just a “what if?”</p><p>Have a look around. Find something useful. Make it your own.</p><a href="https://github.com/actuallymentor">Mentor <span className="maker-handle">/ @actuallymentor</span> <span><Icon kind="arrow" /></span></a></div></section>
        </main>

        <footer className="site-footer wrap"><a className="wordmark" href="#">gratis<span>.sh</span></a><p>A small corner of a very big internet.</p><div className="footer-links"><a href="https://github.com/actuallymentor">GitHub <Icon kind="arrow" /></a><a href="https://x.com/actuallymentor">X <Icon kind="arrow" /></a><ReadingControls /></div></footer>
    </>
}
