import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* Static sub-sites that live in public/<name>/index.html (Fieldwork = cohort,
   Students = students). In production the static host resolves /cohort/ to its
   index.html; Vite's dev server does not, so its SPA fallback wrongly serves
   the React app. This dev-only middleware rewrites those directory requests to
   the real static file so local preview matches the deployed site. */
const STATIC_SUBDIRS = ['cohort', 'students']

function serveStaticSubdirs(): PluginOption {
  return {
    name: 'serve-static-subdirs',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url ?? '').split('?')[0].replace(/\/+$/, '')
        const name = path.replace(/^\//, '')
        if (STATIC_SUBDIRS.includes(name)) {
          req.url = `/${name}/index.html`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [serveStaticSubdirs(), react(), tailwindcss()],
})
