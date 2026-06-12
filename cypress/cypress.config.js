const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

  baseUrl: 'https://frontend-test-for-qa.vercel.app/',
  
  },
});
