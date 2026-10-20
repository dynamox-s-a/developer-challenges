const TOOLTIP_DATE = /\d+\. \S+ \d{4}, \d{2}:\d{2}/;

describe("/data", () => {
  it("redirects the root path to /data", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/data");
  });

  it("shows the machine info and three charts", () => {
    cy.visit("/data");

    cy.contains("h1", "Análise de Dados");
    cy.contains("Máquina 1023");
    cy.contains("Ponto 20192");
    for (const title of ["Aceleração RMS", "Temperatura", "Velocidade RMS"]) {
      cy.contains("section h2", title);
    }
    cy.get(".highcharts-container").should("have.length", 3);
  });

  it("syncs the tooltip and crosshair across charts on hover", () => {
    cy.visit("/data");
    cy.get(".highcharts-container").should("have.length", 3);

    cy.get(".highcharts-container")
      .eq(1)
      .trigger("mousemove", 400, 150)
      .trigger("mousemove", 405, 150);

    cy.get(".highcharts-crosshair").should("have.length", 3);
    cy.get(".highcharts-tooltip")
      .should("have.length", 3)
      .then(($tooltips) => {
        const dates = [...$tooltips].map(
          (tooltip) => tooltip.textContent?.match(TOOLTIP_DATE)?.[0],
        );
        expect(dates[0]).to.match(TOOLTIP_DATE);
        expect(new Set(dates).size).to.eq(1);
      });
  });

  it("shows an error and recovers on retry", () => {
    cy.intercept("GET", "**/machine", { statusCode: 500, body: {} }).as(
      "failed",
    );
    cy.visit("/data");
    cy.wait("@failed");
    cy.get("[role=alert]").should("contain", "Não foi possível carregar");

    cy.intercept("GET", "**/machine", (req) => req.continue());
    cy.contains("button", "Tentar novamente").click();

    cy.get(".highcharts-container").should("have.length", 3);
    cy.contains("Máquina 1023");
  });
});
