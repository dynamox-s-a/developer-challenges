describe('Análise de Dados', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/data.json').as('getData')
    cy.intercept('GET', '**/metadata.json').as('getMetadata')

    cy.visit('/')
  })

  it('deve carregar a tela de análise de dados', () => {
    cy.contains('Análise de dados')
      .should('be.visible')
  })

  it('deve carregar os dados através das APIs', () => {
    cy.wait('@getData')
      .its('response.statusCode')
      .should('eq', 200)

    cy.wait('@getMetadata')
      .its('response.statusCode')
      .should('eq', 200)
  })

  it('deve exibir os três gráficos de séries temporais', () => {
    cy.contains('Aceleração RMS')
      .should('be.visible')

    cy.contains('Temperatura')
      .should('be.visible')

    cy.contains('Velocidade RMS')
      .should('be.visible')
  })

  it('deve exibir as informações da máquina no cabeçalho', () => {
    cy.contains('Máquina 1023')
      .should('be.visible')

    cy.contains('Ponto 20192')
      .should('be.visible')

    cy.contains('16g')
      .should('be.visible')
  })

  it('deve carregar os dados novamente ao acessar a página', () => {
    cy.wait('@getData')
    cy.wait('@getMetadata')

    cy.reload()

    cy.wait('@getData')
      .its('response.statusCode')
      .should('eq', 200)

    cy.wait('@getMetadata')
      .its('response.statusCode')
      .should('eq', 200)
  })

  it('deve identificar os elementos do gráfico para interação', () => {
    cy.get('.highcharts-container')
      .first()
      .should('be.visible')
      .then(($chart) => {

        const series = $chart.find('.highcharts-series')
        const paths = $chart.find('path')
        const circles = $chart.find('circle')
        const points = $chart.find('.highcharts-point')

        cy.log(`Séries encontradas: ${series.length}`)
        cy.log(`Paths encontrados: ${paths.length}`)
        cy.log(`Circles encontrados: ${circles.length}`)
        cy.log(`Pontos encontrados: ${points.length}`)

        expect(series.length).to.be.greaterThan(0)
        expect(paths.length).to.be.greaterThan(0)
      })
  })

})