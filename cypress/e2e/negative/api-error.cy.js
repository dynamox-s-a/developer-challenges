describe('Tratamento de erro da API', () => {

  it('Deve lidar com erro 500 em data.json', () => {

    cy.intercept('GET', '**/data.json', {
      statusCode: 500
    }).as('errorData')

    cy.visit('/')

    cy.wait('@errorData')

    cy.contains('Erro').should('exist')
  })

  /*
  O que isso faz:
    Aplicação não apresenta feedback visual ao usuário quando data.json retorna 500.
    A aplicação não trata erro 500
    Não há mensagem de erro visível
    A aplicação apenas deixa o gráfico vazio (sem feedback visual)  
  */ 
})
