describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("https://dynamox-test.netlify.app/routes/register");
  });

  it("should display the registration form", () => {
    cy.get("h1").contains("Register User").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="passwordConfirmation"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Register").should("be.visible");
  });

  it("should register successfully with valid credentials", () => {
    cy.intercept(
      "POST",
      "https://dynamox-test.netlify.app/routes/register/auth/register",
      {
        statusCode: 201,
        body: {
          message: "User registered successfully",
        },
      }
    );

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("validpassword");
    cy.get('input[name="passwordConfirmation"]').type("validpassword");

    cy.get('button[type="submit"]').click();

    cy.url().should(
      "include",
      "https://dynamox-test.netlify.app/routes/register/routes/login"
    );
  });

  it("should show validation errors for invalid input", () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="email"]')
      .parent()
      .find(".MuiFormHelperText-root")
      .should("contain", "This field is required");
    cy.get('input[name="password"]')
      .parent()
      .find(".MuiFormHelperText-root")
      .should("contain", "This field is required");
    cy.get('input[name="email"]')
      .siblings(".MuiFormHelperText-root")
      .should("contain", "This field is required");
  });

  it("should show password mismatch error", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("validpassword");
    cy.get('input[name="passwordConfirmation"]').type("differentpassword");

    cy.get('button[type="submit"]').click();

    cy.get('input[name="passwordConfirmation"]')
      .parent()
      .find(".MuiFormHelperText-root")
      .should("contain", "Passwords do not match");
  });
});
