import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'npx nx run @dynamox/dyna-predict-web:dev',
        production: 'npx nx run @dynamox/dyna-predict-web:preview',
      },
      ciWebServerCommand: 'npx nx run @dynamox/dyna-predict-web:preview',
      ciBaseUrl: 'http://localhost:5173',
    }),
    baseUrl: 'http://localhost:5173',
  },
});
