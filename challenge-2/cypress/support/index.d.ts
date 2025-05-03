/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
	interface Chainable {
		loginAs(role: "admin" | "reader"): Chainable<void>;
	}
}
