const { readFileSync } = require('fs');

// Integration tests need a running PostgreSQL (docker compose up -d); unit tests do not.
const swcJestConfig = JSON.parse(readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8'));
swcJestConfig.swcrc = false;

module.exports = {
  displayName: 'api-integration',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.integration.spec.ts'],
  globalSetup: '<rootDir>/test/integration-global-setup.ts',
  setupFiles: ['<rootDir>/test/integration-setup.ts'],
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
