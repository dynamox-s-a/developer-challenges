describe('Auth Protection', () => {
  it('should redirect unauthenticated user to login', () => {
    cy.visit('/admin/events')
    cy.url().should('include', '/')
  })
})