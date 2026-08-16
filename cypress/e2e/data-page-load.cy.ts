describe('Data page loading', () => {
	it('loads measurements from the API and renders the machine charts', () => {
		cy.intercept('GET', '**/measurements', (request) => {
			request.continue((response) => {
				response.setDelay(300);
			});
		}).as('getMeasurements');

		cy.visitDataPage();

		cy.get('main#main-content').should('have.attr', 'aria-busy', 'true');
		cy.get('[role="status"]').should('contain.text', 'Carregando dados...');

		cy.wait('@getMeasurements').its('response.statusCode').should('eq', 200);

		cy.get('main#main-content').should('have.attr', 'aria-busy', 'false');
		cy.get('section[aria-label="Resumo da máquina"]')
			.should('be.visible')
			.find('li')
			.should('have.length', 5);

		cy.get('section[aria-label="Gráficos de medições"] article').should('have.length', 3);
		cy.get('h2').then(($headings) => {
			expect([...$headings].map((heading) => heading.textContent)).to.deep.equal([
				'Aceleração RMS',
				'Temperatura',
				'Velocidade RMS',
			]);
		});

		cy.get('[data-chart-id]').should('have.length', 3);
		cy.get('#acceleration-chart .highcharts-series-group > .highcharts-series').should(
			'have.length',
			3,
		);
		cy.get('#temperature-chart .highcharts-series-group > .highcharts-series').should(
			'have.length',
			1,
		);
		cy.get('#velocity-chart .highcharts-series-group > .highcharts-series').should(
			'have.length',
			3,
		);
	});

	it('requests measurements again when the user re-enters the route', () => {
		cy.intercept('GET', '**/measurements').as('getMeasurements');

		cy.visitDataPage();
		cy.wait('@getMeasurements').its('response.statusCode').should('eq', 200);

		cy.visit('/unknown');
		cy.contains('404 — Página não encontrada').should('be.visible');

		cy.visitDataPage();
		cy.wait('@getMeasurements').its('response.statusCode').should('eq', 200);
		cy.get('section[aria-label="Gráficos de medições"]').should('be.visible');
	});
});
