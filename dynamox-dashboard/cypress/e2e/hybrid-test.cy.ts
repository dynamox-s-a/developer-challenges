describe('Hybrid Data Source Test', () => {
  it('should work with both data sources', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(5000);
    
    // Verificar elementos básicos
    cy.get('body').should('be.visible');
    cy.get('body').should('contain.text', 'Dynamox');
    
    // Verificar se há header
    cy.get('[data-testid="header"]').should('be.visible');
    
    // Verificar se há conteúdo de sensores
    cy.get('body').should('contain.text', 'Sensores');
  });

  it('should load data successfully', () => {
    cy.visit('/');
    
    // Aguardar carregamento
    cy.wait(5000);
    
    // Verificar se há seção de informações
    cy.get('#sensor-info').should('be.visible');
    
    // Verificar se há algum conteúdo relacionado a dados
    cy.get('body').should('contain.text', 'Informações');
  });
});
