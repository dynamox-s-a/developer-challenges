/// <reference types="cypress" />

// Custom command to login as admin
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/login");
  cy.get('[data-testid="email-input"]').should("be.visible");
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type("admin@events.com", {
    delay: 0,
  });
  cy.get('[data-testid="password-input"]').should("be.visible");
  cy.get('[data-testid="password-input"]').clear();
  cy.get('[data-testid="password-input"]').type("admin123", { delay: 0 });
  cy.get('[data-testid="login-button"]').should("be.visible").click();
  cy.url({ timeout: 15000 }).should("include", "/admin");
});

// Custom command to login as reader
Cypress.Commands.add("loginAsReader", () => {
  cy.visit("/login");
  cy.get('[data-testid="email-input"]').should("be.visible");
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type("reader@events.com", {
    delay: 0,
  });
  cy.get('[data-testid="password-input"]').should("be.visible");
  cy.get('[data-testid="password-input"]').clear();
  cy.get('[data-testid="password-input"]').type("reader123", { delay: 0 });
  cy.get('[data-testid="login-button"]').should("be.visible").click();
  cy.url({ timeout: 15000 }).should("include", "/events");
});

// Custom command to logout
Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout-button"]').should("be.visible").click();
  cy.url().should("include", "/login");
});

// Custom command to clear auth state
Cypress.Commands.add("clearAuth", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("event_management_auth");
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
