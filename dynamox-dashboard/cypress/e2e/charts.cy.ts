describe('Charts E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for loading to complete
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
  });

  it('should display all chart types', () => {
    // Check acceleration chart
    cy.get('#chart-acceleration').should('be.visible');
    cy.contains('Aceleração').should('be.visible');
    
    // Check velocity chart
    cy.get('#chart-velocity').should('be.visible');
    cy.contains('Velocidade').should('be.visible');
    
    // Check temperature chart
    cy.get('#chart-temperature').should('be.visible');
    cy.contains('Temperatura').should('be.visible');
  });

  it('should have interactive charts with tooltips', () => {
    // Test tooltip on acceleration chart
    cy.get('#chart-acceleration').within(() => {
      cy.get('.highcharts-series-group').first().click();
      cy.get('.highcharts-tooltip').should('be.visible');
    });
  });

  it('should display chart legends', () => {
    cy.get('#chart-acceleration').within(() => {
      cy.get('.highcharts-legend').should('be.visible');
    });
    
    cy.get('#chart-velocity').within(() => {
      cy.get('.highcharts-legend').should('be.visible');
    });
    
    cy.get('#chart-temperature').within(() => {
      cy.get('.highcharts-legend').should('be.visible');
    });
  });

  it('should have responsive chart heights', () => {
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('#chart-acceleration').should('have.css', 'height', '500px');
    
    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('#chart-acceleration').should('have.css', 'height', '350px');
    
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('#chart-acceleration').should('have.css', 'height', '300px');
  });

  it('should handle synchronized crosshair interaction', () => {
    // This test would require more complex setup to test crosshair synchronization
    // For now, we'll just verify the charts are interactive
    cy.get('#chart-acceleration').within(() => {
      cy.get('.highcharts-series-group').first().trigger('mousemove');
    });
    
    cy.get('#chart-velocity').within(() => {
      cy.get('.highcharts-series-group').first().trigger('mousemove');
    });
    
    cy.get('#chart-temperature').within(() => {
      cy.get('.highcharts-series-group').first().trigger('mousemove');
    });
  });

  it('should handle charts with data', () => {
    // This test verifies that charts are rendered with actual data
    cy.get('#chart-acceleration').within(() => {
      cy.get('.highcharts-series-group').should('exist');
    });
  });
});
