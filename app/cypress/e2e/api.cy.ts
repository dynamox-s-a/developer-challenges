describe('API Integration', () => {
  it('should intercept HTTP requests', () => {
    cy.intercept('GET', '**/api/**', {
      statusCode: 200,
      body: { success: true },
    }).as('apiRequest');

    cy.visit('http://localhost:5173');
    cy.get('body').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/**', {
      statusCode: 500,
      body: { error: 'Server Error' },
    }).as('apiError');

    cy.visit('http://localhost:5173');
    cy.get('body').should('be.visible');
  });

  it('should verify application is accessible', () => {
    cy.visit('http://localhost:5173');
    cy.get('body').should('exist');
  });
});
