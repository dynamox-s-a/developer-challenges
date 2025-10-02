describe('Basic E2E Tests', () => {
  it('should load the application', () => {
    cy.visit('/');
    
    // Verificar se a página carregou
    cy.get('body').should('be.visible');
  });

  it('should display header', () => {
    cy.visit('/');
    
    // Verificar se o header está visível
    cy.get('[data-testid="header"]').should('be.visible');
    
    // Verificar se o título está presente
    cy.contains('Dynamox Dashboard').should('be.visible');
  });

  it('should show responsive navigation', () => {
    cy.visit('/');
    
    // Testar desktop
    cy.viewport(1280, 720);
    cy.get('[data-testid="desktop-menu"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
    
    // Testar mobile
    cy.viewport(375, 667);
    cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
  });

  it('should open mobile menu', () => {
    cy.visit('/');
    cy.viewport(375, 667);
    
    // Abrir menu mobile
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-drawer"]').should('be.visible');
    
    // Fechar menu
    cy.get('body').click(0, 0);
    cy.get('[data-testid="mobile-drawer"]').should('not.be.visible');
  });
});
