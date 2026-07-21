describe('Desafio Técnico - Dashboard de Sensores', () => {

    beforeEach(() => {
        // Acessa a aplicação
        cy.visit('https://frontend-test-for-qa.vercel.app');
    });

    it('Deve exibir as informações da máquina (Metadata) no topo', () => {
        // Validações diretas baseadas no texto que está visível na tela
        cy.contains('Máquina 1023').should('be.visible');
        cy.contains('Ponto 20192').should('be.visible');
        cy.contains('200').should('be.visible');
        cy.contains('16g').should('be.visible');
    });

    it('Deve renderizar os 3 gráficos de séries temporais', () => {
        // Valida os títulos principais dos gráficos na tela
        cy.contains('Aceleração RMS').should('be.visible');
        cy.contains('Temperatura').should('be.visible');
        cy.contains('Velocidade RMS').should('be.visible');

        // Valida a presença física dos 3 containers do Highcharts
        cy.get('.highcharts-container').should('have.length', 3);
    });

    it('Deve exibir o tooltip com os valores ao passar o mouse sobre o gráfico', () => {
        cy.get('.highcharts-series-group', { timeout: 10000 }).should('be.visible');

        // Dispara o evento nativo para forçar a renderização do tooltip no DOM
        cy.get('path.highcharts-graph')
            .first()
            .trigger('mouseover', { force: true });

        cy.get('.highcharts-tooltip', { timeout: 10000 })
            .should('exist')
            .and('be.visible');
    });
});