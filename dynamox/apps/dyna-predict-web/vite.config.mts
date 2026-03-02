/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/dyna-predict-web',
  server: {
    port: 5173,
    host: 'localhost',
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
  plugins: [
    react(),
    isProd && sentryVitePlugin({
      org: 'eric-reis-ltda',
      project: 'dyna-predict-web',
      sourcemaps: {
        filesToDeleteAfterUpload: ['./**/*.map'],
      },
    }),
  ].filter(Boolean),
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: isProd ? 'hidden' as const : false,
  },
  test: {
    name: '@dynamox/dyna-predict-web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.d.ts'],
    },
  },
  };
});
