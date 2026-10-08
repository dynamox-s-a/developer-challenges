import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

// Defaults match `docker compose up`; the `e2e` target overrides both through
// CYPRESS_BASE_URL / CYPRESS_API_URL when WEB_PORT / API_PORT are changed.
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'cypress' }),
    baseUrl: 'http://localhost:8080',
    env: {
      API_URL: 'http://localhost:3333/api/v1',
      AUTH_EMAIL: 'admin@dynapredict.com',
      AUTH_PASSWORD: 'dynapredict123',
    },
    viewportWidth: 1280,
    viewportHeight: 800,
    // The stack runs in local containers next to Cypress itself; the 4s
    // default flakes on a loaded machine without catching any extra bugs.
    defaultCommandTimeout: 10_000,
  },
});
