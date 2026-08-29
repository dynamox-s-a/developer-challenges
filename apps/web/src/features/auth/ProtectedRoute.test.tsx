import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { createFakeApi } from "../../test/fakeApi";
import { login } from "./authSlice";
import { ProtectedRoute } from "./ProtectedRoute";

function renderRoutes(store: ReturnType<typeof createAppStore>) {
  return render(
    <Provider store={store}>
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        initialEntries={["/private"]}
      >
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<div>Private screen</div>} path="/private" />
          </Route>
          <Route element={<div>Login screen</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => vi.useRealTimers());

  it("redirects an anonymous visitor to login", async () => {
    const store = createAppStore(createFakeApi());

    renderRoutes(store);

    expect(await screen.findByText("Login screen")).toBeInTheDocument();
    expect(screen.queryByText("Private screen")).not.toBeInTheDocument();
  });

  it("expires an authenticated route when the JWT lifetime ends", async () => {
    vi.useFakeTimers();
    const expiresAt = new Date(Date.now() + 1_000).toISOString();
    const store = createAppStore(
      createFakeApi({
        login: async () => ({
          accessToken: "signed.jwt.token",
          tokenType: "Bearer",
          expiresAt,
          user: { email: "admin@dynamox.local" },
        }),
      })
    );
    await store.dispatch(login({ email: "admin@dynamox.local", password: "secret" }));
    renderRoutes(store);
    expect(screen.getByText("Private screen")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1_001));

    expect(screen.getByText("Login screen")).toBeInTheDocument();
    expect(store.getState().auth.status).toBe("anonymous");
  });
});
