import { useEffect, useRef } from 'react'

// Seeded generative artwork: every project gets a stable, abstract 16:9 vignette.
// Seeds come from the domain so server and client renders always match.
// Motion lives in CSS (see `.project-art` in index.css); this file only assigns
// each element a motion kind plus a seeded period and phase, so loops overlap
// independently instead of moving in sync.

const width = 320
const height = 180

// Palette pulls from theme tokens so the art follows light/dark mode
const tone = {
    accent: `var(--accent)`,
    strong: `var(--accent-strong)`,
    coral: `var(--coral)`,
    gold: `var(--gold)`,
    ink: `var(--art-ink)`,
}

/**
 * Small deterministic PRNG (mulberry32) seeded from a string.
 * @param {string} seed_text - Stable seed, e.g. a domain
 * @returns {Function} Returns floats in [0, 1)
 */
const seeded_random = seed_text => {

    // FNV-1a style hash to turn the text into a 32-bit seed
    let seed = [ ...seed_text ].reduce( ( hash, char ) => Math.imul( hash ^ char.charCodeAt( 0 ), 16777619 ), 2166136261 )

    return () => {
        seed = seed + 0x6D2B79F5 | 0
        let mixed = Math.imul( seed ^ seed >>> 15, 1 | seed )
        mixed = mixed + Math.imul( mixed ^ mixed >>> 7, 61 | mixed ) ^ mixed
        return ( ( mixed ^ mixed >>> 14 ) >>> 0 ) / 4294967296
    }
}

// Helpers that keep the motif code readable
const between = ( random, min, max ) => min + random() * ( max - min )
const pick = ( random, items ) => items[ Math.floor( random() * items.length ) ]
const range = count => Array.from( { length: count }, ( _, index ) => index )
const round = number => Math.round( number * 100 ) / 100

/**
 * Motion props for one element: CSS classes plus a seeded period, phase and reach.
 * @param {Function} random - Seeded PRNG
 * @param {string} kinds - Space-separated motions: drift, bob, sway, pulse, stretch, spin, shade
 * @param {Object} [options]
 * @param {Array} [options.period] - Min/max loop length in seconds
 * @param {string} [options.reach] - Movement amplitude, e.g. `6px` or `3deg`
 * @returns {Object} `className` and `style` to spread onto an SVG element
 */
const motion = ( random, kinds, { period = [ 6, 12 ], reach } = {} ) => {

    const duration = round( between( random, ...period ) )

    // Negative delay starts each loop mid-cycle, so the first frame is already composed
    const style = { '--duration': `${ duration }s`, '--delay': `-${ round( random() * duration ) }s` }
    if( reach ) style[ '--reach' ] = reach

    return { className: kinds.split( ` ` ).map( kind => `art-${ kind }` ).join( ` ` ), style }
}

/* ── Motifs: one per project, each returns SVG children ── */

// Vitamin D: a low sun with breathing halos over drifting hills
const sun = random => {

    const sun_x = round( between( random, 90, 230 ) )
    const sun_y = round( between( random, 55, 75 ) )

    const halos = range( 4 ).map( index => <circle key={ `halo-${ index }` } { ...motion( random, `pulse shade`, { period: [ 5, 9 ], reach: `1.06` } ) } cx={ sun_x } cy={ sun_y } r={ 28 + index * 16 } fill="none" stroke={ tone.gold } strokeWidth="1" opacity={ round( .55 - index * .12 ) } /> )

    // Hills overhang the frame so their drift never reveals an edge
    const hills = range( 4 ).map( index => {
        const base = 112 + index * 18
        const crest = round( base - between( random, 8, 24 ) )
        return <path key={ `hill-${ index }` } { ...motion( random, `drift`, { period: [ 9, 16 ], reach: `${ 4 + index * 2 }px` } ) } d={ `M-20 ${ base } Q ${ round( between( random, 60, 260 ) ) } ${ crest } ${ width + 20 } ${ round( base + between( random, -6, 6 ) ) } V ${ height } H -20 Z` } fill={ index % 2 ? tone.accent : tone.strong } opacity={ round( .2 + index * .14 ) } />
    } )

    return <>
        { halos }
        <circle { ...motion( random, `pulse`, { period: [ 7, 9 ], reach: `1.04` } ) } cx={ sun_x } cy={ sun_y } r="20" fill={ tone.gold } />
        { hills }
    </>
}

