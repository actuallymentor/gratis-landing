import Icon from './Icon.jsx'
/** Decorative, abstract sketches of what each experiment does. */
export default function ProjectArt( { kind } ) {

    return <div className={ `project-art art-${ kind }` } aria-hidden="true">
        { kind === `chat` && <><div className="chat-bubble bubble-one">What if…<span><Icon kind="star" /></span></div><div className="chat-bubble bubble-two"><i /><i /><i /></div></> }
        { kind === `reader` && <div className="book"><div><i /><i /><i /><i /></div><div><i /><i /><i /><i /></div></div> }
        { kind === `audio` && <div className="waveform">{ [ 18, 32, 48, 26, 64, 88, 50, 72, 100, 62, 32, 54, 78, 40, 22, 34, 16 ].map( ( height, index ) => <i key={ index } style={ { height: `${ height }%` } } /> ) }</div> }
        { kind === `grapevine` && <div className="grapes">{ Array.from( { length: 6 }, ( _, index ) => <i key={ index } /> ) }<span><Icon kind="arrow" /></span></div> }
        { kind === `video` && <div className="film"><span /><span className="play"><Icon kind="play" /></span><span /></div> }
        { kind === `sun` && <div className="sun"><span /><i /></div> }
        { kind === `halo` && <div className="halo"><span /><i /></div> }
    </div>
}
