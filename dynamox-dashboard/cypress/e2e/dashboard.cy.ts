describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display dashboard title', () => {
    cy.contains('Dashboard de Sensores Dynamox').should('be.visible');
  });

  it('should show loading state initially', () => {
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
  });

  it('should display charts after data loads', () => {
    // Wait for loading to complete
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
    
    // Wait for charts to be visible
    cy.get('[data-testid="chart-container"]', { timeout: 10000 }).should('be.visible');
    
    // Check if acceleration chart is visible
    cy.get('#chart-acceleration').should('be.visible');
    cy.contains('Aceleração').should('be.visible');
    
    // Check if velocity chart is visible
    cy.get('#chart-velocity').should('be.visible');
    cy.contains('Velocidade').should('be.visible');
    
    // Check if temperature chart is visible
    cy.get('#chart-temperature').should('be.visible');
    cy.contains('Temperatura').should('be.visible');
  });

  it('should display sensor information section', () => {
    // Wait for loading to complete
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
    
    cy.get('#sensor-info').should('be.visible');
    cy.contains('Informações dos Sensores').should('be.visible');
  });
});
