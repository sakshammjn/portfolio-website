import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// `base` controls the public path the app is served from.
//   - Vercel / custom domain:        leave as '/' (default)
//   - GitHub Pages project site:     set VITE_BASE="/<repo-name>/" at build time
//     e.g. `VITE_BASE=/portfolio-website/ npm run build`
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
