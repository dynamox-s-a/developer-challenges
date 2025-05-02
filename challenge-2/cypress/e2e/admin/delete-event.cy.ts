describe("Delete Event (Admin)", () => {
	beforeEach(() => {
		cy.loginAs("admin");
	});

	it("should show delete confirmation dialog", () => {
		const uniqueTitle = `Evento para Exclusão ${Date.now()}`;
		const eventData = {
			title: uniqueTitle,
			description:
				"Descrição do evento que será excluído nos testes automatizados",
			date: "2025-12-31T14:30",
			location: "Local do evento para exclusão",
			category: "Workshop",
		};

		cy.findByRole("button", { name: /novo evento/i }).click();
		cy.findAllByTestId("event-title").type(eventData.title);
		cy.findAllByTestId("event-description").type(eventData.description);
		cy.findAllByTestId("event-date").type(eventData.date);
		cy.findAllByTestId("event-location").type(eventData.location);
		cy.findByRole("combobox").click();
		cy.findAllByTestId(`event-category-${eventData.category}`).click();
		cy.findByRole("button", { name: /salvar/i }).click();

		cy.findAllByTestId("event-title-filter").type(uniqueTitle);
		cy.findAllByTestId("event-row").contains(uniqueTitle).click();
		cy.findByRole("button", { name: /excluir/i }).click();

		cy.findByText(/confirmar exclusão/i).should("exist");
		cy.findByText(/deseja realmente excluir o evento/i).should("exist");
		cy.findByRole("button", { name: /cancelar/i }).should("exist");
		cy.findByRole("button", { name: /excluir/i }).should("exist");
	});

	it("should delete event when confirmed", () => {
		const uniqueTitle = `Evento para Exclusão ${Date.now()}`;
		const eventData = {
			title: uniqueTitle,
			description:
				"Descrição do evento que será excluído nos testes automatizados",
			date: "2025-12-31T14:30",
			location: "Local do evento para exclusão",
			category: "Workshop",
		};

		cy.findByRole("button", { name: /novo evento/i }).click();
		cy.findAllByTestId("event-title").type(eventData.title);
		cy.findAllByTestId("event-description").type(eventData.description);
		cy.findAllByTestId("event-date").type(eventData.date);
		cy.findAllByTestId("event-location").type(eventData.location);
		cy.findByRole("combobox").click();
		cy.findAllByTestId(`event-category-${eventData.category}`).click();
		cy.findByRole("button", { name: /salvar/i }).click();

		cy.findAllByTestId("event-title-filter").type(uniqueTitle);
		cy.findAllByTestId("event-row").contains(uniqueTitle).click();
		cy.findByRole("button", { name: /excluir/i }).click();
		cy.findByRole("button", { name: /excluir/i })
			.last()
			.click();
		cy.findByText(/evento excluído com sucesso/i).should("exist");

		cy.findByRole("button", { name: /limpar filtros/i }).click();
		cy.findAllByTestId("event-title-filter").type(uniqueTitle);
		cy.findAllByTestId("event-row").should("not.exist");
	});

	it("should keep event when deletion is canceled", () => {
		const uniqueTitle = `Evento para Exclusão ${Date.now()}`;
		const eventData = {
			title: uniqueTitle,
			description:
				"Descrição do evento que será excluído nos testes automatizados",
			date: "2025-12-31T14:30",
			location: "Local do evento para exclusão",
			category: "Workshop",
		};

		cy.findByRole("button", { name: /novo evento/i }).click();
		cy.findAllByTestId("event-title").type(eventData.title);
		cy.findAllByTestId("event-description").type(eventData.description);
		cy.findAllByTestId("event-date").type(eventData.date);
		cy.findAllByTestId("event-location").type(eventData.location);
		cy.findByRole("combobox").click();
		cy.findAllByTestId(`event-category-${eventData.category}`).click();
		cy.findByRole("button", { name: /salvar/i }).click();

		cy.findAllByTestId("event-title-filter").type(uniqueTitle);
		cy.findAllByTestId("event-row").contains(uniqueTitle).click();
		cy.findByRole("button", { name: /excluir/i }).click();
		cy.findByRole("button", { name: /cancelar/i }).click();

		cy.findByRole("button", { name: /limpar filtros/i }).click();
		cy.findAllByTestId("event-title-filter").type(uniqueTitle);
		cy.findAllByTestId("event-row").contains(uniqueTitle).should("exist");
	});
});
