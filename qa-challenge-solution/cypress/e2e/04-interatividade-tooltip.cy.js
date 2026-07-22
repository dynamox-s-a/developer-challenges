describe('US04 - Interatividade e Tooltip nos Gráficos', () => {
    beforeEach(() => {
        cy.visit('https://frontend-test-for-qa.vercel.app');
        cy.get('.highcharts-container', { timeout: 10000 }).should('be.visible');
    });

    it('Deve exibir o tooltip no gráfico de Aceleração RMS', () => {
        cy.get('.highcharts-container').eq(0)
            .find('path.highcharts-graph')
            .first()
            .trigger('mouseover', { force: true });

        cy.get('.highcharts-container').eq(0)
            .find('g.highcharts-tooltip', { timeout: 3000 })
            .should('exist');
    });

    it('Deve exibir o tooltip no gráfico de Temperatura', () => {
        // Valida a exibição do tooltip na série de Temperatura (US04)
        cy.get('.highcharts-container').eq(1)
            .find('path.highcharts-graph')
            .first()
            .trigger('mouseover', { force: true });

        cy.get('.highcharts-container').eq(1)
            .find('g.highcharts-tooltip', { timeout: 3000 })
            .should('exist');
    });

    it('Deve exibir o tooltip no gráfico de Velocidade RMS', () => {
        cy.get('.highcharts-container').eq(2)
            .find('path.highcharts-graph')
            .first()
            .trigger('mouseover', { force: true });

        cy.get('.highcharts-container').eq(2)
            .find('g.highcharts-tooltip', { timeout: 3000 })
            .should('exist');
    });
});