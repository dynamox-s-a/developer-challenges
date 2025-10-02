describe('Data Loading E2E Tests', () => {
  it('should load sensor data from JSON file', () => {
    cy.visit('/');
    
    // Verificar se o loading spinner aparece inicialmente
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    
    // Aguardar o carregamento dos dados
    cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('not.exist');
    
    // Verificar se os gráficos aparecem
    cy.get('[data-testid="chart-container"]', { timeout: 10000 }).should('be.visible');
    
    // Verificar se pelo menos um gráfico tem dados
    cy.get('#chart-acceleration').should('be.visible');
    cy.contains('Aceleração').should('be.visible');
  });

  it('should display sensor information with data', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('not.exist');
    
    // Verificar seção de informações
    cy.get('#sensor-info').should('be.visible');
    cy.contains('Informações dos Sensores').should('be.visible');
    
    // Verificar se há dados de sensores
    cy.contains('Total de medições:').should('be.visible');
  });

  it('should handle JSON data loading', () => {
    // Interceptar a requisição do JSON
    cy.intercept('GET', '/response-challenge-v2.json').as('getSensorData');
    
    cy.visit('/');
    
    // Aguardar a requisição do JSON
    cy.wait('@getSensorData', { timeout: 10000 });
    
    // Verificar se os dados foram carregados
    cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('not.exist');
    cy.get('[data-testid="chart-container"]').should('be.visible');
  });
});
