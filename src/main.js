import { createApp, nextTick } from 'vue'
import App from './App.vue'
import '../assets/main.css' // 

const DATA_URL = '/data/detections-ui.json'

const frame = () => new Promise(resolve => requestAnimationFrame(() => resolve()))

// Reveal #app once the interface is built, laid out and fonts are ready.
// The header and intro are static HTML outside #app, so they show immediately.
async function reveal(root){
	await nextTick()
	if (document.fonts && document.fonts.ready) {
		// don't let a slow font hold the page hostage
		await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))])
	}
	await frame()
	await frame()
	root.classList.add('ready')
}

async function start(){
	const root = document.getElementById('app')
	try {
		const response = await fetch(DATA_URL)
		if (!response.ok) throw new Error('HTTP ' + response.status)
		const items = await response.json()
		createApp(App, { items }).mount(root)
	} catch (err) {
		console.error('Failed to load data', err)
		root.textContent = 'Sorry, the data could not be loaded. Please try reloading the page.'
		root.classList.add('error')
	}
	await reveal(root)
}

start()

