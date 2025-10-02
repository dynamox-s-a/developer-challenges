/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to wait for charts to load
       * @example cy.waitForCharts()
       */
      waitForCharts(): Chainable<void>;
      
      /**
       * Custom command to navigate to chart section
       * @example cy.navigateToChart('acceleration')
       */
      navigateToChart(type: string): Chainable<void>;
    }
  }
}

// Custom command to select by data-cy attribute
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

// Custom command to wait for charts to load
Cypress.Commands.add('waitForCharts', () => {
  // Wait for loading spinner to disappear
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
  
  // Wait for charts to be visible
  cy.get('[data-testid="chart-container"]', { timeout: 10000 }).should('be.visible');
});

// Custom command to navigate to chart section
Cypress.Commands.add('navigateToChart', (type: string) => {
  cy.get(`[data-testid="nav-${type}"]`).click();
  cy.get(`#chart-${type}`).should('be.visible');
});
