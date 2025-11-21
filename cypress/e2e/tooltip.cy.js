describe('Tooltip nos gráficos', () => {
  it('deve exibir valores ao passar o cursor sobre a série temporal', () => {
    cy.intercept('GET', '**data.json').as('getData');
    cy.visit('https://frontend-test-for-qa.vercel.app/');
    cy.wait('@getData');
    cy.wait(1000); // garante que o gráfico esteja visível

    cy.get('.highcharts-container').first()
      .trigger('mousemove', { clientX: 200, clientY: 150 }, { force: true });
    cy.pause();  

    cy.get('.highcharts-tooltip')
      .should('exist')
      .and('be.visible');
  });
});

