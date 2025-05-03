import "./commands";
import "@testing-library/cypress/add-commands";
import "./api-commands";
import type { Event } from "./api-commands";

declare global {
	namespace Cypress {
		interface Chainable {
			findByLabelText: typeof cy.findByLabelText;
			findByText: typeof cy.findByText;
			findByRole: typeof cy.findByRole;
			findAllByTestId: typeof cy.findAllByTestId;
			createTestEvent(eventData: Omit<Event, "id">): Chainable<{ body: Event }>;
			deleteTestEvent(eventId: string): Chainable<Response<void>>;
		}
	}
}
