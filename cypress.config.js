const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://frontend-test-for-qa.vercel.app/',
    viewportWidth: 1280,
    viewportHeight: 720
  }
})
