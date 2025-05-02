import "./commands";
import "@testing-library/cypress/add-commands";

declare global {
	namespace Cypress {
		interface Chainable {}
	}
}