// Reader: an open book of text lines; highlighted translations glow softly
const pages = random => range( 2 ).flatMap( page => range( 9 ).flatMap( line => {

    const y = 30 + line * 14
    const column_x = page ? 172 : 28
    const column_end = column_x + 120
    const words = []
    let cursor = column_x

    // Fill each line with words of random width until the column is full
    while( cursor < column_end - 8 ) {
        const word_width = Math.min( between( random, 10, 34 ), column_end - cursor )
        const highlight = random() < .1
        const glow = highlight ? motion( random, `shade`, { period: [ 3, 6 ] } ) : {}
        words.push( <rect key={ `word-${ page }-${ line }-${ words.length }` } { ...glow } x={ round( cursor ) } y={ y } width={ round( word_width ) } height="5" rx="2.5" fill={ highlight ? pick( random, [ tone.coral, tone.gold ] ) : tone.ink } opacity={ highlight ? .9 : .22 } /> )
        cursor += word_width + 5
    }

    return words
} ) )

// Video journal: a grid of shimmering clips with a playhead scrubbing past
const frames = random => {

    const columns = 5
    const clip_width = 50
    const playhead_x = round( between( random, 60, 260 ) )

    const clips = range( columns * 2 ).map( index => {
        const column = index % columns
        const row = Math.floor( index / columns )
        return <rect key={ `clip-${ index }` } { ...motion( random, `shade`, { period: [ 4, 10 ] } ) } x={ 22 + column * ( clip_width + 7 ) } y={ 34 + row * 52 } width={ clip_width } height="44" rx="4" fill={ pick( random, [ tone.accent, tone.strong, tone.coral, tone.gold ] ) } opacity={ round( between( random, .75, .95 ) ) } />
    } )

    return <>
        { clips }
        <g { ...motion( random, `drift`, { period: [ 10, 14 ], reach: `40px` } ) }>
            <line x1={ playhead_x } y1="24" x2={ playhead_x } y2="150" stroke={ tone.coral } strokeWidth="1.5" />
            <circle cx={ playhead_x } cy="24" r="4" fill={ tone.coral } />
        </g>
        <circle { ...motion( random, `shade`, { period: [ 2, 3 ] } ) } cx="290" cy="18" r="4" fill={ tone.coral } opacity=".8" />
    </>
}

// AI chat: bubbles float gently while the reply keeps typing
const chat = random => {

    const bubbles = range( 4 ).map( index => {
        const mine = index % 2 === 1
        const bubble_width = round( between( random, 90, 170 ) )
        const x = mine ? width - 24 - bubble_width : 24
        return <rect key={ `bubble-${ index }` } { ...motion( random, `bob`, { period: [ 6, 10 ], reach: `-2px` } ) } x={ x } y={ 16 + index * 30 } width={ bubble_width } height="22" rx="11" fill={ mine ? tone.accent : tone.ink } opacity={ mine ? .6 : .14 } />
    } )

    // Typing dots share a period but keep their own phase, like a real indicator
    const typing = range( 3 ).map( index => <circle key={ `dot-${ index }` } { ...motion( random, `bob shade`, { period: [ 1.4, 1.6 ], reach: `-3px` } ) } cx={ 40 + index * 10 } cy="147" r="3" fill={ tone.strong } opacity={ round( .4 + index * .2 ) } /> )

    return <>
        { bubbles }
        <rect x="24" y="136" width="56" height="22" rx="11" fill={ tone.ink } opacity=".14" />
        { typing }
    </>
}

// Transcribe: a living waveform resolving into lines of text
const wave = random => {

    const bars = range( 44 ).map( index => {
        const envelope = Math.sin( index / 43 * Math.PI )
        const bar_height = round( 6 + envelope * between( random, 10, 70 ) )
        return <rect key={ `bar-${ index }` } { ...motion( random, `stretch`, { period: [ 1.8, 4 ], reach: `${ round( between( random, .45, .8 ) ) }` } ) } x={ round( 26 + index * 6.2 ) } y={ round( 70 - bar_height / 2 ) } width="3" height={ bar_height } rx="1.5" fill={ index % 7 ? tone.accent : tone.strong } opacity=".8" />
    } )
    const lines = range( 2 ).map( index => <rect key={ `line-${ index }` } x="26" y={ 132 + index * 14 } width={ round( between( random, 160, 268 ) ) } height="5" rx="2.5" fill={ tone.ink } opacity=".22" /> )

    return <>
        { bars }
        { lines }
    </>
}

