const chartExpectations = [
  {
    title: "Aceleração RMS",
    legends: ["Axial", "Horizontal", "Radial"],
  },
  {
    title: "Temperatura",
    legends: ["Temperatura"],
  },
  {
    title: "Velocidade RMS",
    legends: ["Axial", "Horizontal", "Radial"],
  },
];

describe("Time series charts", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".highcharts-container").should("have.length", 3);
  });

  it("displays the three required chart sections", () => {
    chartExpectations.forEach(({ title }) => {
      cy.contains(title).should("be.visible");
    });
  });

  it("renders visible data series in every chart", () => {
    chartExpectations.forEach(({ title }, chartIndex) => {
      // O índice relaciona cada título ao gráfico exibido na mesma ordem.
      cy.log(`Validating data series for ${title}`);

      cy.get(".highcharts-container")
        .eq(chartIndex)
        .within(() => {
          cy.get(".highcharts-series .highcharts-graph")
            .should("have.length.greaterThan", 0)
            .and("be.visible");
        });
    });
  });

  it("displays the expected legends in every chart", () => {
    chartExpectations.forEach(({ title, legends }, chartIndex) => {
      cy.log(`Validating legends for ${title}`);

      cy.get(".highcharts-container")
        .eq(chartIndex)
        .within(() => {
          cy.get(".highcharts-legend").should("be.visible");

          legends.forEach((legend) => {
            cy.contains(".highcharts-legend-item", legend)
              .should("be.visible");
          });
        });
    });
  });
});