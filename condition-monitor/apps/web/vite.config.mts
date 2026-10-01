/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The browser only ever talks to this origin: /api is forwarded to the API, so the
// SameSite=Strict session cookie is sent (ADR 0008). API_URL overrides the target.
const apiTarget = process.env.API_URL ?? 'http://localhost:3000';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: { '/api': { target: apiTarget, changeOrigin: true } },
  },
  preview: {
    port: 4200,
    host: 'localhost',
    proxy: { '/api': { target: apiTarget, changeOrigin: true } },
  },
  plugins: [react()],
  // Workspace libraries expose their TypeScript source under this condition, so the app
  // and its tests always use the current code of libs/shared, without a prior build.
  resolve: {
    conditions: ['@condition-monitor/source', 'module', 'browser', 'development|production'],
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // Above the 5 s a findBy may wait (test-setup.ts), so a slow screen fails on its own message.
    testTimeout: 15000,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
