import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: "./"
});

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
}

export default createJestConfig(config);