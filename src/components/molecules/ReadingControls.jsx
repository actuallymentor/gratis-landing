import { useEffect, useState } from 'react'

/** Small, persistent type controls; browser zoom remains fully supported. */
export default function ReadingControls() {

    const [ scale, set_scale ] = useState( 100 )

    useEffect( () => {
        try {
            const saved = Number( localStorage.getItem( `text-size` ) )
            if( [ 100, 110, 120, 130 ].includes( saved ) ) set_scale( saved )
        } catch { /* Reading preferences remain usable without storage. */ }
    }, [] )

    useEffect( () => {
        document.documentElement.style.fontSize = `${ scale }%`
    }, [ scale ] )

    const resize_text = next_scale => {
        set_scale( next_scale )
        try {
            localStorage.setItem( `text-size`, String( next_scale ) )
        } catch { /* Storage is optional. */ }
    }

    return <div className="reading-controls" aria-label="Text size">
        <button aria-label="Decrease text size" disabled={ scale === 100 } onClick={ () => resize_text( scale - 10 ) }>A−</button>
        <button aria-label="Increase text size" disabled={ scale === 130 } onClick={ () => resize_text( scale + 10 ) }>A+</button>
        <span className="sr-only" role="status">Text size: { scale }%</span>
    </div>
}
