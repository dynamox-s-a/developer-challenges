describe('Dashboard - Gráficos obrigatórios', () => {

  beforeEach(() => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')
  })

  it('deve exibir 3 gráficos: Aceleração RMS, Velocidade RMS e Temperatura', () => {

    // Valida que existem 3 gráficos
    cy.get('.highcharts-container')
      .should('have.length', 3)

    // Valida os títulos esperados
    cy.contains(/Aceleração RMS/i).should('be.visible')
    cy.contains(/Velocidade RMS/i).should('be.visible')
    cy.contains(/Temperatura/i).should('be.visible')

    // Valida que cada gráfico
    cy.get('.highcharts-series-group')
      .should('have.length', 3)

  })
  /*
  O que esse teste cobre
    Estrutura do dashboard
    Presença dos 3 gráficos obrigatórios
    Renderização visual
    Existência de séries (dados plotados)
  */
})