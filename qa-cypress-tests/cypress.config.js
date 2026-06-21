const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://frontend-test-for-qa.vercel.app",
    specPattern: "cypress/e2e/**/*.cy.js",
    viewportWidth: 1366,
    viewportHeight: 768,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
