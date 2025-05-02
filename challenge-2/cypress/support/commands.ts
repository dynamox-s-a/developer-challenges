/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

export type UserRole = "admin" | "reader";

interface LoginConfig {
	email: string;
	password: string;
	redirectUrl: string;
}

const userConfigs: Record<UserRole, LoginConfig> = {
	admin: {
		email: "admin@events.com",
		password: "admin123",
		redirectUrl: "/events/manage",
	},
	reader: {
		email: "reader@events.com",
		password: "reader123",
		redirectUrl: "/events",
	},
};

declare global {
	namespace Cypress {
		interface Chainable {
			loginAs(role: UserRole): Chainable<void>;
		}
	}
}

Cypress.Commands.add("loginAs", (role: UserRole) => {
	const config = userConfigs[role];

	cy.visit("/login");
	cy.findByLabelText(/e-mail/i).type(config.email);
	cy.findByLabelText(/senha/i).type(config.password);
	cy.findByRole("button", { name: /entrar/i }).click();
	cy.wait(3000);
	cy.url().should("include", config.redirectUrl);
});
