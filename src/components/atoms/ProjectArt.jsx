// Seeded generative artwork: every project gets a stable, abstract 16:9 vignette.
// Seeds come from the domain so server and client renders always match.

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
const round = number => Math.round( number * 10 ) / 10

/* ── Motifs: one per project, each returns SVG children ── */

// Vitamin D: a low sun with soft halos over rolling horizon lines
const sun = random => {

    const sun_x = round( between( random, 90, 230 ) )
    const sun_y = round( between( random, 55, 75 ) )

    const halos = range( 4 ).map( index => <circle key={ `halo-${ index }` } cx={ sun_x } cy={ sun_y } r={ 28 + index * 16 } fill="none" stroke={ tone.gold } strokeWidth="1" opacity={ round( .55 - index * .12 ) } /> )
    const hills = range( 4 ).map( index => {
        const base = 112 + index * 18
        const crest = round( base - between( random, 8, 24 ) )
        return <path key={ `hill-${ index }` } d={ `M0 ${ base } Q ${ round( between( random, 60, 260 ) ) } ${ crest } ${ width } ${ round( base + between( random, -6, 6 ) ) } V ${ height } H 0 Z` } fill={ index % 2 ? tone.accent : tone.strong } opacity={ round( .2 + index * .14 ) } />
    } )

    return <>
        { halos }
        <circle cx={ sun_x } cy={ sun_y } r="20" fill={ tone.gold } />
        { hills }
    </>
}

// Reader: an open book of text lines, a few words highlighted as translations
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
        words.push( <rect key={ `word-${ page }-${ line }-${ words.length }` } x={ round( cursor ) } y={ y } width={ round( word_width ) } height="5" rx="2.5" fill={ highlight ? pick( random, [ tone.coral, tone.gold ] ) : tone.ink } opacity={ highlight ? .9 : .22 } /> )
        cursor += word_width + 5
    }

    return words
} ) )

// Video journal: a grid of tinted clips with a playhead and a recording dot
const frames = random => {

    const columns = 5
    const clip_width = 50
    const playhead_x = round( between( random, 40, 280 ) )

    const clips = range( columns * 2 ).map( index => {
        const column = index % columns
        const row = Math.floor( index / columns )
        return <rect key={ `clip-${ index }` } x={ 22 + column * ( clip_width + 7 ) } y={ 34 + row * 52 } width={ clip_width } height="44" rx="4" fill={ pick( random, [ tone.accent, tone.strong, tone.coral, tone.gold ] ) } opacity={ round( between( random, .75, .95 ) ) } />
    } )

    return <>
        { clips }
        <line x1={ playhead_x } y1="24" x2={ playhead_x } y2="150" stroke={ tone.coral } strokeWidth="1.5" />
        <circle cx={ playhead_x } cy="24" r="4" fill={ tone.coral } />
        <circle cx="290" cy="18" r="4" fill={ tone.coral } opacity=".8" />
    </>
}

// AI chat: alternating bubbles, the last one still typing
const chat = random => {

    const bubbles = range( 4 ).map( index => {
        const mine = index % 2 === 1
        const bubble_width = round( between( random, 90, 170 ) )
        const x = mine ? width - 24 - bubble_width : 24
        return <rect key={ `bubble-${ index }` } x={ x } y={ 16 + index * 30 } width={ bubble_width } height="22" rx="11" fill={ mine ? tone.accent : tone.ink } opacity={ mine ? .6 : .14 } />
    } )
    const typing = range( 3 ).map( index => <circle key={ `dot-${ index }` } cx={ 40 + index * 10 } cy="147" r="3" fill={ tone.strong } opacity={ round( .4 + index * .2 ) } /> )

    return <>
        { bubbles }
        <rect x="24" y="136" width="56" height="22" rx="11" fill={ tone.ink } opacity=".14" />
        { typing }
    </>
}

// Transcribe: a symmetric waveform resolving into lines of text
const wave = random => {

    const bars = range( 44 ).map( index => {
        const envelope = Math.sin( index / 43 * Math.PI )
        const bar_height = round( 6 + envelope * between( random, 10, 70 ) )
        return <rect key={ `bar-${ index }` } x={ round( 26 + index * 6.2 ) } y={ round( 70 - bar_height / 2 ) } width="3" height={ bar_height } rx="1.5" fill={ index % 7 ? tone.accent : tone.strong } opacity=".8" />
    } )
    const lines = range( 2 ).map( index => <rect key={ `line-${ index }` } x="26" y={ 132 + index * 14 } width={ round( between( random, 160, 268 ) ) } height="5" rx="2.5" fill={ tone.ink } opacity=".22" /> )

    return <>
        { bars }
        { lines }
    </>
}

// Grapevine: a winding vine with tapered bunches hanging from it
const vine = random => {

    const points = range( 6 ).map( index => [ 20 + index * 56, round( between( random, 44, 70 ) ) ] )
    const path = points.reduce( ( d, [ x, y ], index ) => index ? `${ d } S ${ x - 28 } ${ y } ${ x } ${ y }` : `M ${ x } ${ y }`, `` )

    // Bunch rows taper 4 → 3 → 2 → 1 grapes, hanging below each inner node
    const bunch = ( [ x, y ], cluster ) => [ 4, 3, 2, 1 ].flatMap( ( count, row ) => range( count ).map( index => <circle
        key={ `grape-${ cluster }-${ row }-${ index }` }
        cx={ round( x + ( index - ( count - 1 ) / 2 ) * 11 ) }
        cy={ round( y + 18 + row * 10 ) }
        r="6"
        fill={ pick( random, [ tone.accent, tone.strong, tone.coral ] ) }
        opacity={ round( between( random, .6, .95 ) ) }
    /> ) )

    const stems = points.slice( 1, -1 ).map( ( [ x, y ], index ) => <line key={ `stem-${ index }` } x1={ x } y1={ y } x2={ x } y2={ y + 12 } stroke={ tone.strong } strokeWidth="1.5" opacity=".7" /> )

    return <>
        <path d={ path } fill="none" stroke={ tone.strong } strokeWidth="1.5" opacity=".7" />
        { stems }
        { points.slice( 1, -1 ).flatMap( bunch ) }
    </>
}

// Halo: concentric recovery rings, each partially filled like a score
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
            <circle cx={ center_x } cy={ center_y } r={ radius } fill="none" stroke={ color } strokeWidth="5" strokeLinecap="round" strokeDasharray={ `${ filled } ${ circumference }` } transform={ `rotate(-90 ${ center_x } ${ center_y })` } opacity=".85" />
        </g>
    } )

    return <>
        { arcs }
        <circle cx={ center_x } cy={ center_y } r="6" fill={ tone.strong } />
    </>
}

const motifs = { sun, pages, frames, chat, wave, vine, rings }

/**
 * Decorative 16:9 artwork for a project tile.
 * @param {Object} props
 * @param {string} props.motif - Key in `motifs`
 * @param {string} props.seed - Stable seed so renders are reproducible
 * @returns {JSX.Element} Inline SVG hidden from assistive tech
 */
export default function ProjectArt( { motif, seed } ) {

    const draw = motifs[ motif ]
    const random = seeded_random( seed )

    return <svg className="project-art" viewBox={ `0 0 ${ width } ${ height }` } aria-hidden="true" focusable="false">
        { draw?.( random ) }
    </svg>
}
