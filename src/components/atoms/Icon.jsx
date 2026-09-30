/** Font-independent marks keep icons consistent across platforms. */
export default function Icon( { kind = `arrow` } ) {

    const paths = {
        arrow: `M5 19 19 5M5 5h14v14`,
        down: `M12 3v18M5 14l7 7 7-7`,
        southwest: `M19 5 5 19M5 5v14h14`,
        star: `M12 2v20M2 12h20M5 5l14 14M5 19 19 5`,
        play: `m8 4 12 8-12 8Z`,
    }

    return <svg className={ `icon icon-${ kind }` } viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ kind === `star` ? 4 : 1.5 } aria-hidden="true"><path d={ paths[ kind ] } /></svg>
}
