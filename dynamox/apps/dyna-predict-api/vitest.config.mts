import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dyna-predict-api',
  test: {
    name: '@dynamox/dyna-predict-api',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    setupFiles: ['tests/shared/setup.ts'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/prisma/generated/**', 'src/main.ts', 'src/app.ts', 'src/shared/types/fastify.d.ts'],
    }
  },
}));
