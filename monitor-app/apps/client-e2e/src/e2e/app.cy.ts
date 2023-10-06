describe('client/machines', () => {
  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'))
  })
  it('should create a new machine', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/machines"]').click()
    cy.get('a[href*="/dashboard/machines/create"]').click()
    cy.get('input:first').type('machine 001')
    cy.get('[name="type"]').parent().click()
    cy.get('[data-value="Pump"]').click()
    cy.get('button[type=submit]').click()
    cy.get('tr td:first').contains('machine 001')
    cy.get('tr td:nth-child(2)').contains('Pump')
  })
  it('should update a machine', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/machines"]').click()
    cy.get('tr td:last button').click()
    cy.get('a[href*="/dashboard/machines/edit/"]').click()
    cy.get('input:first').type(' updated')
    cy.get('[name="type"]').parent().click()
    cy.get('[data-value="Fan"]').click()
    cy.get('button[type=submit]').click()
    cy.get('tr td:first').contains('machine 001 updated')
    cy.get('tr td:nth-child(2)').contains('Fan')
  })
  it('should delete a machine', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/machines"]').click()
    cy.get('tr td:last button').click()
    cy.get('a[href*="/dashboard/machines/delete/"]').click()
    cy.get('button').contains('Delete').click()
    cy.get('p').contains('No machines registered:')
  })
})

describe('client/spots', () => {
  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'))
  })
  it('should create a new spot', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/machines"]').click()
    cy.get('a[href*="/dashboard/machines/create"]').click()
    cy.get('input:first').type('machine 001')
    cy.get('[name="type"]').parent().click()
    cy.get('[data-value="Pump"]').click()
    cy.get('button[type=submit]').click()
    cy.get('tr td:first').contains('machine 001')
    cy.get('tr td:nth-child(2)').contains('Pump')

    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/spots"]').click()
    cy.get('a[href*="/dashboard/spots/create"]').click()
    cy.get('[name="name"]').type('spot 001')
    cy.get('[name="machineId"]').parent().click()
    cy.contains('machine 001').click()
    cy.get('[name="sensorId"]').type('100010023')
    cy.get('[name="sensorModel"]').parent().click()
    cy.get('[data-value="HF+"]').click()
    cy.get('button[type=submit]').click()
  })

  it('should update a spot', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/spots"]').click()
    cy.get('tr td:last button').click()
    cy.get('a[href*="/dashboard/spots/edit/"]').click()
    cy.get('input:first').type(' updated')
    cy.get('button[type=submit]').click()
    cy.get('tr td:first').contains('spot 001 updated')
  })

  it('should delete a spot', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/spots"]').click()
    cy.get('tr td:last button').click()
    cy.get('a[href*="/dashboard/spots/delete/"]').click()
    cy.get('button').contains('Delete').click()
    cy.get('p').contains('No spots registered:')
  })

  it('should delete a machine', () => {
    cy.get('button[aria-label="open drawer"]').click()
    cy.get('a[href*="/dashboard/machines"]').click()
    cy.get('tr td:last button').click()
    cy.get('a[href*="/dashboard/machines/delete/"]').click()
    cy.get('button').contains('Delete').click()
    cy.get('p').contains('No machines registered:')
  })
})
describe('client/logout', () => {
  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'))
  })
  it('should logout', () => {
    cy.get('button[aria-label="Open Account Menu"]').click()
    cy.get('ul li:first').should('contain', 'Sign out')
    cy.get('ul li:first').click()
    cy.get('h1').contains('Login')
  })
})
