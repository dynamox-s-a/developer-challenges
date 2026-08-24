import { defineConfig } from 'cypress';

export default defineConfig({
	allowCypressEnv: false,
	e2e: {
		baseUrl: 'http://127.0.0.1:5173',
		fixturesFolder: false,
		specPattern: 'cypress/e2e/**/*.cy.ts',
		supportFile: 'cypress/support/e2e.ts',
	},
	screenshotOnRunFailure: true,
	video: true,
	videosFolder: 'cypress/videos',
	screenshotsFolder: 'cypress/screenshots',
	viewportHeight: 720,
	viewportWidth: 1280,
});