// Grapevine: a winding vine with tapered bunches swaying from it
const vine = random => {

    const points = range( 6 ).map( index => [ 20 + index * 56, round( between( random, 44, 70 ) ) ] )
    const path = points.reduce( ( d, [ x, y ], index ) => index ? `${ d } S ${ x - 28 } ${ y } ${ x } ${ y }` : `M ${ x } ${ y }`, `` )

    // Each bunch hangs from its stem and sways around the stem's top
    const bunch = ( [ x, y ], cluster ) => <g key={ `bunch-${ cluster }` } { ...motion( random, `sway`, { period: [ 5, 9 ], reach: `${ round( between( random, 3, 6 ) ) }deg` } ) }>
        <line x1={ x } y1={ y } x2={ x } y2={ y + 12 } stroke={ tone.strong } strokeWidth="1.5" opacity=".7" />
        { [ 4, 3, 2, 1 ].flatMap( ( count, row ) => range( count ).map( index => <circle
            key={ `grape-${ row }-${ index }` }
            { ...random() < .35 ? motion( random, `shade`, { period: [ 4, 8 ] } ) : {} }
            cx={ round( x + ( index - ( count - 1 ) / 2 ) * 11 ) }
            cy={ round( y + 18 + row * 10 ) }
            r="6"
            fill={ pick( random, [ tone.accent, tone.strong, tone.coral ] ) }
            opacity={ round( between( random, .6, .95 ) ) }
        /> ) ) }
    </g>

    return <>
        <path d={ path } fill="none" stroke={ tone.strong } strokeWidth="1.5" opacity=".7" />
        { points.slice( 1, -1 ).map( bunch ) }
    </>
}

// Halo: concentric recovery rings turning at their own pace
const rings = random => {

    const center_x = 160
    const center_y = 90

    const arcs = range( 4 ).map( index => {
        const radius = 22 + index * 16
        const circumference = round( 2 * Math.PI * radius )
        const filled = round( circumference * between( random, .35, .9 ) )
        const color = [ tone.accent, tone.strong, tone.coral, tone.gold ][ index ]
        return <g key={ `ring-${ index }` }>
            <circle cx={ center_x } cy={ center_y } r={ radius } fill="none" stroke={ tone.ink } strokeWidth="5" opacity=".08" />
            <g { ...motion( random, `spin shade`, { period: [ 24, 48 ] } ) }>
                <circle cx={ center_x } cy={ center_y } r={ radius } fill="none" stroke={ color } strokeWidth="5" strokeLinecap="round" strokeDasharray={ `${ filled } ${ circumference }` } transform={ `rotate(-90 ${ center_x } ${ center_y })` } opacity=".85" />
            </g>
        </g>
    } )

    return <>
        { arcs }
        <circle { ...motion( random, `pulse`, { period: [ 3, 5 ], reach: `1.25` } ) } cx={ center_x } cy={ center_y } r="6" fill={ tone.strong } />
    </>
}

const motifs = { sun, pages, frames, chat, wave, vine, rings }

/**
 * Plays the artwork only while it is on screen and the tab is visible.
 * CSS keeps animations paused until `is-playing` is set, so the prerendered
 * frame doubles as the static composition without JavaScript.
 * @param {Object} svg_ref - Ref to the artwork's SVG element
 */
const usePlayWhenVisible = svg_ref => {

    useEffect( () => {

        const svg = svg_ref.current
        let on_screen = false

        // Toggle the class instead of state so React never re-renders the art
        const update = () => svg.classList.toggle( `is-playing`, on_screen && !document.hidden )

        const observer = new IntersectionObserver( ( [ entry ] ) => {
            on_screen = entry.isIntersecting
            update()
        } )

        observer.observe( svg )
        document.addEventListener( `visibilitychange`, update )

        return () => {
            observer.disconnect()
            document.removeEventListener( `visibilitychange`, update )
        }

    }, [ svg_ref ] )
}

/**
 * Decorative, gently animated 16:9 artwork for a project tile.
 * @param {Object} props
 * @param {string} props.motif - Key in `motifs`
 * @param {string} props.seed - Stable seed so renders are reproducible
 * @returns {JSX.Element} Inline SVG hidden from assistive tech
 */
export default function ProjectArt( { motif, seed } ) {

    const svg_ref = useRef( null )
    usePlayWhenVisible( svg_ref )

    const draw = motifs[ motif ]
    const random = seeded_random( seed )

    return <svg ref={ svg_ref } className="project-art" viewBox={ `0 0 ${ width } ${ height }` } aria-hidden="true" focusable="false">
        { draw?.( random ) }
    </svg>
}
