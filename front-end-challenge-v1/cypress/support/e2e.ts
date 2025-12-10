// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands";
import "@testing-library/cypress/add-commands";

// Handle uncaught exceptions - ignore React hydration errors
// These occur due to server/client date formatting differences and don't affect functionality
Cypress.on("uncaught:exception", (err) => {
  // Ignore React hydration mismatch errors
  if (err.message.includes("Hydration failed")) {
    return false;
  }
  if (err.message.includes("server rendered HTML didn't match")) {
    return false;
  }
  if (err.message.includes("Text content did not match")) {
    return false;
  }
  // Return true to fail the test for other errors
  return true;
});
