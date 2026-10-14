import { defineConfig } from "cypress";
import { config as loadDotEnv } from "dotenv";
import { fileURLToPath } from "node:url";

const resolvePath = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

// The seeded credentials live in the workspace .env, the same file the API reads.
loadDotEnv({ path: resolvePath("../../.env"), quiet: true });

/**
 * End-to-end configuration.
 *
 * The suite drives the real application: the Vite dev server on 4200, which
 * proxies `/api` to the Express API, which talks to PostgreSQL. Nothing is
 * stubbed — that is the point of these tests, and what distinguishes them from
 * the component tests in `apps/web`.
 */
export default defineConfig({
  e2e: {
    baseUrl: process.env.E2E_BASE_URL ?? "http://localhost:4200",
    specPattern: resolvePath("./src/e2e/**/*.cy.ts"),
    supportFile: resolvePath("./src/support/e2e.ts"),
    fixturesFolder: false,
    screenshotsFolder: resolvePath("../../dist/cypress/screenshots"),
    videosFolder: resolvePath("../../dist/cypress/videos"),
    // Videos cost time on every run and add little when a failure already
    // captures a screenshot.
    video: false,
    viewportWidth: 1440,
    viewportHeight: 900,
    retries: { runMode: 1, openMode: 0 },
    env: {
      seedEmail: process.env.SEED_USER_EMAIL,
      seedPassword: process.env.SEED_USER_PASSWORD,
    },
  },
});
