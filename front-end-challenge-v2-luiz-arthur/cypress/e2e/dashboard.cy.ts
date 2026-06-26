describe('Dashboard E2E', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/data');
      cy.get('.app-container', { timeout: 10000 }).should('be.visible');
    });
  
    it('should load the page successfully', () => {
      cy.get('.app-container').should('be.visible');
    });
  
    it('should display the header', () => {
      cy.get('.header-paper').should('be.visible');
    });
  
    it('should display chart cards', () => {
      cy.get('.chart-card').should('have.length.at.least', 3);
    });
  
    it('should render Highcharts containers', () => {
      cy.get('.highcharts-container').should('have.length.at.least', 3);
    });
  
    it.skip('should toggle dark mode', () => {
      cy.get('button[aria-label="toggle theme"]').click();
      cy.get('body').should('have.attr', 'data-theme', 'dark');
    });
  });

//Teste mais completo
/*
describe('Dashboard E2E', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/data')
      cy.contains('Análise de Dados', { timeout: 10000 }).should('be.visible');
    });
  
    it('should display the header with machine info', () => {
      cy.contains('Máquina 1023').should('be.visible');
      cy.contains('Ponto 20192').should('be.visible');
      cy.contains('200').should('be.visible');
      cy.contains('16g').should('be.visible');
      cy.contains('20 min').should('be.visible');
    });
  
    it('should display the three chart cards', () => {
      cy.contains('Aceleração RMS').should('be.visible');
      cy.contains('Velocidade RMS').should('be.visible');
      cy.contains('Temperatura').should('be.visible');
    });
  
    it('should render Highcharts containers', () => {
      cy.get('.highcharts-container').should('have.length.at.least', 3);
    });
  
    it('should toggle dark mode', () => {
      cy.get('button[aria-label="toggle theme"]').click();
      cy.get('body').should('have.attr', 'data-theme', 'dark');
      cy.get('button[aria-label="toggle theme"]').click();
      cy.get('body').should('have.attr', 'data-theme', 'light');
    });
  
    it('should sync crosshair on hover', () => {
      cy.get('.highcharts-container').first().should('be.visible');
      cy.get('.highcharts-series-group').first().trigger('mouseover');
      cy.get('.highcharts-crosshair').should('have.length.at.least', 3);
    });
  });
*/