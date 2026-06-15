// Cenários para validar visualização dos gráficos
describe('Gráficos Aceleração RMS, Temperatura e Velocidade RMS', () => {

  // Loop para acessar o site antes de cada cenário e evitar repetição de código
  beforeEach(() => {
    cy.openApp();
  });

  // Valida existência do container e título do gráfico de aceleração RMS
  it('Deve exibir gráfico de Aceleração RMS', () => {
    cy.get('.MuiBox-root.css-8kcdd8')
      .eq(0)
      .should('be.visible')
    cy.contains('Aceleração RMS')
      .should('be.visible')
  });

  // Valida existência do container e título do gráfico de temperatura
  it('Deve exibir gráfico de Temperatura', () => {
    cy.get('.MuiBox-root.css-8kcdd8')
      .eq(1)
      .should('be.visible')
    cy.contains('Temperatura')
      .should('be.visible')
  });

  // Valida existência do container e título do gráfico de velocidade RMS
  it('Deve exibir gráfico de Velocidade RMS', () => {
    cy.get('.MuiBox-root.css-8kcdd8')
      .eq(0)
      .should('be.visible')
    cy.contains('Velocidade RMS')
        .should('be.visible')
  });
});