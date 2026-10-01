/**
 * The harness itself: the web app, the API, the proxy between them, the database and the
 * two seeded accounts. If this passes, the other specs have a working application to test.
 */
describe('end-to-end harness', () => {
  it('serves the login screen and reaches the API through it', () => {
    cy.request(`${Cypress.env('apiUrl')}/health`)
      .its('body.status')
      .should('eq', 'ok');
    cy.visit('/login');
    cy.contains('h1, h2, h3, h4, h5, h6', 'Condition Monitor');
    cy.contains('button', 'Sign in');
  });

  it('starts each test from a clean database with the DRY sector', () => {
    cy.loginAs(1);
    cy.request(`${Cypress.env('apiUrl')}/sectors`)
      .its('body')
      .should('have.length', 1);
    cy.request(`${Cypress.env('apiUrl')}/machines?page=1&pageSize=10`)
      .its('body.total')
      .should('eq', 0);
  });

  it('logs both seeded users in, and keeps their data apart', () => {
    cy.loginAs(2);
    // The second user has no sector of their own: the DRY sector belongs to the first.
    cy.request(`${Cypress.env('apiUrl')}/sectors`)
      .its('body')
      .should('have.length', 0);
  });
});
