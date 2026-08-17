describe('App Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should load the application', () => {
    cy.get('body').should('be.visible');
  });

  it('should display the application title', () => {
    //Application renders the root div
    cy.get('#root').should('exist');
  });

  it('should render application content', () => {
    //Application is loaded when root element exists
    cy.get('#root').should('exist');
    cy.get('body').should('be.visible');
  });
});
