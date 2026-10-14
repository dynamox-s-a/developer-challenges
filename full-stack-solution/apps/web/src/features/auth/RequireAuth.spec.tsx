import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@web/test/test-utils";
import { RequireAuth } from "./RequireAuth";

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
});

function renderGuard(preloadedState?: Parameters<typeof renderWithProviders>[1]) {
  return renderWithProviders(
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<div>private area</div>} />
      </Route>
      <Route path="/login" element={<div>login page</div>} />
    </Routes>,
    preloadedState,
  );
}

describe("RequireAuth", () => {
  it("redirects to the login page without a session", () => {
    renderGuard();

    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("private area")).not.toBeInTheDocument();
  });

  it("renders the private area for an authenticated user", () => {
    renderGuard({
      preloadedState: {
        auth: {
          token: "jwt-token",
          user: { id: "user-1", email: "user@example.com" },
          status: "authenticated",
          isSigningIn: false,
          error: null,
          expired: false,
        },
      },
    });

    expect(screen.getByText("private area")).toBeInTheDocument();
  });

  it("validates a stored token before deciding", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ id: "user-1", email: "user@example.com" }),
    );

    renderGuard({
      preloadedState: {
        auth: {
          token: "stored-token",
          user: null,
          status: "unknown",
          isSigningIn: false,
          error: null,
          expired: false,
        },
      },
    });

    // While the check runs neither branch is shown.
    expect(screen.getByLabelText("Checking session")).toBeInTheDocument();
    expect(await screen.findByText("private area")).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/me");
  });

  it("sends the user to the login page when the stored token is rejected", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: "UNAUTHORIZED", message: "expired" } }, 401),
    );

    renderGuard({
      preloadedState: {
        auth: {
          token: "stale-token",
          user: null,
          status: "unknown",
          isSigningIn: false,
          error: null,
          expired: false,
        },
      },
    });

    expect(await screen.findByText("login page")).toBeInTheDocument();
  });
});
