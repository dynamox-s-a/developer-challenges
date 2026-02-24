describe('Dashboard - Atualização de dados ao acessar a página', () => {

  it('deve buscar data.json e metadata.json toda vez que a página é acessada', () => {

    cy.intercept('GET', '**/data.json').as('getData')
    cy.intercept('GET', '**/metadata.json').as('getMetadata')

    // Primeiro acesso
    cy.visit('https://frontend-test-for-qa.vercel.app/')

    cy.wait('@getData').its('response.statusCode').should('eq', 200)
    cy.wait('@getMetadata').its('response.statusCode').should('eq', 200)

    // Novo acesso (reload)
    cy.reload()

    cy.wait('@getData').its('response.statusCode').should('eq', 200)

    // Aqui pegamos a SEGUNDA chamada de metadata
    cy.wait('@getMetadata').then((interception) => {

      expect(interception.response.statusCode).to.eq(200)

      const metadata = interception.response.body

      cy.contains(metadata.machine).should('be.visible')
      cy.contains(metadata.spot).should('be.visible')
      cy.contains(metadata.rpm).should('be.visible')
      cy.contains(metadata.dynamicRange).should('be.visible')

      if (metadata.interval) {
        cy.contains(metadata.interval).should('be.visible')
      }

      // Garantir explicitamente que houve 2 chamadas
      cy.get('@getMetadata.all').should('have.length', 2)
      cy.get('@getData.all').should('have.length', 2)

    })

  })

})