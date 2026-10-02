import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer'
import { AxePuppeteer } from '@axe-core/puppeteer'

const base_url = process.env.TEST_URL || `http://localhost:4175`
let server
let browser
let page
const errors = []

before( async () => {
    if( !process.env.TEST_URL ) {
        server = spawn( `node`, [ `node_modules/vite/bin/vite.js`, `preview`, `--port`, `4175`, `--strictPort` ], { stdio: `pipe` } )
        await new Promise( ( resolve, reject ) => {
            const timeout = setTimeout( () => reject( new Error( `Preview did not start` ) ), 15000 )
            server.stdout.on( `data`, () => {
                clearTimeout( timeout ); resolve()
            } )
            server.on( `error`, reject )
            server.on( `exit`, code => {
                if( code ) reject( new Error( `Preview exited: ${ code }` ) )
            } )
        } )
    }
    browser = await puppeteer.launch( { headless: false } )
    page = await browser.newPage()
    page.on( `pageerror`, error => errors.push( error.message ) )
    await mkdir( `artifacts`, { recursive: true } )
} )

after( async () => {
    await browser?.close()
    server?.kill()
} )

test( `desktop directory, real navigation, accessibility, and no hydration errors`, async () => {
    await page.setViewport( { width: 1440, height: 1100 } )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    await page.evaluate( () => document.fonts.ready )
    assert.match( await page.title(), /Mentor’s AI playground/ )
    assert.equal( await page.$$eval( `.project-card`, cards => cards.length ), 7 )
    const names = await page.$$eval( `.project-card h3`, headings => headings.map( heading => heading.textContent ) )
    assert.deepEqual( names.slice( 0, 4 ), [ `Vitamin D Calculator`, `Reader`, `Video Journal`, `AI Chat` ] )
    const art_ratios = await page.$$eval( `.project-art`, svgs => svgs.map( svg => svg.getBoundingClientRect() ).map( ( { width, height } ) => Math.round( width / height * 100 ) / 100 ) )
    assert.ok( art_ratios.length === 7 && art_ratios.every( ratio => ratio === 1.78 ), `Every tile has 16:9 artwork` )
    assert.ok( await page.$$eval( `.project-art`, svgs => svgs.every( svg => svg.querySelectorAll( `circle, rect, path, line` ).length > 3 ) ), `Every artwork draws shapes` )
    await page.screenshot( { path: `artifacts/desktop.png`, fullPage: true } )
    await page.click( `.primary-link` )
    await page.waitForFunction( () => location.hash === `#projects` )
    const destinations = await page.$$eval( `.project-card`, cards => cards.map( card => card.href ) )
    assert.ok( destinations.every( url => /^https:\/\/[a-z]+\.gratis\.sh\/$/.test( url ) ) )
    const { violations } = await new AxePuppeteer( page ).withTags( [ `wcag2a`, `wcag2aa`, `wcag21aa` ] ).analyze()
    assert.deepEqual( violations.map( ( { id, nodes } ) => ( { id, elements: nodes.map( node => node.target ) } ) ), [] )
    assert.deepEqual( errors, [] )
} )

test( `text-size buttons have 44px tap areas that do not overlap`, async () => {
    await page.setViewport( { width: 1440, height: 1100 } )
    await page.goto( base_url, { waitUntil: `networkidle0` } )

    // Probe real hit testing just inside each 44px target edge and between the buttons
    const probe = await page.evaluate( () => {
        const [ smaller, larger ] = document.querySelectorAll( `.reading-controls button` )
        larger.scrollIntoView( { block: `center`, behavior: `instant` } )
        const { left, right, top, bottom } = larger.getBoundingClientRect()
        const middle_x = ( left + right ) / 2
        const middle_y = ( top + bottom ) / 2
        const half_target = 22 - .5
        const hits = point => document.elementFromPoint( ...point ) === larger
        const gap_x = ( smaller.getBoundingClientRect().right + left ) / 2
        return {
            vertical: [ [ middle_x, middle_y - half_target ], [ middle_x, middle_y + half_target ] ].every( hits ),
            gap_owner: document.elementFromPoint( gap_x, middle_y )?.ariaLabel,
        }
    } )
    assert.ok( probe.vertical, `Larger text button is tappable 22px above and below its center` )
    assert.ok( [ `Decrease text size`, `Increase text size` ].includes( probe.gap_owner ), `Gap between buttons belongs to one of them` )
} )

