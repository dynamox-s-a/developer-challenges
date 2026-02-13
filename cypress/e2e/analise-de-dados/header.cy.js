describe('Validação de cabeçalhos', () => {
  beforeEach(() => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')
    cy.get('.MuiTypography-subtitle1')
      .should('be.visible') 
      .and('contain.text', 'Análise de dados')
  })

  it('Validação do campo máquina', () => {
    cy.get('.css-1f62mcz > :nth-child(1) > .MuiTypography-root')
      .should('be.visible')
      .and('contain.text', 'Máquina')
  })

   it('Validação do campo Ponto', () => {
    cy.get(':nth-child(3) > .MuiTypography-root')
      .should('be.visible')
      .and('contain.text', 'Ponto')
  })

  it('Validação do campo rpm 200', () => {
    cy.get(':nth-child(5) > .MuiTypography-root')
      .should('be.visible')
      .and('contain.text', '200')
  })

it('Validação do campo Aceleração RMS(g)', () => {
    cy.get(':nth-child(7) > .MuiTypography-root')
      .should('be.visible')
      .and('contain.text', '16g')
  })

it('Validação do campo tempo(min)', () => {
    cy.get(':nth-child(9) > .MuiTypography-root')
      .should('be.visible')
      .and('contain.text', '20 min')
  })

})
