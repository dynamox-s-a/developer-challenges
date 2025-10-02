describe('Navigation E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for loading to complete
    cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
  });

  describe('Desktop Navigation', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('should display desktop navigation menu', () => {
      cy.get('[data-testid="desktop-menu"]').should('be.visible');
      cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
    });

    it('should navigate to acceleration chart', () => {
      cy.get('[data-testid="nav-acceleration"]').click();
      cy.get('#chart-acceleration').should('be.inViewport');
    });

    it('should navigate to velocity chart', () => {
      cy.get('[data-testid="nav-velocity"]').click();
      cy.get('#chart-velocity').should('be.inViewport');
    });

    it('should navigate to temperature chart', () => {
      cy.get('[data-testid="nav-temperature"]').click();
      cy.get('#chart-temperature').should('be.inViewport');
    });

    it('should navigate to sensor info section', () => {
      cy.get('[data-testid="nav-info"]').click();
      cy.get('#sensor-info').should('be.inViewport');
    });

    it('should navigate to top when clicking home', () => {
      // Scroll down first
      cy.scrollTo('bottom');
      
      cy.get('[data-testid="nav-home"]').click();
      
      // Check if we're at the top (header should be visible)
      cy.get('[data-testid="header"]').should('be.inViewport');
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone SE size
    });

    it('should display mobile menu button', () => {
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
    });

    it('should open mobile drawer when menu button is clicked', () => {
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-drawer"]').should('be.visible');
    });

    it('should navigate to acceleration chart from mobile menu', () => {
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-drawer"]').should('be.visible');
      
      cy.get('[data-testid="mobile-nav-acceleration"]').click();
      cy.get('[data-testid="mobile-drawer"]').should('not.be.visible');
      cy.get('#chart-acceleration').should('be.inViewport');
    });

    it('should close mobile drawer when clicking outside', () => {
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-drawer"]').should('be.visible');
      
      // Click outside the drawer
      cy.get('body').click(0, 0);
      cy.get('[data-testid="mobile-drawer"]').should('not.be.visible');
    });
  });

  describe('Responsive Behavior', () => {
    it('should switch from desktop to mobile navigation', () => {
      // Start with desktop view
      cy.viewport(1280, 720);
      cy.get('[data-testid="desktop-menu"]').should('be.visible');
      cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
      
      // Switch to mobile view
      cy.viewport(375, 667);
      cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    });

    it('should switch from mobile to desktop navigation', () => {
      // Start with mobile view
      cy.viewport(375, 667);
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
      
      // Switch to desktop view
      cy.viewport(1280, 720);
      cy.get('[data-testid="desktop-menu"]').should('be.visible');
      cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
    });
  });
});
