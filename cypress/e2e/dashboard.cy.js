describe('Sensor Dashboard', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/metadata.json', { fixture: 'metadata.json' }).as('getMetadata')
        cy.intercept('GET', '**/data.json', { fixture: 'data.json' }).as('getData')

        cy.visit('https://frontend-test-for-qa.vercel.app/')
    })

    it('should render the header correctly', () => {
        cy.wait('@getMetadata')

        cy.contains('Máquina 1023').should('be.visible')
        cy.contains('Ponto 20192').should('be.visible')
    })

    it('should refresh data every time the page is accessed', () => {
        cy.wait('@getData')

        cy.get('@getData.all').should('have.length', 1)

        cy.reload()

        cy.wait('@getData')
        cy.get('@getData.all').should('have.length', 2)
    })

    it('should toggle series visibility when clicking legend items on Aceleração and Velocidade charts', () => {
        cy.wait(['@getMetadata', '@getData'])

        cy.get('.highcharts-root').eq(0).scrollIntoView().within(() => {
            cy.contains('.highcharts-legend-item', 'Axial').click()
            cy.contains('.highcharts-legend-item', 'Radial').click()

            cy.contains('.highcharts-legend-item', 'Axial').should('have.class', 'highcharts-legend-item-hidden')
            cy.contains('.highcharts-legend-item', 'Radial').should('have.class', 'highcharts-legend-item-hidden')
            cy.contains('.highcharts-legend-item', 'Horizontal').should('not.have.class', 'highcharts-legend-item-hidden')
        })

        cy.get('.highcharts-root').eq(2).scrollIntoView().within(() => {
            cy.contains('.highcharts-legend-item', 'Horizontal').click()
            cy.contains('.highcharts-legend-item', 'Radial').click()

            cy.contains('.highcharts-legend-item', 'Horizontal').should('have.class', 'highcharts-legend-item-hidden')
            cy.contains('.highcharts-legend-item', 'Radial').should('have.class', 'highcharts-legend-item-hidden')
            cy.contains('.highcharts-legend-item', 'Axial').should('not.have.class', 'highcharts-legend-item-hidden')
        })
    })

    it('should toggle series visibility when clicking the legend on the Temperature chart', () => {
        cy.wait(['@getMetadata', '@getData'])
        cy.wait(1000)

        cy.get('.highcharts-root').eq(1).scrollIntoView().within(() => {

            cy.contains('.highcharts-legend-item', 'Temperatura').click()

            cy.contains('.highcharts-legend-item', 'Temperatura')
                .should('have.class', 'highcharts-legend-item-hidden')

            cy.contains('.highcharts-legend-item', 'Temperatura').click()

            cy.contains('.highcharts-legend-item', 'Temperatura')
                .should('not.have.class', 'highcharts-legend-item-hidden')
        })
    })
})