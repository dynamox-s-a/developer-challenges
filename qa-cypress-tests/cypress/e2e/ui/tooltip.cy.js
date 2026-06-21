describe("Chart tooltips", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  function moveMouseThroughChart(chartIndex) {
    // Seleciona o gráfico pelo índice:
    // 0 = Aceleração RMS
    // 1 = Temperatura
    // 2 = Velocidade RMS
    cy.get(".highcharts-container")
      .eq(chartIndex)
      .scrollIntoView()
      .then(($chart) => {
        const rect = $chart[0].getBoundingClientRect();

        // Tenta passar o mouse por vários pontos da área do gráfico.
        // Isso aumenta a chance de passar exatamente sobre uma série/valor.
        const positions = [
          [0.25, 0.45],
          [0.35, 0.45],
          [0.45, 0.45],
          [0.55, 0.45],
          [0.65, 0.45],
          [0.75, 0.45],
        ];

        positions.forEach(([xRatio, yRatio]) => {
          cy.wrap($chart).realMouseMove(
            rect.width * xRatio,
            rect.height * yRatio,
            { position: "topLeft" }
          );
        });
      });
  }

  function checkTooltipContent(expectedValuePattern) {
  cy.get(".highcharts-tooltip")
    .should("be.visible")
    .and(($tooltip) => {
      const tooltipText = $tooltip.text().trim();

      // Valida que o tooltip apresenta horário no formato hh:mm:ss.
      expect(tooltipText).to.match(/\d{1,2}:\d{2}:\d{2}/);

      // Valida o nome da série e seu respectivo valor numérico.
      expect(tooltipText).to.match(expectedValuePattern);
    });
}

  it("displays tooltip on RMS Acceleration chart", () => {
  moveMouseThroughChart(0);

  checkTooltipContent(
    /(Axial|Horizontal|Radial):\s*-?\d+(?:[.,]\d+)?/
  );
});

it("displays tooltip on Temperature chart", () => {
  moveMouseThroughChart(1);

  checkTooltipContent(
    /Temperatura:\s*-?\d+(?:[.,]\d+)?/
  );
});

it("displays tooltip on RMS Velocity chart", () => {
  moveMouseThroughChart(2);

  checkTooltipContent(
    /(Axial|Horizontal|Radial):\s*-?\d+(?:[.,]\d+)?/
  );
});
});