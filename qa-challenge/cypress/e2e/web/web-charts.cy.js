describe('Web GUI Test - Charts', () => {
  it('Gets, types and asserts', () => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')

    //  Checking charts: 
    // 1. Charts titles:
    cy.contains('.MuiTypography-subtitle2', 'Aceleração RMS');
    cy.contains('.MuiTypography-subtitle2', 'Temperatura');
    cy.contains('.MuiTypography-subtitle2', 'Velocidade RMS');

    // 2. Must have at least three visible charts:
    cy.get('.highcharts-root').should('have.length.at.least', 3);
    cy.get('.highcharts-graph').eq(0).should('be.visible');
    cy.get('.highcharts-graph').eq(1).should('be.visible');
    cy.get('.highcharts-graph').eq(2).should('be.visible');
    cy.get('.highcharts-graph').eq(3).should('be.visible');
  })
})