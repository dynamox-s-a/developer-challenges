import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * As libs compartilhadas são resolvidas direto no código-fonte: o Vite já compila
 * TypeScript, então o web não precisa esperar o build das bibliotecas.
 */
const resolveFromRoot = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  // O .env do projeto vive na RAIZ do monorepo (documentado no .env.example); sem
  // envDir o Vite só olharia apps/web e o VITE_API_BASE_URL documentado seria inerte.
  envDir: resolveFromRoot('../../'),
  plugins: [react()],
  resolve: {
    alias: {
      '@dynamox/domain': resolveFromRoot('../../libs/domain/src/index.ts'),
      '@dynamox/ui': resolveFromRoot('../../libs/ui/src/index.tsx'),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
