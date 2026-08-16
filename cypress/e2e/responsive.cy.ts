const viewports = [
	{ chartHeight: 320, height: 812, machineRows: 5, name: 'mobile', width: 375 },
	{ chartHeight: 432, height: 1024, machineRows: 1, name: 'tablet', width: 768 },
] as const;

describe('Data page responsiveness', () => {
	for (const viewport of viewports) {
		it(`fits the ${viewport.name} viewport without horizontal overflow`, () => {
			cy.viewport(viewport.width, viewport.height);
			cy.intercept('GET', '**/measurements').as('getMeasurements');
			cy.visitDataPage();
			cy.wait('@getMeasurements').its('response.statusCode').should('eq', 200);

			cy.get('[data-chart-id] .highcharts-root').should('have.length', 3);

			cy.document().should((document) => {
				expect(document.documentElement.scrollWidth).to.be.at.most(
					document.documentElement.clientWidth,
				);
				expect(document.body.scrollWidth).to.be.at.most(document.body.clientWidth);
			});

			cy.get('section[aria-label="Resumo da máquina"] li').should(($items) => {
				const rows = new Set(
					[...$items].map((item) => Math.round(item.getBoundingClientRect().top)),
				);
				expect(rows.size).to.eq(viewport.machineRows);
			});

			cy.get('[data-chart-id] .highcharts-container').each(($chart) => {
				expect(Math.round($chart[0]?.getBoundingClientRect().height ?? 0)).to.eq(
					viewport.chartHeight,
				);
			});

			cy.get('article').each(($card) => {
				const bounds = $card[0]?.getBoundingClientRect();
				expect(bounds?.left).to.be.at.least(0);
				expect(bounds?.right).to.be.at.most(viewport.width);
			});
		});
	}
});
