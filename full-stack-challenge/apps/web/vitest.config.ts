import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@dynamox/shared': path.resolve(__dirname, '../../libs/shared/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
