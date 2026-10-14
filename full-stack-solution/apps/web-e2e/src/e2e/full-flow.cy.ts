/// <reference types="cypress" />

import "../support/commands";

/**
 * One full user flow against the real stack: the dev server, the Express API
 * and PostgreSQL. Nothing is stubbed.
 *
 * The data is named with a run-specific suffix so a run never collides with
 * another or with data a human left behind, and the machine is deleted at the
 * end — the cascade takes its points, sensor and readings with it.
 */
const runId = Date.now();
const machineName = `E2E Fan ${runId}`;
const pointA = `E2E point A ${runId}`;
const pointB = `E2E point B ${runId}`;
const sensorId = `E2E-${runId}`;

// `testIsolation: false` keeps one browser session across the steps. The steps
// are a sequence — a machine has to exist before a point can be added to it —
// and Cypress otherwise clears storage between tests, which would log the user
// out after the first one.
describe("managing an asset end to end", { testIsolation: false }, () => {
  before(() => {
    cy.login();
  });

  after(() => {
    // Cleanup goes straight to the API with a token of its own: it has to work
    // after the sign-out step, and after a failure anywhere above.
    cy.env<{ seedEmail: string; seedPassword: string }>([
      "seedEmail",
      "seedPassword",
    ]).then(({ seedEmail, seedPassword }) =>
      cy
        .request<{ accessToken: string }>({
          method: "POST",
          url: "/api/auth/login",
          body: { email: seedEmail, password: seedPassword },
        })
        .then(({ body: { accessToken } }) => {
          const auth = { Authorization: `Bearer ${accessToken}` };

          cy.request<Array<{ id: string; name: string }>>({
            url: "/api/machines",
            headers: auth,
          }).then(({ body }) => {
            const machine = body.find((item) => item.name === machineName);
            if (machine) {
              cy.request({
                method: "DELETE",
                url: `/api/machines/${machine.id}`,
                headers: auth,
              });
            }
          });
        }),
    );
  });

  it("creates a machine", () => {
    cy.visit("/machines");
    cy.contains("button", "Add machine").click();

    cy.get('input[name="name"]').type(machineName);
    cy.selectOption("Type", "Fan");
    cy.contains("button", "Create machine").click();

    cy.contains(machineName).should("be.visible");
    // A machine with no points is flagged, since two are recommended.
    cy.contains("tr", machineName).contains("Needs 2").should("be.visible");
  });

  it("adds two monitoring points to it", () => {
    cy.visit("/machines");

    for (const name of [pointA, pointB]) {
      cy.get(`[aria-label="Add monitoring point to ${machineName}"]`).click();
      cy.get('input[name="name"]').type(name);
      cy.contains("button", "Create").click();
      cy.contains("tr", machineName).should("exist");
    }

    // Two points reached: the warning is gone.
    cy.contains("tr", machineName).contains("Needs 2").should("not.exist");
  });

  it("lists the points with the four required columns, sortable", () => {
    cy.visit("/monitoring-points");

    for (const header of [
      "Machine name",
      "Machine type",
      "Monitoring point name",
      "Sensor model",
    ]) {
      cy.contains("th", header).should("be.visible");
    }

    // A new column starts ascending; clicking the active one flips it.
    cy.contains("th", "Monitoring point name").click();
    cy.contains("th", "Monitoring point name").should(
      "have.attr",
      "aria-sort",
      "ascending",
    );

    cy.contains("th", "Monitoring point name").click();
    cy.contains("th", "Monitoring point name").should(
      "have.attr",
      "aria-sort",
      "descending",
    );
  });

  it("installs a sensor allowed on a Fan", () => {
    cy.visit("/monitoring-points");
    cy.contains("tr", pointA).find('[aria-label*="sensor"]').first().click();

    cy.get('input[name="id"]').type(sensorId);
    cy.selectOption("Sensor model", "TcAg");
    cy.contains("button", "Assign sensor").click();

    cy.contains("tr", pointA).contains("TcAg").should("be.visible");
  });

  it("refuses to turn the machine into a Pump while TcAg is installed", () => {
    cy.intercept("PATCH", "/api/machines/*").as("updateMachine");

    cy.visit("/machines");
    cy.get(`[aria-label="Edit ${machineName}"]`).click();

    cy.selectOption("Type", "Pump");
    cy.contains("button", "Save changes").click();

    // Waiting on the response instead of racing the dialog transition, and
    // asserting the status the rule promises.
    cy.wait("@updateMachine").its("response.statusCode").should("eq", 409);

    // BR-2: the payload is valid, the current state refuses it (409). The
    // assertion is scoped to the dialog, which stays open so the user can
    // correct the input — and is closed here, because the next step would
    // otherwise find the screen covered by it.
    // The dialog stays open with the server's message so the user can correct
    // the input. Asserted on content rather than visibility: MUI animates the
    // dialog as it grows, and `checkVisibility()` is briefly false mid-growth.
    cy.get('[role="dialog"]').should("contain", "Pump");
    cy.get('[role="dialog"]').contains("button", "Cancel").click();

    cy.get('[role="dialog"]').should("not.exist");
    cy.contains("tr", machineName).contains("Fan").should("be.visible");
  });

  it("stores readings and charts them with their unit", () => {
    cy.intercept("POST", "/api/monitoring-points/*/readings").as("ingest");

    cy.visit("/time-series");
    cy.selectOption("Monitoring point", pointA);
    cy.contains("button", "Send readings").click();

    // The dialog pre-fills a valid sample for the chosen quantity.
    cy.selectOption("Quantity for the generated sample", /Temperature/);
    cy.contains("button", "Generate").click();
    cy.get('[role="dialog"]').contains("button", "Send").click();

    cy.wait("@ingest").its("response.statusCode").should("eq", 201);

    cy.contains(/readings stored/i).should("be.visible");
    // The axis names the quantity and its unit, exactly once.
    cy.contains("Temperature (°C)").should("be.visible");
    cy.get(".recharts-line").should("exist");
  });

  it("signs out and keeps the private area closed", () => {
    cy.get('[aria-label="Open account menu"]').click();
    cy.contains("Sign out").click();

    cy.location("pathname").should("eq", "/login");

    cy.visit("/machines");
    cy.location("pathname").should("eq", "/login");
  });
});
