describe("Create Event (Admin)", () => {
	beforeEach(() => {
		cy.loginAs("admin");
		cy.findByRole("button", { name: /novo evento/i }).click();
	});

	it("should display create event form", () => {
		cy.findAllByTestId("event-title").should("exist");
		cy.findAllByTestId("event-description").should("exist");
		cy.findAllByTestId("event-date").should("exist");
		cy.findAllByTestId("event-location").should("exist");
		cy.findByRole("button", { name: /salvar/i }).should("exist");
		cy.findByRole("button", { name: /cancelar/i }).should("exist");
	});

	it("should show validation errors for empty fields", () => {
		cy.findByRole("button", { name: /salvar/i }).click();
		cy.findByText(/título é obrigatório/i).should("exist");
		cy.findByText(/descrição é obrigatória/i).should("exist");
		cy.findByText(/data é obrigatória/i).should("exist");
		cy.findByText(/local é obrigatório/i).should("exist");
	});

	it("should create a new event successfully", () => {
		const eventData = {
			title: "Novo Evento de Teste",
			description:
				"Descrição do evento de teste automatizado com mais de 50 caracteres",
			date: "2025-12-31T14:30",
			location: "Local do evento de teste automatizado",
			category: "Workshop",
		};

		cy.findAllByTestId("event-title").type(eventData.title);
		cy.findAllByTestId("event-description").type(eventData.description);
		cy.findAllByTestId("event-date").type(eventData.date);
		cy.findAllByTestId("event-location").type(eventData.location);
		cy.findByRole("combobox").click();
		cy.findAllByTestId(`event-category-${eventData.category}`).click();
		cy.findByRole("button", { name: /salvar/i }).click();

		cy.url().should("include", "/events/manage");
		cy.findAllByText(eventData.title).should("exist");
		cy.findAllByText(eventData.description).should("exist");
	});

	it("should cancel event creation and return to list", () => {
		cy.findByRole("button", { name: /cancelar/i }).click();
		cy.url().should("include", "/events/manage");
	});
});
