import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/store/index.ts',
    '!src/store/hooks.ts',
    '!src/store/slices/index.ts',
    '!src/store/slices/__tests__/*',
    '!src/store/slices/__test__/*',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/app/globals.css',
    '!src/app/(auth)/layout.tsx',
    '!src/app/(app)/layout.tsx',
    '!src/app/(app)/admin/layout.tsx',
    '!src/app/(app)/admin/page.tsx',
    '!src/app/(app)/admin/[id]/page.tsx',
    '!src/app/(app)/admin/[id]/edit/page.tsx',
    '!src/app/(app)/admin/[id]/edit/__test__/edit.test.tsx',
    '!src/app/(app)/admin/[id]/edit/__test__/edit.test.tsx',
    '!src/app/(app)/admin/[id]/edit/__test__/edit.test.tsx',
  ],
};

export default createJestConfig(config);
