class DashboardPage {

  get charts() { return cy.get('[data-highcharts-chart]'); }
  get seriesGroup() { return cy.get('.highcharts-series-group'); }
  get tooltip() { return cy.get('.highcharts-tooltip'); }
  get tooltipText() { return cy.get('.highcharts-tooltip text'); }
  get headerContainer() { return cy.contains('Sensor').parent(); }
  get metadataLabels() { return cy.get('.MuiTypography-caption'); }


  visit() {
    cy.visit('/');
  }

  hoverGraph(index = 0) {
    this.charts.eq(index).then(($container) => {
      const rect = $container[0].getBoundingClientRect();
      const centroX = rect.left + (rect.width / 2);
      const centroY = rect.top + (rect.height / 2);

      cy.wrap($container)
        .find('.highcharts-series-group')
        .trigger('mouseover', { clientX: centroX, clientY: centroY, force: true, bubbles: true })
        .trigger('mousemove', { clientX: centroX, clientY: centroY, force: true, bubbles: true });

      cy.wait(200);
      cy.wrap($container)
        .find('.highcharts-series-group')
        .trigger('mousemove', { clientX: centroX + 10, clientY: centroY, force: true, bubbles: true });
    });
  }

  validateHeaderInfo(text) {
    this.headerContainer.should('contain.text', text);
  }
}

export default new DashboardPage();