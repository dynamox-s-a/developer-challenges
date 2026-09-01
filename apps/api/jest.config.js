/**
 * As libs compartilhadas são resolvidas pelo node_modules do workspace, a partir do
 * build publicado em dist. O alvo `test` depende de `^build` no nx.json, então o Nx
 * garante que elas estejam compiladas antes dos testes rodarem.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  testEnvironment: 'node',
  testTimeout: 30000,
};
