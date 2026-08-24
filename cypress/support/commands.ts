declare global {
	namespace Cypress {
		interface Chainable {
			visitDataPage(): Chainable<void>;
		}
	}
}

Cypress.Commands.add('visitDataPage', () => {
	cy.visit('/data', {
		onBeforeLoad(window) {
			cy.stub(window.console, 'error').as('consoleError');
		},
	});
});

export {};
