describe("Sensor Data API", () => {
  let dataResponse;

  const expectedSeries = [
    "accelerationRms/x",
    "accelerationRms/y",
    "accelerationRms/z",
    "velocityRms/x",
    "velocityRms/y",
    "velocityRms/z",
    "temperature",
  ];

  before(() => {
    // Faz uma única requisição para compartilhar a resposta entre os testes.
    cy.request("/data.json").then((response) => {
      dataResponse = response;
    });
  });

  it("returns a successful response", () => {
    expect(dataResponse.status).to.equal(200);
  });

  it("contains all required sensor series", () => {
    expect(dataResponse.body).to.have.all.keys(["data"]);
    expect(dataResponse.body.data)
      .to.be.an("array")
      .and.have.length(expectedSeries.length);

    const receivedSeries = dataResponse.body.data.map(
      (series) => series.name
    );

    expect(receivedSeries).to.have.members(expectedSeries);
  });

  it("returns measurements for every sensor series", () => {
    dataResponse.body.data.forEach((series) => {
      expect(series).to.have.all.keys(["name", "data"]);
      expect(
        series.data,
        `${series.name} should contain measurements`
      ).to.be.an("array").and.not.be.empty;
    });
  });

  it("returns the required fields and valid dates for every measurement", () => {
    dataResponse.body.data.forEach((series) => {
      series.data.forEach((measurement, index) => {
        expect(measurement).to.have.all.keys(["datetime", "max"]);

        expect(
          measurement.datetime,
          `${series.name} measurement ${index} should contain a datetime`
        ).to.be.a("string").and.not.be.empty;

        expect(
          Date.parse(measurement.datetime),
          `${series.name} measurement ${index} should contain a valid date`
        ).not.to.be.NaN;
      });
    });
  });

  it("returns numeric or null values for every measurement", () => {
    dataResponse.body.data.forEach((series) => {
      series.data.forEach((measurement, index) => {
        const hasValidType =
          typeof measurement.max === "number" ||
          measurement.max === null;

        expect(
          hasValidType,
          `${series.name} measurement ${index} returned ${JSON.stringify(
            measurement.max
          )}`
        ).to.equal(true);
      });
    });
  });
});