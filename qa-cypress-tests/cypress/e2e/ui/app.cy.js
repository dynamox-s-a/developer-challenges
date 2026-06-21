/* Carregamento da aplicação */
describe("Application availability", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/data*").as("getData");
    cy.intercept("GET", "**/metadata*").as("getMetadata");
    cy.visit("/");
  });

  /* carrega a aplicação e exibe o título principal da página */
  it("loads the application and displays the main page title", () => {
    cy.contains("h1, h2, h3, strong, b, div", /Análise de dados/i).should("be.visible");
  });

  /* faz as requisições de dados do sensor e metadados ao acessar a página */
  it("requests sensor data and metadata when the page is accessed", () => {
    cy.wait("@getData").its("response.statusCode").should("be.oneOf", [200, 304]);
    cy.wait("@getMetadata").its("response.statusCode").should("be.oneOf", [200, 304]);
  });

  /* faz novas requisições de dados e metadados após recarregar a página */
  it("requests data and metadata again after reloading the page", () => {
    cy.wait("@getData");
    cy.wait("@getMetadata");

    cy.reload();

    cy.wait("@getData").its("response.statusCode").should("be.oneOf", [200, 304]);
    cy.wait("@getMetadata").its("response.statusCode").should("be.oneOf", [200, 304]);
  });
});
