describe("Machine information header", () => {
  beforeEach(() => {
    // Registra a interceptação antes da navegação para capturar a requisição inicial.
    cy.intercept("GET", "**/metadata.json").as("getMetadata");
    cy.visit("/");
  });

  it("displays the machine and monitoring point returned by the API", () => {
    cy.wait("@getMetadata")
      .its("response.body")
      .then(({ machine, spot }) => {
        // Compara a interface com os valores recebidos da API.
        cy.contains(machine).should("be.visible");
        cy.contains(spot).should("be.visible");
      });
  });

  it("displays the RPM and dynamic range returned by the API", () => {
    cy.wait("@getMetadata")
      .its("response.body")
      .then(({ rpm, dynamicRange }) => {
        // Usa correspondência exata para evitar localizar números dos gráficos.
        cy.contains(new RegExp(`^${rpm}$`)).should("be.visible");
        cy.contains(dynamicRange).should("be.visible");
      });
  });
});