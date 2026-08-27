import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(rootDir, '../..');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    fs: {
      allow: [workspaceRoot],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@dynamox/shared': path.resolve(workspaceRoot, 'libs/shared/src/index.ts'),
      '@': path.resolve(rootDir, 'src'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
});
