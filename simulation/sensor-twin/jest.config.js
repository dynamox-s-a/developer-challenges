/**
 * Unitários do gêmeo (src/**): puros — sem rede, sem banco, sem ROS — e por isso
 * seguros na suíte global. A integração contra a API viva mora em test/ (script
 * test:integration) e o round-trip ROS em test-ros/ (script test:ros); nenhum dos
 * dois roda pelo target test padrão.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  // Ancorado no rootDir do pacote, NUNCA em substring do caminho absoluto do clone:
  // um repositório clonado sob ~/src/... não pode arrastar a integração para cá.
  testPathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/test-ros/', '/node_modules/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  testTimeout: 30000,
};
