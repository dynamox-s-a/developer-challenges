import { defineConfig } from "cypress";

export default defineConfig({
  // General settings
  allowCypressEnv: false,
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,

  // Configuration for E2E tests
  e2e: {
    // Base URL for tests
    baseUrl: 'http://localhost:5173',
    
    // Support files
    supportFile: 'apps/frontend/cypress/support/e2e.ts',
    
    // Test specs pattern
    specPattern: 'apps/frontend/cypress/e2e/**/*.cy.ts',
    
    // Fixtures for test data
    fixturesFolder: 'apps/frontend/cypress/fixtures',
    
    // Videos and screenshots
    videosFolder: 'apps/frontend/cypress/videos',
    screenshotsFolder: 'apps/frontend/cypress/screenshots',
    
    // Environment configuration
    env: {
      // Backend URL for tests
      backendUrl: 'http://localhost:3001',
      
      // Default credentials for tests
      defaultUsername: 'admin',
      defaultPassword: 'admin',
      
      // Timeout for async operations
      asyncTimeout: 5000,
      
      // Retry settings
      retryAttempts: 3,
      
      // Pagination settings
      defaultPageSize: 5,
      
      // Time configurations
      timeSeriesIntervals: {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      }
    },
    
    // Custom event listeners
    setupNodeEvents(on, config) {
      // Plugin for custom reports
      on('after:spec', (spec, results) => {
        if (results.stats.failures === 0) {
          console.log(`Test passed: ${spec.name}`);
        } else {
          console.log(`Test failed: ${spec.name} - ${results.stats.failures} failures`);
        }
      });
      
      // Plugin for data cleanup between tests
      on('task', {
        // Clear backend data between tests
        async clearTestData() {
          // Implement cleanup if needed
          return null;
        },
        
        // Get test token
        async getTestToken() {
          const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: config.env.defaultUsername,
              password: config.env.defaultPassword,
            }),
          });
          
          const data = await response.json();
          return data.token;
        },
        
        // Check backend health
        async checkBackendHealth() {
          try {
            const response = await fetch('http://localhost:3001/health');
            return response.ok;
          } catch {
            return false;
          }
        },
      });
      
      // Configure reporters
      config.reporter = 'spec';
      config.reporterOptions = {
        reportDir: 'apps/frontend/cypress/reports',
        reportFilename: 'cypress-report',
        overwrite: false,
      };
      
      return config;
    },
  },

  // Configuration for component tests (if needed in the future)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
