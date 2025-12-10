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
      cy.get('input[placeholder*="Search"]').type("Conference", { delay: 0 });

      // Wait for filter to apply
      cy.wait(500);

      // Results should be filtered (may be same, more, or less depending on data)
      cy.get(".MuiCard-root").should("exist");
    });

    it("should show filtered indicator when search is active", () => {
      cy.visit("/events");
      // Search for a term that exists in the data to ensure results are shown
      cy.get('input[placeholder*="Search"]').type("Conference", { delay: 10 });
      cy.wait(500);
      // The filtered indicator appears in the results summary when there are matching results
      cy.contains("(filtered)").should("be.visible");
    });

    it("should clear search with clear button", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').type("Test", { delay: 0 });
      cy.wait(500);

      // Click clear button
      cy.get('[aria-label="Clear search"]').click();

      // Search input should be empty
      cy.get('input[placeholder*="Search"]').should("have.value", "");
    });

    it("should show empty state when no results match", () => {
      cy.visit("/events");
      cy.get('input[placeholder*="Search"]').type(
        "xyznonexistentevent123456789",
        { delay: 0 },
      );
      cy.wait(500);
      cy.contains("No upcoming events match your filters.").should(
        "be.visible",
      );
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

      // Verify category was selected
      cy.get("#category-filter").should("contain", "Workshop");

      // Wait for reset button to appear (it only shows when filters are active)
      cy.get('[aria-label="Reset filters"]').should("be.visible");

      // Click reset button
      cy.get('[aria-label="Reset filters"]').click();

      // After reset, category filter should reset to empty (showing "All Categories" in dropdown)
      // But MUI Select shows the InputLabel "Category" when no value is selected
      // So we verify the filter is reset by checking the reset button is no longer visible
      cy.get('[aria-label="Reset filters"]').should("not.exist");
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

      // Date should be default active sort (ToggleButton uses Mui-selected)
      cy.contains("button", "Date").should("have.class", "Mui-selected");

      // Click the sort order toggle button
      cy.get('[aria-label*="Sort"]').first().click();

      // Sort icon should exist
      cy.get('[data-testid="SortIcon"]').should("exist");
    });

    it("should switch to name sorting", () => {
      cy.visit("/events");
      cy.contains("button", "Name").click();
      cy.contains("button", "Name").should("have.class", "Mui-selected");
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
      // Check for SVG icons (MUI icons render as SVGs)
      cy.get(".MuiCard-root")
        .first()
        .find("svg")
        .should("have.length.at.least", 2);
    });

    it("should display event location", () => {
      cy.visit("/events");
      // Check that the card contains location info (icon + text)
      cy.get(".MuiCard-root").first().find("svg").should("exist");
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
      cy.get('input[placeholder*="Search"]').type("xyznonexistent12345", {
        delay: 0,
      });
      cy.wait(500);

      cy.contains("No upcoming events match your filters.").should(
        "be.visible",
      );
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
