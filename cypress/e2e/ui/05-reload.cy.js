describe('Reload da página', () => {

  it('Deve requisitar data.json novamente ao recarregar', () => {

    cy.intercept('GET', '**/data.json').as('getData')

    cy.visit('/')
    cy.wait('@getData')

    cy.reload()
    cy.wait('@getData')
  })
  /*
  O que esse teste faz:
    Intercepta a requisição GET para data.json
    Carrega a aplicação
    Garante que data.json foi requisitado no primeiro acesso
    Recarrega a página
    Garante que data.json foi requisitado novamente após o reload
    Valida que os dados não estão sendo reutilizados apenas de memória/cache interno da aplicação
*/
})
