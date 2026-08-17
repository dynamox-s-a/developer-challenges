describe('Data Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/data');
  });

  it('should load the data page', () => {
    cy.get('body').should('be.visible');
  });

  it('should have the root element', () => {
    // Application content is rendered in the root element
    cy.get('#root').should('exist');
  });

  it('should navigate to data path successfully', () => {
    cy.url().should('include', '/data');
  });
});
