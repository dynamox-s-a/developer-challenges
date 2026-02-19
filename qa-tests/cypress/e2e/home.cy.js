describe('Dashboard - Monitoramento de Sensores', () => {

beforeEach(() => {
  cy.intercept('GET', '**/data.json').as('getData')
  cy.intercept('GET', '**/metadata.json').as('getMetadata')

  cy.visit('https://frontend-test-for-qa.vercel.app/')
})


  it('Deve carregar a página corretamente', () => {
    cy.url().should('include', 'frontend-test-for-qa')
  })

  it('Deve realizar as requisições necessárias com sucesso', () => {
    cy.wait('@getData').its('response.statusCode').should('eq', 200)
    cy.wait('@getMetadata').its('response.statusCode').should('eq', 200)
  })

  it('Deve exibir os três gráficos obrigatórios', () => {
    cy.contains('Aceleração RMS').should('be.visible')
    cy.contains('Velocidade RMS').should('be.visible')
    cy.contains('Temperatura').should('be.visible')
  })

})
