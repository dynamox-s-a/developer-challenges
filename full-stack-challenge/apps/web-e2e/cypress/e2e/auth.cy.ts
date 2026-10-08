const signIn = (email: string, password: string) => {
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/^password/i).type(password, { log: false });
  cy.findByRole('button', { name: 'Sign in' }).click();
};

describe('Authentication', () => {
  it('sends a signed-out visitor from a private page to the login screen', () => {
    cy.visit('/machines');

    cy.location('pathname').should('eq', '/login');
    cy.findByRole('heading', { name: 'Sign in' }).should('be.visible');
  });

  it('flags empty fields without calling the API', () => {
    cy.intercept('POST', '**/auth/login').as('login');
    cy.visit('/login');

    cy.findByRole('button', { name: 'Sign in' }).click();

    cy.findByText('Email is required').should('be.visible');
    cy.findByText('Password is required').should('be.visible');
    cy.get('@login.all').should('have.length', 0);
  });

  it('rejects wrong credentials and stays on the login screen', () => {
    cy.visit('/login');

    signIn(Cypress.env('AUTH_EMAIL'), 'not-the-password');

    cy.findByRole('alert').should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });

  it('signs in, keeps the session across a reload and signs out', () => {
    cy.visit('/login');

    signIn(Cypress.env('AUTH_EMAIL'), Cypress.env('AUTH_PASSWORD'));

    cy.location('pathname').should('eq', '/machines');
    cy.findByRole('heading', { level: 1, name: 'Machines' }).should(
      'be.visible',
    );

    cy.reload();
    cy.location('pathname').should('eq', '/machines');

    cy.findByRole('button', { name: 'Sign out' }).click();
    cy.location('pathname').should('eq', '/login');

    // The cookie is gone, not just the client state.
    cy.visit('/monitoring-points');
    cy.location('pathname').should('eq', '/login');
  });

  it('returns to the page that was requested before signing in', () => {
    cy.visit('/monitoring-points');
    cy.location('pathname').should('eq', '/login');

    signIn(Cypress.env('AUTH_EMAIL'), Cypress.env('AUTH_PASSWORD'));

    cy.location('pathname').should('eq', '/monitoring-points');
    cy.findByRole('heading', { level: 1, name: 'Monitoring points' }).should(
      'be.visible',
    );
  });
});
