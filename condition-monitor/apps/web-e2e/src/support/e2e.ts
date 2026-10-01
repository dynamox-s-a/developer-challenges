import './commands';

/**
 * Each test starts from the same data: the two seeded users and the `DRY` sector, and
 * nothing else. A test builds the state it needs, so tests do not depend on each other.
 */
beforeEach(() => {
  cy.task('db:reset');
});
