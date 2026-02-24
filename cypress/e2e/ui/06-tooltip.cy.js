describe('Interação - Tooltip', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('Deve exibir tooltip ao passar mouse', () => {

    cy.get('canvas')
      .first()
      .trigger('mousemove', { force: true })

    cy.get('.tooltip')
      .should('be.visible')
  })

  /*
  O que esse teste valida
    Evento de hover gera exibição visual
    DOM cria/ativa o elemento tooltip
    Classe .tooltip está visível
  */

})
