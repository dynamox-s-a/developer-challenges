import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";

// Mock do token helper - precisa ser hoisted com vi.hoisted
const clearTokenMock = vi.hoisted(() => vi.fn());
vi.mock("../auth/token", () => ({
  getToken: () => "FAKE_TOKEN",
  setToken: vi.fn(),
  clearToken: clearTokenMock,
}));

// Mock do useNavigate
const navigateMock = vi.hoisted(() => vi.fn());
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function makeTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: { token: "FAKE_TOKEN" },
    },
  });
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const testStore = makeTestStore();
  return (
    <Provider store={testStore}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
}

describe("Logout Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs out and clears storage", async () => {
    const store = makeTestStore();
    
    expect(store.getState().auth.token).toBe("FAKE_TOKEN");

    const { logout } = await import("../store/authSlice");
    store.dispatch(logout());

    expect(store.getState().auth.token).toBeNull();
    
    expect(clearTokenMock).toHaveBeenCalled();
  });

  it("auth slice logout action clears token from state", () => {
    const store = makeTestStore();
    
    expect(store.getState().auth.token).toBe("FAKE_TOKEN");

    store.dispatch({ type: "auth/logout" });

    expect(store.getState().auth.token).toBeNull();
  });
});
