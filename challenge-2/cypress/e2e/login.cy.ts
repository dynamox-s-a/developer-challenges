/// <reference types="cypress" />

describe("Login Page", () => {
	beforeEach(() => {
		cy.visit("/login");
	});

	it("should display login form", () => {
		cy.findByLabelText(/e-mail/i).should("exist");
		cy.findByLabelText(/senha/i).should("exist");
		cy.findByRole("button", { name: /entrar/i }).should("exist");
	});

	it("should show validation errors for empty fields", () => {
		cy.findByRole("button", { name: /entrar/i }).click();
		cy.findByText(/e-mail inválido/i).should("exist");
		cy.findByText(/a senha deve ter pelo menos 6 caracteres/i).should("exist");
	});

	it("should show error for invalid credentials", () => {
		cy.findByLabelText(/e-mail/i).type("invalid@email.com");
		cy.findByLabelText(/senha/i).type("wrongpassword");
		cy.findByRole("button", { name: /entrar/i }).click();
		cy.findByText(/usuário não encontrado/i).should("exist");
	});

	it("should login successfully with valid credentials and redirect to /events/manage (ADMIN)", () => {
		cy.loginAs("admin");
	});

	it("should login successfully with valid credentials and redirect to /events (READER)", () => {
		cy.loginAs("reader");
	});
});
