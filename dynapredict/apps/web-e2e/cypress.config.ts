const { nxE2EPreset } = require('@nx/cypress/plugins/cypress-preset');
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: process.env['CI']
          ? 'npx nx run @dynapredict/web:preview'
          : 'npx nx run @dynapredict/web:dev',
        production: 'npx nx run @dynapredict/web:preview',
      },
      ciWebServerCommand: 'npx nx run @dynapredict/web:preview',
      ciBaseUrl: 'http://localhost:4300',
    }),
    baseUrl: process.env['CI']
      ? 'http://localhost:4300'
      : 'http://localhost:4200',
  },
});
