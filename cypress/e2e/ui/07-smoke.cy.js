describe('Smoke test', () => {
  it('Carrega a aplicação e clica no rótulo SVG Horizontal do grafico Aceleração RMS ', () => {
    cy.visit('https://frontend-test-for-qa.vercel.app')

    cy.contains('text', 'Horizontal').trigger('mouseover').wait(5000).click()

    //Se fosse um painel logado, verificar se foi redirecionado para a pagina certa
    cy.url().should('eq','https://frontend-test-for-qa.vercel.app/')

  })
  /*
  O que esse teste faz:
    Carrega a aplicação principal
    Localiza o texto SVG "Horizontal" dentro do gráfico Acelação RMS
    Simula um mouseover nesse rótulo
    Aguarda 5 segundos
    Executa um clique sobre o rótulo
    Valida que a URL permanece a mesma após a interação
    Garante que a aplicação não quebra nem redireciona ao interagir com a legenda
*/
})
