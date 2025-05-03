/// <reference types="cypress" />

export interface Event {
	id?: string;
	title: string;
	description: string;
	date: string;
	location: string;
	category: string;
}

declare global {
	namespace Cypress {
		interface Chainable {
			createTestEvent(eventData: Omit<Event, "id">): Chainable<{ body: Event }>;
			deleteTestEvent(eventId: string): Chainable<Response<void>>;
			loginAs(role: "admin" | "reader"): Chainable<void>;
		}
	}
}

Cypress.Commands.add("createTestEvent", (eventData: Omit<Event, "id">) => {
	const baseUrl = Cypress.config("baseUrl") || "http://localhost:3001";
	return cy
		.request<Event>({
			method: "POST",
			url: `${baseUrl}/events`,
			body: eventData,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then((response) => ({ body: response.body }));
});

Cypress.Commands.add("deleteTestEvent", (eventId: string) => {
	const baseUrl = Cypress.config("baseUrl") || "http://localhost:3001";
	return cy.request({
		method: "DELETE",
		url: `${baseUrl}/events/${eventId}`,
		failOnStatusCode: false,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
});
