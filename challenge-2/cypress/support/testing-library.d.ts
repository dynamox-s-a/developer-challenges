import "@testing-library/cypress";

declare global {
	namespace Cypress {
		interface Chainable {
			findByLabelText: typeof cy.findByLabelText;
			findByText: typeof cy.findByText;
			findByRole: typeof cy.findByRole;
			findAllByTestId: typeof cy.findAllByTestId;
		}
	}
}
