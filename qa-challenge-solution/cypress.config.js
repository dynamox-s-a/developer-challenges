const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false, // <-- Esta é a linha mágica que resolve o erro
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
