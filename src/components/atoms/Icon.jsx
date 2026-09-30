/** Font-independent navigation arrows. */
export default function Icon( { kind = `arrow` } ) {

    const path = kind === `down` ? `M12 3v18M5 14l7 7 7-7` : `M5 19 19 5M5 5h14v14`

    return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={ path } /></svg>
}
