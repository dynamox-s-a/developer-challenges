describe('Eventos - CRUD', () => {
    const testEventData = {
        name: 'Evento de Teste Cypress',
        location: 'São Paulo, SP',
        description: 'Este é um evento de teste criado pelo Cypress para validar funcionalidades de CRUD',
        category: 'Workshop',
        futureDate: (() => {
            const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            return date.toISOString().slice(0, 16)
        })(),
    }

    beforeEach(() => {
        cy.visit('/login')

        cy.get('input[type="email"]').type('admin@events.com')
        cy.get('input[type="password"]').type('admin123')
        cy.contains('Entrar').click()

        cy.url().should('include', '/admin/dashboard')
    })

    it('deve criar um novo evento com sucesso', () => {
        cy.contains('Criar Novo Evento').click()
        cy.contains('Criar Novo Evento').should('be.visible')

        cy.get('[data-cy=event-name-input]').type(testEventData.name)
        cy.get('[data-cy=event-date-input]').type(testEventData.futureDate)
        cy.get('[data-cy=event-location-input]').type(testEventData.location)
        cy.get('[data-cy=event-description-input]').type(testEventData.description)

        cy.get('[data-cy=event-category-select]').click()
        cy.contains(testEventData.category).click()

        cy.get('[data-cy=save-event-button]').click()

        cy.contains('Evento criado com sucesso').should('be.visible')
        cy.contains(testEventData.name).should('be.visible')
    })
})

describe('Eventos - Listagem e Filtros', () => {
    beforeEach(() => {
        cy.visit('/login')

        cy.get('input[type="email"]').type('reader@events.com')
        cy.get('input[type="password"]').type('reader123')
        cy.contains('Entrar').click()

        cy.url().should('include', '/events')
    })

    it('deve listar eventos', () => {
        cy.contains('Próximos Eventos').should('be.visible')
        cy.contains('Eventos Passados').should('be.visible')
    })

    it('deve buscar eventos pelo nome', () => {
        cy.get('input[placeholder="Digite o nome do evento"]').type('Teste')

        cy.contains('Teste').should('be.visible')
    })
})