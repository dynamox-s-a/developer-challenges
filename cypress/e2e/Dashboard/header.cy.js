// Cenários para validar informações do Header
describe('Header com informações da Máquina', () => {

  // Loop para acessar o site antes de cada cenário e evitar repetição de código
  beforeEach(() => {
    cy.openApp();
  });

  // Usa comando personalizado para comparar os dados recebidos da api e o que é renderizado na UI
  it('Deve exibir header conforme dados recebidos da API', () => {

    cy.request('/metadata.json').then((response) => {
      const apiData = response.body;
      cy.validateHeaderData(apiData);

    });
  });

  // Valida se os ícones svg do header estão visíveis na UI
  it('Deve exibir todos os ícones SVG no header', () => {

    cy.get('.MuiBox-root.css-1f62mcz')
      .find('svg')
      .should('have.length', 5)
      .each(($icon) => {
    cy.wrap($icon).should('be.visible')

    });
  });
});