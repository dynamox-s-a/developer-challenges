describe("Admin Events Management", () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.loginAsAdmin();
  });

  describe("Admin Dashboard", () => {
    it("should display event statistics cards", () => {
      cy.visit("/admin");
      cy.contains("Total Events").should("be.visible");
      cy.contains("Upcoming Events").should("be.visible");
      cy.contains("Past Events").should("be.visible");
    });

    it("should have quick action buttons", () => {
      cy.visit("/admin");
      cy.contains("button", "Create New Event").should("be.visible");
      cy.contains("button", "Manage Events").should("be.visible");
    });

    it("should navigate to create event page", () => {
      cy.visit("/admin");
      cy.contains("button", "Create New Event").click();
      cy.url().should("include", "/admin/events/new");
    });

    it("should navigate to manage events page", () => {
      cy.visit("/admin");
      cy.contains("button", "Manage Events").click();
      cy.url().should("include", "/admin/events");
    });
  });

  describe("Events List", () => {
    beforeEach(() => {
      cy.visit("/admin/events");
      // Wait for page to fully load and table to be visible
      cy.contains("Manage Events").should("be.visible");
      cy.get("table").should("be.visible");
    });

    it("should display events table", () => {
      cy.contains("Manage Events").should("be.visible");
      cy.get("table").should("be.visible");
    });

    it("should have sortable columns", () => {
      cy.contains("th", "Name").should("be.visible");
      cy.contains("th", "Date & Time").should("be.visible");
    });

    it("should navigate to create event from list page", () => {
      cy.contains("button", "Create Event").click();
      cy.url().should("include", "/admin/events/new");
    });

    it("should have edit buttons for each event", () => {
      cy.get('[aria-label="edit"]').should("exist");
    });

    it("should have delete buttons for each event", () => {
      cy.get('[aria-label="delete"]').should("exist");
    });
  });

  describe("Create Event", () => {
    beforeEach(() => {
      cy.visit("/admin/events/new");
    });

    it("should display create event form", () => {
      cy.contains("Create New Event").should("be.visible");
      cy.get('[data-testid="event-name-input"]').should("be.visible");
      cy.get('[data-testid="event-datetime-input"]').should("be.visible");
      cy.get('[data-testid="event-location-input"]').should("be.visible");
      cy.get('[data-testid="event-description-input"]').should("be.visible");
    });

    it("should show validation errors for empty form submission", () => {
      cy.get('[data-testid="event-submit-button"]')
        .should("be.visible")
        .click();
      cy.contains("Event name is required").should("be.visible");
    });

    it("should show validation error for short description", () => {
      cy.get('[data-testid="event-name-input"]').should("be.visible");
      cy.get('[data-testid="event-name-input"]').type("Test Event", {
        delay: 0,
      });
      cy.get('[data-testid="event-location-input"]').type("Test Location", {
        delay: 0,
      });
      cy.get('[data-testid="event-description-input"]').type("Too short", {
        delay: 0,
      });
      // Set future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const formattedDate = futureDate.toISOString().slice(0, 16);
      cy.get('[data-testid="event-datetime-input"]').type(formattedDate, {
        delay: 0,
      });

      cy.get('[data-testid="event-submit-button"]').click();
      cy.contains("Description must be at least 50 characters").should(
        "be.visible",
      );
    });

    it("should create a new event successfully", () => {
      cy.fixture("events").then((events) => {
        const { newEvent } = events;

        // Wait for form to be fully loaded
        cy.get('[data-testid="event-name-input"]').should("be.visible");

        // Select category first to avoid re-render issues
        cy.get("#category").click();
        cy.get(`[data-value="${newEvent.category}"]`).click();

        // Fill in fields with small delay to allow React state to settle
        cy.get('[data-testid="event-name-input"]').type(newEvent.name, {
          delay: 10,
        });
        cy.get('[data-testid="event-location-input"]').type(newEvent.location, {
          delay: 10,
        });
        cy.get('[data-testid="event-description-input"]').type(
          newEvent.description,
          { delay: 10 },
        );

        // Set future date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const formattedDate = futureDate.toISOString().slice(0, 16);
        cy.get('[data-testid="event-datetime-input"]').type(formattedDate, {
          delay: 10,
        });

        // Submit form
        cy.get('[data-testid="event-submit-button"]').click();

        // Should redirect to events list
        cy.url({ timeout: 15000 }).should("include", "/admin/events");
        cy.url().should("not.include", "/new");

        // New event should appear in the list
        cy.contains(newEvent.name).should("be.visible");
      });
    });

    it("should navigate back to events list", () => {
      cy.get('[data-testid="event-cancel-button"]')
        .should("be.visible")
        .click();
      cy.url().should("include", "/admin/events");
      cy.url().should("not.include", "/new");
    });
  });

  describe("Edit Event", () => {
    beforeEach(() => {
      cy.visit("/admin/events");
      // Wait for events table to load
      cy.contains("Manage Events").should("be.visible");
      cy.get("table").should("be.visible");
      cy.get('[aria-label="edit"]').should("exist");
    });

    it("should navigate to edit page from events list", () => {
      cy.get('[aria-label="edit"]').first().click();
      cy.url().should("match", /\/admin\/events\/[\w-]+\/edit/);
      cy.contains("Edit Event").should("be.visible");
    });

    it("should pre-populate form with event data", () => {
      cy.get('[aria-label="edit"]').first().click();

      // Form fields should have values
      cy.get('[data-testid="event-name-input"]').should("not.have.value", "");
      cy.get('[data-testid="event-location-input"]').should(
        "not.have.value",
        "",
      );
      cy.get('[data-testid="event-description-input"]').should(
        "not.have.value",
        "",
      );
    });

    it("should update event successfully", () => {
      cy.get('[aria-label="edit"]').first().click();

      // Wait for form to load with event data
      cy.get('[data-testid="event-name-input"]').should("be.visible");
      cy.get('[data-testid="event-name-input"]').should("not.have.value", "");

      // Clear and update name with delay to let React state settle
      cy.get('[data-testid="event-name-input"]').clear();
      cy.get('[data-testid="event-name-input"]').type("Updated Event Name", {
        delay: 10,
      });

      // Submit form
      cy.get('[data-testid="event-submit-button"]').click();

      // Should redirect back to list
      cy.url({ timeout: 15000 }).should("include", "/admin/events");
      cy.url().should("not.include", "/edit");

      // Updated name should appear
      cy.contains("Updated Event Name").should("be.visible");
    });
  });

  describe("Delete Event", () => {
    beforeEach(() => {
      cy.visit("/admin/events");
      // Wait for events table to load
      cy.contains("Manage Events").should("be.visible");
      cy.get("table").should("be.visible");
      cy.get('[aria-label="delete"]').should("exist");
    });

    it("should show confirmation dialog when clicking delete", () => {
      cy.get('[aria-label="delete"]').first().click();

      // Confirmation dialog should appear
      cy.contains("Delete Event").should("be.visible");
      cy.contains("Are you sure you want to delete").should("be.visible");
    });

    it("should cancel deletion when clicking cancel", () => {
      // Get initial row count
      cy.get("tbody tr").then(($rows) => {
        const initialCount = $rows.length;

        cy.get('[aria-label="delete"]').first().click();
        cy.contains("button", "Cancel").click();

        // Dialog should close
        cy.contains("Are you sure you want to delete").should("not.exist");

        // Row count should remain same
        cy.get("tbody tr").should("have.length", initialCount);
      });
    });

    it("should delete event when confirming", () => {
      // Get initial row count
      cy.get("tbody tr").then(($rows) => {
        const initialCount = $rows.length;

        cy.get('[aria-label="delete"]').first().click();
        cy.contains("button", "Delete").click();

        // Wait for deletion to complete
        cy.get("tbody tr").should("have.length", initialCount - 1);
      });
    });
  });
});
