import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../../api/client";
import { createAppStore } from "../../app/store";
import { theme } from "../../app/theme";
import { clearSession } from "../../auth/session";
import { createFakeApi } from "../../test/fakeApi";
import { LoginPage } from "./LoginPage";

const session = {
  accessToken: "signed.jwt.token",
  tokenType: "Bearer" as const,
  expiresAt: "2099-08-24T12:00:00.000Z",
  user: { email: "new@dynamox.local" },
};

function renderPage(overrides: Partial<ApiClient> = {}) {
  const store = createAppStore(createFakeApi(overrides));
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
          initialEntries={["/login"]}
        >
          <Routes>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<div>Machines screen</div>} path="/machines" />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
  return store;
}

describe("LoginPage", () => {
  beforeEach(() => clearSession());

  it("signs in with the fixed credentials", async () => {
    const user = userEvent.setup();
    const login = vi.fn(async () => session);
    renderPage({ login });

    await user.type(screen.getByLabelText(/Email/), "admin@dynamox.local");
    await user.type(screen.getByLabelText(/Password/), "dynamox");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(login).toHaveBeenCalledWith({ email: "admin@dynamox.local", password: "dynamox" });
    expect(await screen.findByText("Machines screen")).toBeInTheDocument();
  });

  it("registers a new account from the same page and lands signed in", async () => {
    const user = userEvent.setup();
    const registerRequest = vi.fn(async () => session);
    renderPage({ register: registerRequest });

    await user.click(screen.getByRole("button", { name: "Create one" }));
    expect(screen.getByText("Create your DynaMonitor account")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Email/), "new@dynamox.local");
    await user.type(screen.getByLabelText(/Password/), "long-enough");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(registerRequest).toHaveBeenCalledWith({
      email: "new@dynamox.local",
      password: "long-enough",
    });
    expect(await screen.findByText("Machines screen")).toBeInTheDocument();
  });

  it("keeps the submit button disabled until the registration password reaches 8 characters", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Create one" }));
    await user.type(screen.getByLabelText(/Email/), "new@dynamox.local");
    await user.type(screen.getByLabelText(/Password/), "short");

    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled();

    await user.type(screen.getByLabelText(/Password/), "-enough");

    expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled();
  });

  it("shows a registration conflict and returns to sign-in mode intact", async () => {
    const user = userEvent.setup();
    renderPage({
      register: async () => {
        throw new Error("An account with this email already exists");
      },
    });

    await user.click(screen.getByRole("button", { name: "Create one" }));
    await user.type(screen.getByLabelText(/Email/), "taken@dynamox.local");
    await user.type(screen.getByLabelText(/Password/), "long-enough");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText("An account with this email already exists")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Sign in to DynaMonitor")).toBeInTheDocument();
    expect(screen.queryByText("An account with this email already exists")).not.toBeInTheDocument();
  });
});
