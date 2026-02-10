describe('Auth and Monitoring Points Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should show login page', () => {
    cy.url().should('include', '/login');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should login successfully with admin credentials', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('not.include', '/login');
    cy.url().should('eq', 'http://localhost:5173/');
    
    cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Monitoring Points');
  });

  it('should show monitoring points table', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.get('[role="grid"]').should('be.visible');

    cy.get('[role="grid"]').should('contain', 'Machine');
    cy.get('[role="grid"]').should('contain', 'Type');
    cy.get('[role="grid"]').should('contain', 'MP Name');
    cy.get('[role="grid"]').should('contain', 'Sensor');
    cy.get('[role="grid"]').should('contain', 'Actions');
  });

  it('should handle empty state gracefully', () => {

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    cy.get('[role="grid"]').should('contain', 'No monitoring points found');
    cy.get('[role="grid"]').should('contain', 'Run seed script to generate sample data');
  });

  it('should navigate to machines page', () => {

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    

    cy.get('button').contains('Machines').click();
    
    cy.url().should('include', '/machines');
    cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Machines');
  });

  it('should validate authentication state', () => {

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
    
    cy.visit('/login');
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('should handle logout correctly', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    
    cy.get('button').contains('Logout').click();
    
    cy.url().should('include', '/login');
    
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
