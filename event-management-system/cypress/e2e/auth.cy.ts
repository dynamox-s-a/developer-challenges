//Route Protection Test
describe('Route Protection', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should redirect unauthenticated user to login page', () => {
    cy.visit('/admin/events')

    cy.url().should('include', '/login')
  })

})
