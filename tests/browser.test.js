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
    await page.screenshot( { path: `artifacts/desktop.png`, fullPage: true } )
    await page.click( `.primary-link` )
    await page.waitForFunction( () => location.hash === `#projects` )
    const destinations = await page.$$eval( `.project-card`, cards => cards.map( card => card.href ) )
    assert.ok( destinations.every( url => /^https:\/\/[a-z]+\.gratis\.sh\/$/.test( url ) ) )
    const { violations } = await new AxePuppeteer( page ).withTags( [ `wcag2a`, `wcag2aa`, `wcag21aa` ] ).analyze()
    assert.deepEqual( violations.map( ( { id, nodes } ) => ( { id, elements: nodes.map( node => node.target ) } ) ), [] )
    assert.deepEqual( errors, [] )
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
    await page.evaluate( () => localStorage.clear() )
} )

test( `directory is readable without JavaScript`, async () => {
    await page.setJavaScriptEnabled( false )
    await page.goto( base_url, { waitUntil: `networkidle0` } )
    assert.equal( await page.$$eval( `.project-card`, cards => cards.length ), 7 )
    assert.match( await page.$eval( `h1`, el => el.textContent ), /A little curiosity/ )
    await page.setJavaScriptEnabled( true )
} )
