/**
 * Config EXCLUSIVA do round-trip ROS (npm run twin:ros): exige API viva E ROS Noetic.
 * `roots` ancorado no rootDir — test-ros/ nunca entra na suíte convencional nem na
 * integração comum, qualquer que seja o caminho do clone.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  roots: ['<rootDir>/test-ros'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  testTimeout: 120000,
};
