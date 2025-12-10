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
    it("should display events table", () => {
      cy.visit("/admin/events");
      cy.contains("Manage Events").should("be.visible");
      cy.get("table").should("be.visible");
    });

    it("should have sortable columns", () => {
      cy.visit("/admin/events");
      cy.contains("th", "Name").should("be.visible");
      cy.contains("th", "Date & Time").should("be.visible");
    });

    it("should navigate to create event from list page", () => {
      cy.visit("/admin/events");
      cy.contains("button", "Create Event").click();
      cy.url().should("include", "/admin/events/new");
    });

    it("should have edit buttons for each event", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="edit"]').should("exist");
    });

    it("should have delete buttons for each event", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="delete"]').should("exist");
    });
  });

  describe("Create Event", () => {
    beforeEach(() => {
      cy.visit("/admin/events/new");
    });

    it("should display create event form", () => {
      cy.contains("Create New Event").should("be.visible");
      cy.get('input[name="name"]').should("be.visible");
      cy.get('input[name="dateTime"]').should("be.visible");
      cy.get('input[name="location"]').should("be.visible");
      cy.get('textarea[name="description"]').should("be.visible");
    });

    it("should show validation errors for empty form submission", () => {
      cy.contains("button", "Create Event").click();
      cy.contains("Name is required").should("be.visible");
    });

    it("should show validation error for short description", () => {
      cy.get('input[name="name"]').type("Test Event");
      cy.get('input[name="location"]').type("Test Location");
      cy.get('textarea[name="description"]').type("Too short");
      // Set future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const formattedDate = futureDate.toISOString().slice(0, 16);
      cy.get('input[name="dateTime"]').type(formattedDate);

      cy.contains("button", "Create Event").click();
      cy.contains("Description must be at least 50 characters").should(
        "be.visible",
      );
    });

    it("should create a new event successfully", () => {
      cy.fixture("events").then((events) => {
        const { newEvent } = events;

        cy.get('input[name="name"]').type(newEvent.name);
        cy.get('input[name="location"]').type(newEvent.location);
        cy.get('textarea[name="description"]').type(newEvent.description);

        // Set future date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const formattedDate = futureDate.toISOString().slice(0, 16);
        cy.get('input[name="dateTime"]').type(formattedDate);

        // Select category
        cy.get("#category").click();
        cy.get(`[data-value="${newEvent.category}"]`).click();

        cy.contains("button", "Create Event").click();

        // Should redirect to events list
        cy.url().should("include", "/admin/events");
        cy.url().should("not.include", "/new");

        // New event should appear in the list
        cy.contains(newEvent.name).should("be.visible");
      });
    });

    it("should navigate back to events list", () => {
      cy.contains("button", "Back to Events").click();
      cy.url().should("include", "/admin/events");
      cy.url().should("not.include", "/new");
    });
  });

  describe("Edit Event", () => {
    it("should navigate to edit page from events list", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="edit"]').first().click();
      cy.url().should("match", /\/admin\/events\/[\w-]+\/edit/);
      cy.contains("Edit Event").should("be.visible");
    });

    it("should pre-populate form with event data", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="edit"]').first().click();

      // Form fields should have values
      cy.get('input[name="name"]').should("not.have.value", "");
      cy.get('input[name="location"]').should("not.have.value", "");
      cy.get('textarea[name="description"]').should("not.have.value", "");
    });

    it("should update event successfully", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="edit"]').first().click();

      // Clear and update name
      cy.get('input[name="name"]').clear().type("Updated Event Name");

      cy.contains("button", "Update Event").click();

      // Should redirect back to list
      cy.url().should("include", "/admin/events");
      cy.url().should("not.include", "/edit");

      // Updated name should appear
      cy.contains("Updated Event Name").should("be.visible");
    });
  });

  describe("Delete Event", () => {
    it("should show confirmation dialog when clicking delete", () => {
      cy.visit("/admin/events");
      cy.get('[aria-label="delete"]').first().click();

      // Confirmation dialog should appear
      cy.contains("Delete Event").should("be.visible");
      cy.contains("Are you sure you want to delete").should("be.visible");
    });

    it("should cancel deletion when clicking cancel", () => {
      cy.visit("/admin/events");

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
      cy.visit("/admin/events");

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