test( `mobile layout and persistent text resizing`, async () => {
    await page.setViewport( { width: 390, height: 844 } )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    await page.screenshot( { path: `artifacts/mobile.png`, fullPage: true } )
    await page.click( `[aria-label="Increase text size"]` )
    await page.click( `[aria-label="Increase text size"]` )
    await page.click( `[aria-label="Increase text size"]` )
    await page.reload( { waitUntil: `networkidle0` } )
    assert.equal( await page.$eval( `html`, el => el.style.fontSize ), `130%` )
    assert.equal( await page.$eval( `[aria-label="Increase text size"]`, el => el.disabled ), true )
    assert.ok( await page.evaluate( () => document.documentElement.scrollWidth <= innerWidth ), `No horizontal overflow at maximum text size` )
    await page.click( `[aria-label="Decrease text size"]` )
    assert.equal( await page.$eval( `html`, el => el.style.fontSize ), `120%` )
    await page.setViewport( { width: 320, height: 700 } )
    await page.addStyleTag( { content: `* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }` } )
    assert.ok( await page.evaluate( () => document.documentElement.scrollWidth <= innerWidth ), `No overflow with narrow viewport and accessible text spacing` )
    await page.evaluate( () => document.documentElement.style.fontSize = `200%` )
    assert.ok( await page.$$eval( `.status-pill`, pills => pills.every( pill => pill.getBoundingClientRect().right <= pill.closest( `.project-card` ).getBoundingClientRect().right ) ), `Access pills stay inside their tiles at 200% text` )
    await page.evaluate( () => localStorage.clear() )
} )

test( `artwork animates only on screen and stays still for reduced motion`, async () => {
    await page.setViewport( { width: 390, height: 844 } )
    await page.goto( base_url, { waitUntil: `networkidle0` } )

    // Scroll the first tile into view: it plays, the far tiles stay paused
    await page.evaluate( () => document.querySelector( `.project-art` ).scrollIntoView( { behavior: `instant` } ) )
    await page.waitForFunction( () => document.querySelector( `.project-art` ).classList.contains( `is-playing` ) )
    const playing = await page.$$eval( `.project-art`, svgs => svgs.map( svg => svg.classList.contains( `is-playing` ) ) )
    assert.equal( playing.at( -1 ), false, `Offscreen artwork is paused` )

    // Grape bunches pivot from their stem top and grapes never inherit the sway
    const sway = await page.$eval( `.art-sway`, bunch => ( { origin: getComputedStyle( bunch ).transformOrigin, child: getComputedStyle( bunch.querySelector( `circle` ) ).animationName } ) )
    assert.match( sway.origin, / 0px$/, `Bunch rotates around its top edge` )
    assert.equal( sway.child, `none` )

    // Reduced motion removes artwork animation entirely
    await page.emulateMediaFeatures( [ { name: `prefers-reduced-motion`, value: `reduce` } ] )
    const names = await page.$$eval( `.project-art [class*="art-"]`, elements => [ ...new Set( elements.map( element => getComputedStyle( element ).animationName ) ) ] )
    assert.deepEqual( names, [ `none` ] )
    await page.emulateMediaFeatures( [ { name: `prefers-reduced-motion`, value: `no-preference` } ] )
} )

test( `dark theme follows the device and stays accessible`, async () => {
    await page.emulateMediaFeatures( [ { name: `prefers-color-scheme`, value: `dark` } ] )
    await page.setViewport( { width: 1440, height: 1100 } )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    await page.screenshot( { path: `artifacts/desktop-dark.png`, fullPage: true } )
    assert.equal( await page.$eval( `body`, el => getComputedStyle( el ).backgroundColor ), `rgb(0, 43, 54)` )
    const { violations } = await new AxePuppeteer( page ).withTags( [ `wcag2a`, `wcag2aa`, `wcag21aa` ] ).analyze()
    assert.deepEqual( violations.map( ( { id } ) => id ), [] )
    await page.emulateMediaFeatures( [ { name: `prefers-color-scheme`, value: `light` } ] )
} )

test( `directory is readable without JavaScript`, async () => {
    await page.setJavaScriptEnabled( false )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    assert.equal( await page.$$eval( `.project-card`, cards => cards.length ), 7 )
    assert.match( await page.$eval( `h1`, el => el.textContent ), /AI experiments/ )
    const prerendered_art = await page.$$eval( `.project-art`, svgs => svgs.map( svg => svg.innerHTML ) )

    // Seeded art must match exactly once the client hydrates
    await page.setJavaScriptEnabled( true )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    assert.deepEqual( await page.$$eval( `.project-art`, svgs => svgs.map( svg => svg.innerHTML ) ), prerendered_art )
} )
