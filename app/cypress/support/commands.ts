// Custom commands for Cypress tests
// You can add reusable commands here

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<Subject>;
      navigateTo(path: string): Chainable<Subject>;
    }
  }
}

// Example custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/');
  // Add your login logic here
});

Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path);
});

export {};
