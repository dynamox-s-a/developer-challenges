const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://frontend-test-for-qa.vercel.app',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000
  }
})
