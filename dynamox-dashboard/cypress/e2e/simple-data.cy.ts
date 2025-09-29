describe('Simple Data Tests', () => {
  it('should load the application and show content', () => {
    cy.visit('/');
    
    // Verificar se a página carregou
    cy.get('body').should('be.visible');
    
    // Aguardar um pouco para o carregamento
    cy.wait(2000);
    
    // Verificar se há conteúdo na página
    cy.get('[data-testid="header"]').should('be.visible');
    
    // Verificar se o título está presente
    cy.contains('Dynamox Dashboard').should('be.visible');
  });

  it('should have sensor data loaded', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // Verificar se há seção de informações
    cy.get('#sensor-info').should('be.visible');
    
    // Verificar se há algum conteúdo relacionado a sensores
    cy.contains('Informações dos Sensores').should('be.visible');
  });

  it('should display basic content', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(3000);
    
    // Verificar se há conteúdo básico
    cy.get('body').should('contain.text', 'Dashboard');
    cy.get('body').should('contain.text', 'Sensores');
  });
});
