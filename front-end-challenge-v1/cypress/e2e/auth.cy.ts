describe("Authentication", () => {
  beforeEach(() => {
    cy.clearAuth();
  });

  describe("Login Page", () => {
    it("should display login form", () => {
      cy.visit("/login");
      cy.contains("Sign in to your account").should("be.visible");
      cy.get('[data-testid="email-input"]').should("be.visible");
      cy.get('[data-testid="password-input"]').should("be.visible");
      cy.get('[data-testid="login-button"]').should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      cy.visit("/login");
      cy.get('[data-testid="login-button"]').click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it("should show validation error for invalid email format", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').type("invalid-email", { delay: 0 });
      cy.get('[data-testid="password-input"]').type("password123", { delay: 0 });
      cy.get('[data-testid="login-button"]').click();
      cy.contains("Please enter a valid email address").should("be.visible");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').type("wrong@email.com", {
        delay: 0,
      });
      cy.get('[data-testid="password-input"]').type("wrongpassword", {
        delay: 0,
      });
      cy.get('[data-testid="login-button"]').click();
      cy.contains("Invalid email or password").should("be.visible");
    });
  });

  describe("Admin Login", () => {
    it("should login as admin and redirect to admin dashboard", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').type("admin@events.com", {
        delay: 0,
      });
      cy.get('[data-testid="password-input"]').type("admin123", { delay: 0 });
      cy.get('[data-testid="login-button"]').click();

      cy.url({ timeout: 15000 }).should("include", "/admin");
      cy.contains("Admin Dashboard").should("be.visible");
    });

    it("should display admin role chip in header", () => {
      cy.loginAsAdmin();
      cy.contains("admin").should("be.visible");
    });

    it("should show Admin Dashboard link in navigation", () => {
      cy.loginAsAdmin();
      cy.contains("Admin Dashboard").should("be.visible");
    });
  });

  describe("Reader Login", () => {
    it("should login as reader and redirect to events page", () => {
      cy.visit("/login");
      cy.get('[data-testid="email-input"]').type("reader@events.com", {
        delay: 0,
      });
      cy.get('[data-testid="password-input"]').type("reader123", { delay: 0 });
      cy.get('[data-testid="login-button"]').click();

      cy.url({ timeout: 15000 }).should("include", "/events");
      cy.contains("Events").should("be.visible");
    });

    it("should display reader role chip in header", () => {
      cy.loginAsReader();
      cy.contains("reader").should("be.visible");
    });

    it("should NOT show Admin Dashboard link for readers", () => {
      cy.loginAsReader();
      cy.get("header").should("not.contain", "Admin Dashboard");
    });
  });

  describe("Logout", () => {
    it("should logout admin and redirect to login", () => {
      cy.loginAsAdmin();
      cy.logout();
      cy.url().should("include", "/login");
    });

    it("should logout reader and redirect to login", () => {
      cy.loginAsReader();
      cy.logout();
      cy.url().should("include", "/login");
    });

    it("should clear auth token from localStorage on logout", () => {
      cy.loginAsAdmin();
      cy.window().then((win) => {
        expect(win.localStorage.getItem("event_management_auth")).to.exist;
      });
      cy.logout();
      cy.window().then((win) => {
        expect(win.localStorage.getItem("event_management_auth")).to.be.null;
      });
    });
  });

  describe("Protected Routes", () => {
    it("should redirect unauthenticated users to login", () => {
      cy.visit("/events");
      cy.url().should("include", "/login");
    });

    it("should redirect unauthenticated users from admin to login", () => {
      cy.visit("/admin");
      cy.url().should("include", "/login");
    });

    it("should redirect readers from admin pages to events", () => {
      cy.loginAsReader();
      cy.visit("/admin");
      cy.url().should("include", "/events");
    });

    it("should allow admin to access admin pages", () => {
      cy.loginAsAdmin();
      cy.visit("/admin/events");
      cy.url().should("include", "/admin/events");
      cy.contains("Manage Events").should("be.visible");
    });
  });

  describe("Session Persistence", () => {
    it("should persist login across page reload", () => {
      cy.loginAsAdmin();
      cy.reload();
      cy.url().should("include", "/admin");
      cy.contains("Admin Dashboard").should("be.visible");
    });
  });
});
