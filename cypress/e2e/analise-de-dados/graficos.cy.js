describe('Validação de Gráficos', () => {
  beforeEach(() => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')
    cy.get('.MuiTypography-subtitle1')
      .should('be.visible') 
      .and('contain.text', 'Análise de dados')
  })

  it('Validação do campo Aceleração RMS', () => {
    cy.get('.css-1jgrw03 > :nth-child(1)')
      .should('be.visible')
      .and('contain.text', 'Aceleração RMS')
  })

   it('Validação do campo Temperatura', () => {
    cy.get('.css-1jgrw03 > :nth-child(2)')
      .should('be.visible')
      .and('contain.text', 'Temperatura')
  })

  it('Validação do campo Velocidade RMS', () => {
    cy.get('.css-1jgrw03 > :nth-child(3)')
      .should('be.visible')
      .and('contain.text', 'Velocidade RMS')
  })



})
