import './commands';

// Disable uncaught exception handling for component tests
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
