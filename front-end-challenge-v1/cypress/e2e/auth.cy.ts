describe("Authentication", () => {
  beforeEach(() => {
    cy.clearAuth();
  });

  describe("Login Page", () => {
    it("should display login form", () => {
      cy.visit("/login");
      cy.contains("Sign in to your account").should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      cy.visit("/login");
      cy.get('button[type="submit"]').click();
      cy.contains("Email is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it("should show validation error for invalid email format", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type("invalid-email");
      cy.get('input[name="password"]').type("password123");
      cy.get('button[type="submit"]').click();
      cy.contains("Please enter a valid email").should("be.visible");
    });

    it("should show error for invalid credentials", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type("wrong@email.com");
      cy.get('input[name="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();
      cy.contains("Invalid email or password").should("be.visible");
    });
  });

  describe("Admin Login", () => {
    it("should login as admin and redirect to admin dashboard", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type("admin@events.com");
      cy.get('input[name="password"]').type("admin123");
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/admin");
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
      cy.get('input[name="email"]').type("reader@events.com");
      cy.get('input[name="password"]').type("reader123");
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/events");
      cy.contains("Events").should("be.visible");
    });

    it("should display reader role chip in header", () => {
      cy.loginAsReader();
      cy.contains("reader").should("be.visible");
    });

    it("should NOT show Admin Dashboard link for readers", () => {
      cy.loginAsReader();
      cy.get("nav").should("not.contain", "Admin Dashboard");
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
        expect(win.localStorage.getItem("auth_token")).to.exist;
      });
      cy.logout();
      cy.window().then((win) => {
        expect(win.localStorage.getItem("auth_token")).to.be.null;
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
