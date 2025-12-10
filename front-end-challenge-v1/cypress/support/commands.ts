/// <reference types="cypress" />

// Custom command to login as admin
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').type("admin@events.com");
  cy.get('input[name="password"]').type("admin123");
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/admin");
});

// Custom command to login as reader
Cypress.Commands.add("loginAsReader", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').type("reader@events.com");
  cy.get('input[name="password"]').type("reader123");
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/events");
});

// Custom command to logout
Cypress.Commands.add("logout", () => {
  cy.contains("button", "Logout").click();
  cy.url().should("include", "/login");
});

// Custom command to clear auth state
Cypress.Commands.add("clearAuth", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("auth_token");
    win.localStorage.removeItem("auth_user");
  });
});

// Declare types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>;
      loginAsReader(): Chainable<void>;
      logout(): Chainable<void>;
      clearAuth(): Chainable<void>;
    }
  }
}

export {};
