import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' : le dossier dist se déploie n'importe où (sous-dossier compris)
// Sortie en script classique (IIFE) : dist/index.html s'ouvre aussi d'un double-clic (file://),
// ce que refuse un <script type="module">.
const fileProtocol = () => ({
  name: 'file-protocol',
  enforce: 'post',
  transformIndexHtml(html) {
    const tag = html.match(/<script type="module"[^>]*><\/script>/)?.[0]
    if (!tag) return html
    const classic = tag.replace(' type="module"', '').replace(' crossorigin', '') .replace('<script', '<script defer')
    return html.replace(tag, '').replace('</body>', `  ${classic}\n</body>`).replace(/ crossorigin(?=[^>]*stylesheet)/, '')
  },
})

export default defineConfig({
  base: './',
  plugins: [react(), fileProtocol()],
  build: { rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } } },
})
