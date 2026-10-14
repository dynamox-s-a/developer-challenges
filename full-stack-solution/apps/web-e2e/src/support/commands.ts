/// <reference types="cypress" />

export {};

/** Where the app keeps the access token (see `features/auth/token-storage.ts`). */
const TOKEN_KEY = "dynapredict.accessToken";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Signs in through the real form, as a user would. */
      login(): Chainable<void>;
      /** Calls the API with the token the app stored, for setup and cleanup. */
      api<T = unknown>(
        options: Partial<Cypress.RequestOptions> & { url: string },
      ): Chainable<Cypress.Response<T>>;
      /** Opens a MUI select by its label and picks an option by text. */
      selectOption(label: string, option: string | RegExp): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", () => {
  // Cypress 16 removed the synchronous `Cypress.env()`; `cy.env()` is chainable.
  cy.env<{ seedEmail: string; seedPassword: string }>([
    "seedEmail",
    "seedPassword",
  ]).then(({ seedEmail, seedPassword }) => {
    if (!seedEmail || !seedPassword) {
      throw new Error(
        "SEED_USER_EMAIL and SEED_USER_PASSWORD must be set in the workspace .env",
      );
    }

    cy.visit("/login");
    cy.get('input[name="email"]').type(seedEmail);
    cy.get('input[name="password"]').type(seedPassword, { log: false });
    cy.contains("button", "Sign in").click();

    // The guard renders the private area only once the token is validated.
    cy.location("pathname").should("eq", "/");
  });
});

Cypress.Commands.add("api", ({ url, ...options }) =>
  cy.window().then((win) => {
    const token = win.localStorage.getItem(TOKEN_KEY);

    return cy.request({
      url,
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  }),
);

Cypress.Commands.add("selectOption", (label, option) => {
  // React's `useId` produces ids like `:rf:`, which are not valid in a CSS id
  // selector — hence the attribute form.
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => cy.get(`[id="${id}"]`).click());

  cy.get('[role="listbox"]').contains('[role="option"]', option).click();
  cy.get('[role="listbox"]').should("not.exist");
});
