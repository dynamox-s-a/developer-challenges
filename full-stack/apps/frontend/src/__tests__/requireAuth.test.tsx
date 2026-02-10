import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import authReducer from "../store/authSlice";
import monitoringPointsReducer from "../store/monitoringPointsSlice";
import timeSeriesReducer from "../store/timeSeriesSlice";
import machinesReducer from "../store/machinesSlice";
import monitoringPointsCrudReducer from "../store/monitoringPointsCrudSlice";
import { RequireAuth } from "../components/RequireAuth";

function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer as any,
      monitoringPoints: monitoringPointsReducer as any,
      timeSeries: timeSeriesReducer as any,
      machines: machinesReducer as any,
      monitoringPointsCrud: monitoringPointsCrudReducer as any,
    },
    preloadedState,
  });
}

describe("RequireAuth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /login when no token", async () => {
    const testStore = createTestStore({ auth: { token: null } });
    
    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <div>PRIVATE</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>LOGIN</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText("LOGIN")).toBeTruthy();
  });

  it("renders children when token exists", async () => {
    localStorage.setItem("token", "FAKE_TOKEN");
    const testStore = createTestStore({ auth: { token: "FAKE_TOKEN" } });

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <div>PRIVATE</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>LOGIN</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText("PRIVATE")).toBeTruthy();
  });
});
