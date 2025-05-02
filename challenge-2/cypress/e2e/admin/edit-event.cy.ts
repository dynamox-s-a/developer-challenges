describe("Edit Event (Admin)", () => {
	beforeEach(() => {
		cy.loginAs("admin");

		const eventData = {
			title: "Evento para Edição",
			description:
				"Descrição do evento que será editado nos testes automatizados",
			date: "2025-12-31T14:30",
			location: "Local do evento para edição",
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
	});

	it("should open edit form with current event data", () => {
		cy.findAllByTestId("event-title-filter").type("Evento para Edição");
		cy.findAllByTestId("event-row").contains("Evento para Edição").click();
		cy.findByRole("button", { name: /editar/i }).click();

		cy.findAllByTestId("event-title")
			.find("input")
			.invoke("val")
			.should("eq", "Evento para Edição");
		cy.findAllByTestId("event-description")
			.find("textarea")
			.invoke("val")
			.should(
				"eq",
				"Descrição do evento que será editado nos testes automatizados",
			);
		cy.findAllByTestId("event-date")
			.find("input")
			.invoke("val")
			.should("eq", "2025-12-31T14:30");
		cy.findAllByTestId("event-location")
			.find("input")
			.invoke("val")
			.should("eq", "Local do evento para edição");
		cy.findByRole("combobox").should("have.text", "Workshop");
	});

	it("should update event with new data", () => {
		cy.findAllByTestId("event-title-filter").type("Evento para Edição");
		cy.findAllByTestId("event-row").contains("Evento para Edição").click();
		cy.findByRole("button", { name: /editar/i }).click();

		const updatedData = {
			title: "Evento Atualizado",
			description:
				"Nova descrição do evento após atualização dos testes automatizados",
			date: "2026-01-15T16:45",
			location: "Novo local do evento atualizado",
			category: "Webinar",
		};

		cy.findAllByTestId("event-title")
			.find("input")
			.clear()
			.type(updatedData.title);
		cy.findAllByTestId("event-description")
			.clear()
			.type(updatedData.description);
		cy.findAllByTestId("event-date")
			.find("input")
			.clear()
			.type(updatedData.date);
		cy.findAllByTestId("event-location").clear().type(updatedData.location);
		cy.findByRole("combobox").click();
		cy.findAllByTestId(`event-category-${updatedData.category}`).click();
		cy.findByRole("button", { name: /salvar/i }).click();

		cy.findByRole("button", { name: /limpar filtros/i }).click();
		cy.findAllByTestId("event-title-filter").type(updatedData.title);
		cy.findAllByTestId("event-row").contains(updatedData.title).click();

		cy.findAllByText(updatedData.title).should("exist");
		cy.findAllByText(updatedData.description).should("exist");
	});

	it("should show validation errors when clearing required fields", () => {
		cy.findAllByTestId("event-title-filter").type("Evento para Edição");
		cy.findAllByTestId("event-row").contains("Evento para Edição").click();
		cy.findByRole("button", { name: /editar/i }).click();

		cy.findAllByTestId("event-title").find("input").clear();
		cy.findAllByTestId("event-description").clear();
		cy.findAllByTestId("event-date").find("input").clear();
		cy.findAllByTestId("event-location").find("input").clear();

		cy.findByRole("button", { name: /salvar/i }).click();

		cy.findByText(/título é obrigatório/i).should("exist");
		cy.findByText(/descrição é obrigatória/i).should("exist");
		cy.findByText(/data é obrigatória/i).should("exist");
		cy.findByText(/local é obrigatório/i).should("exist");
	});

	it("should cancel edit and keep original data", () => {
		cy.findAllByTestId("event-title-filter").type("Evento para Edição");
		cy.findAllByTestId("event-row").contains("Evento para Edição").click();
		cy.findByRole("button", { name: /editar/i }).click();

		cy.findAllByTestId("event-title")
			.find("input")
			.clear()
			.type("Título que não deve ser salvo");
		cy.findAllByTestId("event-description")
			.clear()
			.type("Descrição que não deve ser salva");

		cy.findByRole("button", { name: /cancelar/i }).click();

		cy.findAllByText("Evento para Edição").should("exist");
		cy.findAllByText(
			"Descrição do evento que será editado nos testes automatizados",
		).should("exist");
	});
});
