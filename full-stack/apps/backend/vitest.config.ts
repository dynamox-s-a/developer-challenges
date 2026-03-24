import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/__tests__/**/*.ts", "src/**/__tests__/**/*.tsx"],
    exclude: ["dist/**", "node_modules/**", "src/**/__tests__/helpers/**"],
  },
});
