describe("Known issues found during exploratory testing", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should not display a null interval in the machine header", () => {
    cy.contains("Máquina 1023").should("be.visible");

    cy.get("body").should("not.contain.text", "null min");
    cy.contains("20 min").should("be.visible");
  });
});
