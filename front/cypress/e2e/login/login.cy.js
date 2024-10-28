describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("https://dynamox-test.netlify.app/routes/login");
  });

  it("should display error messages for empty fields", () => {
    cy.visit("https://dynamox-test.netlify.app/routes/login");
    cy.get('button[type="submit"]').click();

    cy.contains("This field is required").should("exist");
  });

  it("should display error message for invalid email", () => {
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[name="password"]').type("somepassword");

    cy.get('button[type="submit"]').click();

    cy.contains("Please enter a valid email address").should("exist");
  });

  it("should display error message on login failure", () => {
    cy.intercept("POST", "https://dynamox-test.netlify.app/routes/login", {
      statusCode: 500,
    });

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("validpassword");

    cy.get('button[type="submit"]').click();

    cy.contains("Invalid email or password. Verify!.").should("exist");
  });
});
