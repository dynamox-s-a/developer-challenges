describe('Data page API recovery', () => {
	it('recovers after the user retries a failed request', () => {
		let shouldFail = true;

		cy.intercept('GET', '**/measurements', (request) => {
			if (shouldFail) {
				request.alias = 'failedMeasurements';
				request.reply({
					body: { message: 'Internal server error' },
					statusCode: 500,
				});
				return;
			}

			request.alias = 'successfulMeasurements';
			request.continue((response) => {
				response.setDelay(300);
			});
		});

		cy.visitDataPage();

		cy.wait('@failedMeasurements').its('response.statusCode').should('eq', 500);
		cy.get('[role="alert"]')
			.should('be.visible')
			.and('contain.text', 'Não foi possível carregar as medições. Tente novamente.');

		cy.then(() => {
			shouldFail = false;
		});
		cy.get('button').contains('Tentar novamente').click();

		cy.get('main#main-content').should('have.attr', 'aria-busy', 'true');
		cy.wait('@successfulMeasurements').its('response.statusCode').should('eq', 200);

		cy.get('[role="alert"]').should('not.exist');
		cy.get('section[aria-label="Resumo da máquina"]').should('be.visible');
		cy.get('[data-chart-id]').should('have.length', 3);
	});
});
