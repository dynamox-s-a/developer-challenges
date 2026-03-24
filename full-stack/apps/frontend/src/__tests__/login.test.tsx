import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";

const apiPostMock = vi.hoisted(() => vi.fn());
const setTokenToStorageMock = vi.hoisted(() => vi.fn());

// IMPORTANT: Login.tsx uses `import { api } from "../api"`
vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    post: apiPostMock,
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Auth slice persists token via `../auth/token`
vi.mock("../auth/token", () => ({
  getToken: () => null,
  setToken: setTokenToStorageMock,
  clearToken: vi.fn(),
}));

function makeTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const testStore = makeTestStore();
  return (
    <Provider store={testStore}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders login form", () => {
    // import after mocks
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    return import("../pages/Login").then(({ default: Login }) => {
      render(<Login />, { wrapper: TestWrapper });

      expect(screen.getByRole("heading", { name: /sign in/i })).toBeTruthy();
      expect(screen.getByLabelText(/username/i)).toBeTruthy();
      expect(screen.getByLabelText(/password/i)).toBeTruthy();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy();
    });
  });

  it("logs in and stores token", async () => {
    apiPostMock.mockResolvedValueOnce({ data: { token: "FAKE_TOKEN" } });

    const { default: Login } = await import("../pages/Login");
    render(<Login />, { wrapper: TestWrapper });

    await userEvent.type(screen.getByLabelText(/username/i), "admin");
    await userEvent.type(screen.getByLabelText(/password/i), "admin");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(setTokenToStorageMock).toHaveBeenCalledWith("FAKE_TOKEN");
  });
});
