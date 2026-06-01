import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function htmlPartials() {
  const cache = {}
  function load(name) {
    if (!cache[name]) {
      cache[name] = readFileSync(resolve(__dirname, `src/partials/${name}.html`), 'utf8')
    }
    return cache[name]
  }
  return {
    name: 'html-partials',
    handleHotUpdate({ file, server }) {
      if (file.includes('src/partials/')) {
        Object.keys(cache).forEach(k => delete cache[k])
        server.ws.send({ type: 'full-reload' })
      }
    },
    transformIndexHtml(html) {
      return html.replace(/<!--\s*PARTIAL:(\w+)\s*-->/g, (_, name) => load(name))
    }
  }
}

export default defineConfig({
  plugins: [tailwindcss(), htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aprovados: 'aprovados.html',
        contato: 'contato.html',
        doacoes: 'doacoes.html',
        educadores: 'educadores.html',
        processos: 'processos-seletivos.html',
      }
    }
  }
})
