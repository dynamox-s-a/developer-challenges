const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://frontend-test-for-qa.vercel.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
