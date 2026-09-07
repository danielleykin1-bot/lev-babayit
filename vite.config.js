import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'test' && {
      name: 'remove-external-font-imports-in-test-mode',
      enforce: 'pre',
      transform(source, id) {
        if (!id.endsWith('/src/App.css')) return null
        return source.replace(/^@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);\n?/, '')
      },
    },
  ].filter(Boolean),
}))
