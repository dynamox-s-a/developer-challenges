// ***********************************************************
// Support file for E2E tests
// Automatically loaded before tests
// ***********************************************************

// Import custom commands
import './commands';

// Global settings before each test
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();
  
  cy.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('fetch') || err.message.includes('CORS')) {
      return false;
    }
    return true;
  });
  
  cy.intercept('GET', '**/api/**', (req) => {
    req.alias = 'apiRequest';
  });
  
  cy.log('Test setup completed');
});

afterEach(() => {
  cy.clearLocalStorage();
  cy.log('Test cleanup completed');
});

before(() => {
  cy.task('checkBackendHealth').then((isHealthy) => {
    if (!isHealthy) {
      throw new Error('Backend is not available. Start with: ./scripts/up.sh');
    }
  });
  
  cy.log('Test suite started');
});


after(() => {
  cy.log('Test suite completed');
});

export const testConfig = {
  baseUrl: 'http://localhost:5173',
  backendUrl: 'http://localhost:3001',
  defaultUser: {
    username: 'admin',
    password: 'admin',
  },
  timeouts: {
    short: 3000,
    medium: 10000,
    long: 30000,
  },
};