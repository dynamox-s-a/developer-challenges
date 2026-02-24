describe('Dashboard - Cabeçalho e gráficos', () => {

  beforeEach(() => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')
  })

  it('deve exibir cabeçalho com informações da máquina e os gráficos', () => {

    // Validar chamada metadata
    cy.intercept('GET', '**/metadata.json').as('getMetadata')

    cy.wait('@getMetadata').then((interception) => {

      const metadata = interception.response.body

      // Validar informações no cabeçalho
      cy.contains(metadata.machine).should('be.visible')
      cy.contains(metadata.spot).should('be.visible')
      cy.contains(metadata.rpm).should('be.visible')
      cy.contains(metadata.dynamicRange).should('be.visible')

      // Interval pode ser null, então validamos comportamento
      if (metadata.interval) {
        cy.contains(metadata.interval).should('be.visible')
      }

    })

    // Validar que existem gráficos renderizados
    // cy.get('.highcharts-container')
    //   .should('have.length.at.least', 1)

    // // Alternativa mais forte:
    // cy.get('.highcharts-series-group')
    //   .should('have.length.at.least', 1)

    // O requisito é exatamente 3 gráficos.
    cy.get('.highcharts-container')
      .should('have.length', 3)

  })

/* 
O que esse teste realmente valida
  A página carrega
  A API /metadata.json responde
  Os dados retornados aparecem no cabeçalho
  Pelo menos um gráfico foi renderizado
  A UI está sincronizada com backend
*/

})