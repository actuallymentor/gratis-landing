import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/nunito'
import App from './App.jsx'
import './index.css'

const root = document.getElementById( `root` )

if( root.hasChildNodes() && root.querySelector( `main` ) ) hydrateRoot( root, <App /> )
else createRoot( root ).render( <App /> )
