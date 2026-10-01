/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

/**
 * Logs in through the API and keeps the session cookie for the next `cy.visit`, the fast
 * way to reach a screen that needs a session. The login screen itself is exercised by the
 * full-flow spec through the form.
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password })
    .its('status')
    .should('eq', 204);
});

/** Logs in as one of the two seeded accounts. */
Cypress.Commands.add('loginAs', (account: 1 | 2) => {
  cy.login(Cypress.env(`user${account}Email`), Cypress.env(`user${account}Password`));
});

/** A request that is expected to fail, read without failing the test on the status. */
Cypress.Commands.add('api', (method: string, path: string, body?: unknown) =>
  cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${path}`,
    body: body as Cypress.RequestBody,
    failOnStatusCode: false,
  }),
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAs(account: 1 | 2): Chainable<void>;
      api(method: string, path: string, body?: unknown): Chainable<Cypress.Response<unknown>>;
    }
  }
}

export {};
