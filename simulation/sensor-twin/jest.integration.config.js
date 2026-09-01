/**
 * Config EXCLUSIVA da integração contra a API viva (npm run twin:integration).
 * `roots` ancorado no rootDir: só test/ entra aqui, qualquer que seja o caminho do clone.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  roots: ['<rootDir>/test'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  testTimeout: 30000,
};
