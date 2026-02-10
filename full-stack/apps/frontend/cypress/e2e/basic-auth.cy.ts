describe('Basic E2E Tests', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
  })

  it('should load the login page', () => {
    cy.url().should('include', '/login')
    cy.get('body').should('contain', 'Sign in')
  })

  it('should login with valid credentials', () => {
    cy.get('input[type="text"]').type('admin')
    cy.get('input[type="password"]').type('admin')
    cy.get('button[type="submit"]').click()
    
    // Should redirect to main page
    cy.url().should('not.include', '/login')
    cy.get('body').should('contain', 'Monitoring Points')
  })

  it('should show error with invalid credentials', () => {
    cy.get('input[type="text"]').type('wrong')
    cy.get('input[type="password"]').type('wrong')
    cy.get('button[type="submit"]').click()
    
    // Should show error message
    cy.get('body').should('contain', 'Invalid credentials')
  })
})
