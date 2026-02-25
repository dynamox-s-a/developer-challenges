describe('Login flow', () => {
  it('Should successfully login and redirect to /events', () => {
    // Visit the application base URL (will default to login if unprotected/protected properly)
    cy.visit('/login');

    // Make sure we are on the login page
    cy.contains('Login').should('be.visible');

    // Use data-testid to target the elements (resilient to design changes)
    cy.get('[data-testid="email-input"]').type('admin@events.com');
    cy.get('[data-testid="password-input"]').type('admin123');

    // Submit the form
    cy.get('[data-testid="login-button"]').click();

    // After successful login, the application should redirect to events
    cy.url().should('include', '/events');

    // Optionally check if the header has loaded indicating authentication
    cy.contains('Upcoming Events').should('be.visible');
  });

  it('Should show an error with invalid credentials', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpass');

    cy.get('[data-testid="login-button"]').click();

    // Should indicate invalid credentials based on the frontend UI logic
    cy.get('[data-testid="error-message"]').should('be.visible');

    // Ensure we stayed on the login page
    cy.url().should('include', '/login');
  });
});
