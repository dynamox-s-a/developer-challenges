// Support file for E2E tests
// This file is loaded before all E2E spec files

// Disable uncaught exception handling for Cypress tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

// Add custom commands here if needed
