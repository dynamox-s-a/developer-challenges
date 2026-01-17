describe('Fluxo de Usuário Completo', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
  });

  it('Deve conseguir logar e criar uma nova máquina', () => {
    // Verifica se está na tela de login
    cy.contains('DynaPredict');
    
    // Preenche o formulário 
    cy.get('#email').type('admin@dynamox.net');
    cy.get('#password').type('admin');
    
    // Clica no botão de entrar
    cy.get('button[type="submit"]').click();

    // Verifica se redirecionou e se tem o título
    cy.url().should('include', '/machines');
    cy.contains('Minhas Máquinas').should('be.visible');

    // Clica no botão "Nova Máquina"
    cy.contains('button', 'Nova Máquina').click();

    
    cy.contains('label', 'Nome da Máquina')
      .parent()
      .find('input')
      .type('Máquina Cypress E2E');
    
    cy.contains('label', 'Tipo de Máquina')
      .parent()
      .click() // Clica no container para abrir o select
      .get('li[data-value="Fan"]') 
      .click();
    // Salva
    cy.contains('button', 'Salvar').click();

    // Verifica se a máquina apareceu na tabela
    cy.contains('Máquina Cypress E2E').should('be.visible');
    cy.contains('Fan').should('be.visible');
  });
});