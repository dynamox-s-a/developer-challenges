
// Comando para acessar o site
Cypress.Commands.add('openApp', () => {
  cy.visit('/');
});

// Comando para validar todos os dados da API no header
Cypress.Commands.add('validateHeaderData', (headerData) => {
  Object.entries(headerData).forEach(([key, value]) => {
      cy.get('.MuiTypography-caption')
        .contains(String(value))
        .should('exist')
        .and('be.visible');
  });
});
