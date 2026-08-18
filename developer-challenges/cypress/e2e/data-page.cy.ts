describe("/data", () => {
	beforeEach(() => {
		cy.visit("/data");
		cy.get(".highcharts-container").should("have.length", 3);
	});

	it("renders the machine header and the three charts", () => {
		cy.contains("h5", "Análise de Dados").should("be.visible");
		cy.contains("p", "Máquina").should("be.visible");
		cy.contains("p", "Ponto").should("be.visible");
		cy.contains("h6", "Aceleração RMS").should("be.visible");
		cy.contains("h6", "Temperatura").should("be.visible");
		cy.contains("h6", "Velocidade RMS").should("be.visible");
	});
});

describe("unknown route", () => {
	it("shows the 404 page", () => {
		cy.visit("/rota-que-nao-existe");
		cy.contains("404").should("be.visible");
	});
});
