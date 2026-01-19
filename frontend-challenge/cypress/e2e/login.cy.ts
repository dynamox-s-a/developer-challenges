describe('Login', () => {
    it('deve realizar login com sucesso', () => {
        cy.visit('/login')

        cy.get('input[type="email"]').type('reader@events.com')
        cy.get('input[type="password"]').type('reader123')
        cy.contains('Entrar').click()

        cy.url().should('include', '/events')
    })

    it('deve mostrar erro com credenciais inválidas', () => {
        cy.visit('/login')

        cy.get('input[type="email"]').type('errado@email.com')
        cy.get('input[type="password"]').type('senhaerrada')

        cy.contains('Entrar').click()

        cy.contains('E-mail ou senha incorretos').should('be.visible')
    })
})
