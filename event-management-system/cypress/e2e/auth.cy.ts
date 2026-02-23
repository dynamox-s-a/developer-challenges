describe('Authentication Flow', () => {

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  // Route Protection Test
  it('should redirect unauthenticated user to login page', () => {
    cy.visit('/admin/events')
    cy.url().should('include', '/login')
  })


  // Helper function to fill login form
  const fillLoginForm = (email: string, password: string) => {
    cy.contains('label', 'Email')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get(`#${id}`).type(email)
      })

    cy.contains('label', 'Password')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get(`#${id}`).type(password)
      })
  }


  // Admin Login Test
  it('should login successfully as admin', () => {
    cy.visit('/login')

    fillLoginForm('admin@events.com', 'admin123')

    cy.contains('button', 'Login').click()

    cy.url().should('include', '/admin')
  })


  // Reader Login Test
  it('should login successfully as reader', () => {
    cy.visit('/login')

    fillLoginForm('reader@events.com', 'reader123')

    cy.contains('button', 'Login').click()

    cy.url().should('include', '/events')
  })

})