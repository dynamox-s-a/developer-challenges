// Cenários para validar funcionamento dos tooltips
describe('Tooltips funcionamento', () => {

    // Loop para acessar o site antes de cada cenário e evitar repetição de código
    beforeEach(() => {
        cy.openApp();
    });

    // Valida que existe uma classe para tooltip no gráfico de aceleração RMS
    it('Deve exibir tooltip ao passar o mouse sobre o gráfico de Aceleração RMS', () => {
        cy.get('.highcharts-plot-border')
          .eq(0)
          .parent()
          .find('[class*="tooltip"]')
          .should('exist')
    });

    // Valida que existe uma classe para tooltip no gráfico de temperatura  
    it('Deve exibir tooltip ao passar o mouse sobre o gráfico de Temperatura', () => {
        cy.get('.highcharts-plot-border')
          .eq(1)
          .parent()
          .find('[class*="tooltip"]')
          .should('exist')
    });

    // Valida que existe uma classe para tooltip no gráfico de velocidade RMS
    it('Deve exibir tooltip ao passar o mouse sobre o gráfico de Velocidade RMS', () => {
        cy.get('.highcharts-plot-border')
          .eq(2)
          .parent()
          .find('[class*="tooltip"]')
          .should('exist')
    });
});
