describe("Metadata API", () => {
  let metadataResponse;

  before(() => {
    // Faz uma única requisição para compartilhar a mesma resposta entre os testes.
    cy.request("/metadata.json").then((response) => {
      metadataResponse = response;
    });
  });

  it("returns a successful response", () => {
    expect(metadataResponse.status).to.equal(200);
  });

  it("contains all required metadata fields", () => {
    const expectedFields = [
      "machine",
      "spot",
      "rpm",
      "dynamicRange",
      "interval",
    ];

    expect(metadataResponse.body).to.have.all.keys(expectedFields);
  });

  it("returns valid machine metadata", () => {
    const { machine, spot, rpm, dynamicRange } = metadataResponse.body;

    expect(machine).to.be.a("string").and.not.be.empty;
    expect(spot).to.be.a("string").and.not.be.empty;
    expect(rpm).to.be.a("string").and.not.be.empty;
    expect(dynamicRange).to.be.a("string").and.not.be.empty;
  });

  it("returns the metadata displayed in the machine header", () => {
    const { machine, spot, rpm, dynamicRange } = metadataResponse.body;

    expect(machine).to.equal("Máquina 1023");
    expect(spot).to.equal("Ponto 20192");
    expect(rpm).to.equal("200");
    expect(dynamicRange).to.equal("16g");
  });

  it("returns a valid monitoring interval", () => {
    expect(metadataResponse.body.interval).to.be.a("number");
    expect(metadataResponse.body.interval).to.equal(20);
  });
});