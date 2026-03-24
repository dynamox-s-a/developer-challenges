/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Performs login in the system with default or custom credentials
       * @param username Username (default: 'admin')
       * @param password Password (default: 'admin')
       */
      login(username?: string, password?: string): Chainable<void>;
      
      /**
       * Clears localStorage and performs logout
       */
      logout(): Chainable<void>;
      
      /**
       * Checks if user is authenticated
       */
      checkAuth(): Chainable<void>;
      
      /**
       * Waits for API data loading
       * @param timeout Maximum wait time
       */
      waitForApi(timeout?: number): Chainable<void>;
      
      /**
       * Gets JWT token for tests
       */
      getTestToken(): Chainable<string>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (username = 'admin', password = 'admin') => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/auth/login',
    body: { username, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      window.localStorage.setItem('token', response.body.token);
      cy.log('Login successful');
    } else {
      cy.log('Login failed:', response.body);
      throw new Error('Authentication failed');
    }
  });
});

// Logout command
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
  cy.visit('/login');
  cy.log('Logout successful');
});

// Command to check authentication
Cypress.Commands.add('checkAuth', () => {
  const token = window.localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication failed');
  }
  cy.log('User authenticated');
});

// Command to wait for API
Cypress.Commands.add('waitForApi', (timeout = 10000) => {
  cy.wait('@apiRequest', { timeout });
});

// Command to get test token
Cypress.Commands.add('getTestToken', () => {
  return cy.task('getTestToken');
});

// Export for compatibility
export {};