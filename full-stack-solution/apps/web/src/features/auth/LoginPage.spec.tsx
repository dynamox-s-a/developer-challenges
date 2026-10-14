import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@web/test/test-utils";
import { LoginPage } from "./LoginPage";
import { tokenStorage } from "./token-storage";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  tokenStorage.clear();
});

describe("LoginPage", () => {
  it("validates the form before calling the API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText("Email address"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("signs the user in and stores the session", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      jsonResponse({
        accessToken: "jwt-token",
        user: { id: "user-1", email: "user@example.com" },
      }),
    );
    const { store } = renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText("Email address"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(store.getState().auth.status).toBe("authenticated");
    });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/login");
  });

  it("shows the message returned for invalid credentials", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { code: "UNAUTHORIZED", message: "Invalid credentials" } },
        401,
      ),
    );
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText("Email address"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("explains that the previous session expired", () => {
    renderWithProviders(<LoginPage />, {
      route: "/login",
      preloadedState: {
        auth: {
          token: null,
          user: null,
          status: "anonymous",
          isSigningIn: false,
          error: null,
          expired: true,
        },
      },
    });

    expect(
      screen.getByText("Your session expired. Please sign in again."),
    ).toBeInTheDocument();
  });
});
