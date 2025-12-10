describe("Reader Events Features", () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.loginAsReader();
  });

  describe("Events Page Layout", () => {
    it("should display events page title", () => {
      cy.visit("/events");
      cy.contains("h1", "Events").should("be.visible");
    });

    it("should display filter section", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').should("be.visible");
    });

    it("should display tabs for upcoming and past events", () => {
      cy.visit("/events");
      cy.contains("button", "Upcoming").should("be.visible");
      cy.contains("button", "Past").should("be.visible");
    });

    it("should show event cards in grid layout", () => {
      cy.visit("/events");
      // Wait for events to load
      cy.get(".MuiCard-root").should("exist");
    });
  });

  describe("Events Tabs", () => {
    it("should default to upcoming events tab", () => {
      cy.visit("/events");
      cy.get('[role="tab"][aria-selected="true"]').should(
        "contain",
        "Upcoming",
      );
    });

    it("should switch to past events tab", () => {
      cy.visit("/events");
      cy.contains("button", "Past").click();
      cy.get('[role="tab"][aria-selected="true"]').should("contain", "Past");
    });

    it("should show badge counts on tabs", () => {
      cy.visit("/events");
      // Tabs should have badge indicators
      cy.get('[role="tab"]').first().find(".MuiBadge-badge").should("exist");
    });

    it("should update results summary when switching tabs", () => {
      cy.visit("/events");
      cy.contains("upcoming event").should("be.visible");

      cy.contains("button", "Past").click();
      cy.contains("past event").should("be.visible");
    });
  });

  describe("Search Functionality", () => {
    it("should filter events by search term", () => {
      cy.visit("/events");

      // Type search term
      cy.get('input[placeholder*="Search"]').type("Conference");

      // Wait for filter to apply
      cy.wait(500);

      // Results should be filtered (may be same, more, or less depending on data)
      cy.get(".MuiCard-root").should("exist");
    });

    it("should show filtered indicator when search is active", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').type("Test");
      cy.wait(500);
      cy.contains("(filtered)").should("be.visible");
    });

    it("should clear search with clear button", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').type("Test");
      cy.wait(500);

      // Click clear button
      cy.get('[aria-label="clear search"]').click();

      // Search input should be empty
      cy.get('input[placeholder*="Search"]').should("have.value", "");
    });

    it("should show empty state when no results match", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').type(
        "xyznonexistentevent123456789",
      );
      cy.wait(500);
      cy.contains("No upcoming events match your filters").should("be.visible");
    });
  });

  describe("Category Filter", () => {
    it("should display category filter dropdown", () => {
      cy.visit("/events");
      cy.contains("Category").should("be.visible");
    });

    it("should filter events by category", () => {
      cy.visit("/events");

      // Open category dropdown and select Conference
      cy.get("#category-filter").click();
      cy.get('[data-value="Conference"]').click();

      cy.wait(500);

      // All visible cards should have Conference category chip
      cy.get(".MuiCard-root").each(($card) => {
        cy.wrap($card).contains("Conference").should("be.visible");
      });
    });

    it("should reset category filter", () => {
      cy.visit("/events");

      // Select a category first
      cy.get("#category-filter").click();
      cy.get('[data-value="Workshop"]').click();
      cy.wait(500);

      // Click reset button
      cy.contains("button", "Reset").click();

      // Category filter should show All
      cy.get("#category-filter").should("contain", "All");
    });
  });

  describe("Sorting", () => {
    it("should have sort options for Date and Name", () => {
      cy.visit("/events");
      cy.contains("button", "Date").should("be.visible");
      cy.contains("button", "Name").should("be.visible");
    });

    it("should toggle sort order when clicking active sort button", () => {
      cy.visit("/events");

      // Date should be default active sort
      cy.contains("button", "Date").should(
        "have.class",
        "MuiButton-containedPrimary",
      );

      // Click again to toggle order (look for sort icon change)
      cy.contains("button", "Date").click();
      cy.get(
        '[data-testid="ArrowUpwardIcon"], [data-testid="ArrowDownwardIcon"]',
      ).should("exist");
    });

    it("should switch to name sorting", () => {
      cy.visit("/events");
      cy.contains("button", "Name").click();
      cy.contains("button", "Name").should(
        "have.class",
        "MuiButton-containedPrimary",
      );
    });
  });

  describe("Event Cards", () => {
    it("should display event name on card", () => {
      cy.visit("/events");
      cy.get(".MuiCard-root")
        .first()
        .find(".MuiCardContent-root")
        .should("exist");
    });

    it("should display event date and time", () => {
      cy.visit("/events");
      cy.get(".MuiCard-root")
        .first()
        .find(
          '[data-testid="CalendarTodayIcon"], [data-testid="AccessTimeIcon"]',
        )
        .should("exist");
    });

    it("should display event location", () => {
      cy.visit("/events");
      cy.get(".MuiCard-root")
        .first()
        .find('[data-testid="LocationOnIcon"]')
        .should("exist");
    });

    it("should display category chip", () => {
      cy.visit("/events");
      cy.get(".MuiCard-root").first().find(".MuiChip-root").should("exist");
    });
  });

  describe("Empty States", () => {
    it("should show empty state message when no events match filters", () => {
      cy.visit("/events");

      // Apply filters that should return no results
      cy.get('input[placeholder*="Search"]').type("xyznonexistent12345");
      cy.wait(500);

      cy.contains("No upcoming events match your filters").should("be.visible");
    });
  });

  describe("Results Summary", () => {
    it("should display results count", () => {
      cy.visit("/events");
      cy.contains(/Showing \d+ upcoming event/).should("be.visible");
    });

    it("should update count when filtering", () => {
      cy.visit("/events");

      // Apply a category filter
      cy.get("#category-filter").click();
      cy.get('[data-value="Conference"]').click();
      cy.wait(500);

      // Text should show filtered indicator
      cy.contains("(filtered)").should("be.visible");
    });
  });
});
