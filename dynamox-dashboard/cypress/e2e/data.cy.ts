/// <reference types="cypress-real-events" />

function interceptDashboardRequests() {
  cy.intercept('GET', 'http://localhost:3001/machine').as('getMachine')
  cy.intercept('GET', 'http://localhost:3001/measurements').as('getMeasurements')
}

function waitForDashboardData() {
  cy.wait('@getMachine')
  cy.wait('@getMeasurements')
}

function getChartPanel(title: string | RegExp) {
  return cy.contains('h2', title).parents('.MuiPaper-root').first()
}

function hoverChartByIndex(index: number) {
  cy.get('.highcharts-series-group')
    .eq(index)
    .should('be.visible')
    .scrollIntoView()
    .find('.highcharts-series-0')
    .first()
    .click({ force: true })
    .realHover()
}

function validateTooltipContent(contents: string[]) {
  cy.get('.highcharts-tooltip').should('be.visible')

  contents.forEach((content) => {
    cy.get('.highcharts-tooltip').should('contain.text', content)
  })
}

describe('Data dashboard', () => {
  beforeEach(() => {
    interceptDashboardRequests()
  })

  it('redirects unknown routes to the data page', () => {
    cy.visit('/unknown-route')

    cy.location('pathname').should('eq', '/data')
    waitForDashboardData()
    cy.contains('h1', /Dados/).should('be.visible')
  })

  it('loads machine metadata from the API', () => {
    cy.visit('/data')
    waitForDashboardData()

    cy.contains('Máquina 1023').should('be.visible')
    cy.contains('Ponto 20192').should('be.visible')
    cy.contains('200').should('be.visible')
    cy.contains('16g').should('be.visible')
    cy.contains('20 min').should('be.visible')
  })

  it('renders the required metric charts with their legends', () => {
    cy.visit('/data')
    waitForDashboardData()

    getChartPanel('Aceleração RMS').within(() => {
      cy.contains('h2', 'Aceleração RMS').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Axial').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Horizontal').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Radial').should('be.visible')
    })

    getChartPanel('Temperatura').within(() => {
      cy.contains('h2', 'Temperatura').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Temperatura').should('be.visible')
    })

    getChartPanel('Velocidade RMS').within(() => {
      cy.contains('h2', 'Velocidade RMS').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Axial').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Horizontal').should('be.visible')
      cy.contains('.highcharts-legend-item', 'Radial').should('be.visible')
    })

    cy.get('.highcharts-container').should('have.length', 3)
    cy.get('.highcharts-series').should('have.length.at.least', 7)
  })

  it('shows tooltip on hover for each chart', () => {
    cy.visit('/data')
    waitForDashboardData()

    cy.get('.highcharts-container').should('have.length', 3)

    hoverChartByIndex(0)
    validateTooltipContent(['Axial', 'Horizontal', 'Radial'])

    hoverChartByIndex(1)
    validateTooltipContent(['Temperatura'])

    hoverChartByIndex(2)
    validateTooltipContent(['Axial', 'Horizontal', 'Radial'])
  })
})
