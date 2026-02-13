import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/helpers/test-env.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html']
    }
  }
})
