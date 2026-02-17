import DashboardPage from '../pages/dashboards.page';

describe('Monitoramento Dashboards', () => {
  
  beforeEach(() => {
    cy.intercept('GET', '**/metadata**').as('getMetadata');
    cy.intercept('GET', '**/data**').as('getData');
    DashboardPage.visit();
  });

  it('Deve renderizar os 3 gráficos Highcharts', () => {
    cy.wait(['@getMetadata', '@getData'], { timeout: 10000 });

    DashboardPage.charts.should('have.length', 3);
    cy.log('Os 3 gráficos Encontrados!');
  });

  it('Deve exibir tooltip ao passar o mouse', () => {
    cy.wait(['@getMetadata', '@getData'], { timeout: 10000 });

    DashboardPage.hoverGraph(0);

    DashboardPage.tooltip
      .should('exist')
      .should('have.css', 'opacity', '1');
      
    DashboardPage.tooltipText.should('exist');
  });

  it('Deve exibir os dados do cabeçalho idênticos ao metadata.json', () => {
    cy.wait('@getMetadata').then((interception) => {

      const apiData = interception.response.body;

      cy.log('Dados recebidos:', JSON.stringify(apiData));

      DashboardPage.metadataLabels.eq(0)
        .should('have.text', apiData.machine);

      DashboardPage.metadataLabels.eq(1)
        .should('have.text', apiData.spot);

      DashboardPage.metadataLabels.eq(2)
        .should('have.text', apiData.rpm.toString()); 

      DashboardPage.metadataLabels.eq(3)
        .should('have.text', apiData.dynamicRange);

      const expectedInterval = `${apiData.interval} min`;
      DashboardPage.metadataLabels.eq(4)
        .should('have.text', expectedInterval);
    });
  });

  it('Deve atualizar os dados ao recarregar a página', () => {
    DashboardPage.charts.should('have.length', 3);

    DashboardPage.reload();

    cy.wait('@getMetadata').its('response.statusCode').should('eq', 200);
    cy.wait('@getData').its('response.statusCode').should('eq', 200);

    DashboardPage.headerContainer.should('be.visible');

    DashboardPage.charts.should('have.length', 3);
  });
});