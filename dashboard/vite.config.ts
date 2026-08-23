import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/data': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        bypass(request) {
          return request.headers.accept?.includes('text/html') ? '/index.html' : undefined
        },
      },
    },
  },
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true },
})
