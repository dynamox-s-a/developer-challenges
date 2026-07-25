describe("Dashboard de monitoramento", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/measurements").as("measurements");
    cy.visit("/data");
    cy.wait("@measurements").its("response.statusCode").should("eq", 200);
  });

  it("carrega a máquina e os três gráficos solicitados", () => {
    cy.contains("h1", "Motor principal").should("be.visible");
    cy.contains("Sensor DYN-0427").should("be.visible");
    cy.contains("Operação normal").should("be.visible");

    cy.get('[aria-label="Gráfico de Aceleração RMS"]').should("be.visible");
    cy.get('[aria-label="Gráfico de Velocidade RMS"]').should("be.visible");
    cy.get('[aria-label="Gráfico de Temperatura"]').should("be.visible");

    cy.get(".highcharts-series").should("have.length", 7);
  });

  it("redireciona a raiz para a rota /data", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/data");
  });

  it("filtra as medições por período", () => {
    cy.get('[data-testid="date-range"]')
      .invoke("text")
      .then((completeRange) => {
        cy.contains('[role="button"]', "7 dias").click();

        cy.get('[data-testid="date-range"]')
          .should("not.have.text", completeRange)
          .and("contain.text", "dez");
        cy.contains('[role="button"]', "7 dias")
          .should("have.class", "MuiChip-filled")
          .and("have.class", "MuiChip-colorPrimary");
      });
  });

  it("sincroniza crosshair e tooltip nos três gráficos", () => {
    cy.get('[aria-label="Gráfico de Aceleração RMS"]')
      .find(".highcharts-container")
      .then(($chart) => {
        const bounds = $chart[0].getBoundingClientRect();
        cy.wrap($chart).trigger("mousemove", {
          clientX: bounds.left + bounds.width / 2,
          clientY: bounds.top + bounds.height / 2,
        });
      });

    cy.get(".synchronized-crosshair")
      .should("have.length", 3)
      .each(($crosshair) => {
        cy.wrap($crosshair)
          .should("have.attr", "d")
          .and("match", /^M /);
      });

    cy.get(".highcharts-tooltip").should("have.length", 3);
  });

  it("permite atualizar as medições pela API", () => {
    cy.contains("button", "Atualizar dados").click();
    cy.wait("@measurements").its("response.statusCode").should("eq", 200);
    cy.contains("button", "Atualizar dados").should("be.enabled");
  });
});
