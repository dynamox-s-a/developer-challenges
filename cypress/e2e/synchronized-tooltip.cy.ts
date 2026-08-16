const chartIds = ['acceleration-chart', 'temperature-chart', 'velocity-chart'] as const;

describe('Synchronized chart indicators', { retries: { openMode: 0, runMode: 2 } }, () => {
	it('shows and hides tooltips and crosshairs across all charts', () => {
		cy.intercept('GET', '**/measurements').as('getMeasurements');
		cy.visitDataPage();
		cy.wait('@getMeasurements').its('response.statusCode').should('eq', 200);
		cy.get('[data-chart-id] .highcharts-root').should('have.length', 3);

		cy.get('#acceleration-chart .highcharts-container').then(($container) => {
			const containerBounds = $container[0]?.getBoundingClientRect();
			const plotBounds = $container.find('.highcharts-plot-background')[0]?.getBoundingClientRect();

			expect(containerBounds).not.to.be.undefined;
			expect(plotBounds).not.to.be.undefined;
			if (!containerBounds || !plotBounds) return;

			const x = plotBounds.left - containerBounds.left + plotBounds.width / 2;
			const y = plotBounds.top - containerBounds.top + plotBounds.height / 2;
			cy.wrap($container).trigger('mousemove', x, y, { force: true });
		});

		for (const chartId of chartIds) {
			cy.get(`#${chartId} .highcharts-tooltip`).should('be.visible');
			cy.get(`#${chartId} .highcharts-crosshair`)
				.should('have.length', 1)
				.and('have.attr', 'd')
				.and('not.be.empty');
		}

		cy.get('#acceleration-chart .highcharts-tooltip').should('contain.text', 'g');
		cy.get('#temperature-chart .highcharts-tooltip').should('contain.text', '°C');
		cy.get('#velocity-chart .highcharts-tooltip').should('contain.text', 'mm/s');

		cy.get('#acceleration-chart .highcharts-container').trigger('mouseleave', { force: true });

		for (const chartId of chartIds) {
			cy.get(`#${chartId} .highcharts-tooltip`).should('not.be.visible');
			cy.get(`#${chartId} .highcharts-crosshair`).should(($crosshair) => {
				const visibility = $crosshair.attr('visibility');
				expect($crosshair.length === 0 || visibility === 'hidden').to.eq(true);
			});
		}
	});
});
