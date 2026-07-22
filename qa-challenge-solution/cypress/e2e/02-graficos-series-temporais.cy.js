describe('US02 - Gráficos de Séries Temporais', () => {
    beforeEach(() => {
        cy.visit('https://frontend-test-for-qa.vercel.app');
    });

    it('Deve renderizar os gráficos de Aceleração RMS, Temperatura e Velocidade RMS', () => {
        cy.contains('Aceleração RMS').should('be.visible');
        cy.contains('Temperatura').should('be.visible');
        cy.contains('Velocidade RMS').should('be.visible');

        cy.get('.highcharts-container').should('have.length', 3);
    });

    it('Deve exibir os seletores de eixos (Axial, Horizontal, Radial) nos gráficos aplicáveis', () => {
        cy.contains('Axial').should('be.visible');
        cy.contains('Horizontal').should('be.visible');
        cy.contains('Radial').should('be.visible');
    });
});