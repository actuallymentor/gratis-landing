import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

// Ship the directory as HTML so it also works before JavaScript loads.
const server = await createServer( { server: { middlewareMode: true } } )

try {
    const { default: App } = await server.ssrLoadModule( `/src/App.jsx` )
    const html = await readFile( `dist/index.html`, `utf8` )
    await writeFile( `dist/index.html`, html.replace( `<!--app-html-->`, renderToString( createElement( App ) ) ) )
} finally {
    await server.close()
}
