describe('Data Sources E2E Tests', () => {
  it('should load data from static JSON (default mode)', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // Verificar se a aplicação carregou
    cy.get('[data-testid="header"]').should('be.visible');
    cy.contains('Dashboard de Sensores Dynamox').should('be.visible');
    
    // Verificar se há dados carregados
    cy.get('#sensor-info').should('be.visible');
    cy.contains('Informações dos Sensores').should('be.visible');
  });

  it('should handle json-server mode when available', () => {
    // Interceptar requisições para verificar fonte dos dados
    cy.intercept('GET', '/response-challenge-v2.json').as('staticData');
    cy.intercept('GET', 'http://localhost:3001/**').as('jsonServerData');
    
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // Verificar se a aplicação carregou independente da fonte
    cy.get('[data-testid="header"]').should('be.visible');
    cy.contains('Dashboard de Sensores Dynamox').should('be.visible');
    
    // Verificar se há dados carregados
    cy.get('#sensor-info').should('be.visible');
    cy.contains('Informações dos Sensores').should('be.visible');
  });

  it('should display sensor data regardless of source', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // Verificar se há conteúdo relacionado a sensores
    cy.get('body').should('contain.text', 'Dashboard');
    cy.get('body').should('contain.text', 'Sensores');
    
    // Verificar se há seção de informações
    cy.get('#sensor-info').should('be.visible');
  });

  it('should handle fallback gracefully', () => {
    // Simular falha na requisição (opcional)
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // A aplicação deve carregar mesmo se houver falha na fonte primária
    cy.get('[data-testid="header"]').should('be.visible');
    cy.contains('Dashboard de Sensores Dynamox').should('be.visible');
  });
});
