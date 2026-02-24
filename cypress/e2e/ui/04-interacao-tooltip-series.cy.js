describe('Dashboard - Tooltip Velocidade (dados reais)', () => {

  it('deve exibir o tooltip ao passar o mouse sobre um ponto do gráfico de Velocidade', () => {

    cy.intercept('GET', '**/data.json').as('getData')
    cy.intercept('GET', '**/metadata.json').as('getMetadata')

    cy.visit('https://frontend-test-for-qa.vercel.app/')

    cy.wait('@getData')
    cy.wait('@getMetadata')

    // Gráfico de Velocidade (index 2)
    cy.get('.highcharts-container')
      .eq(2)
      .should('be.visible')
      .within(() => {

        // Aguarda os pontos existirem
        cy.get('path.highcharts-point')
          .should('have.length.greaterThan', 0)
          .first()
          .trigger('mouseover', { force: true })

      })

    // Tooltip deve aparecer
    cy.get('.highcharts-tooltip')
      .should('exist')
      .and('be.visible')

  })

})