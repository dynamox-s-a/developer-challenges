/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Muda para porta 3000
  },
  // Configuração para servir arquivos da pasta data
  publicDir: 'public',
  assetsInclude: ['**/*.json'],
  // Configuração do Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
