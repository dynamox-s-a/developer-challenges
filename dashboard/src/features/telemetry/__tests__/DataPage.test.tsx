import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DataPage } from "../ui/DataPage";
import { telemetryReducer, telemetryActions } from "../model/telemetrySlice";
import type { TelemetryState } from "../model/types";

vi.mock("../ui/SyncedCharts", () => ({
  SyncedCharts: () => <div data-testid="charts" />,
}));

function renderPage(preloadedState?: TelemetryState) {
  const store = configureStore({
    reducer: { telemetry: telemetryReducer },
    preloadedState: preloadedState ? { telemetry: preloadedState } : undefined,
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DataPage />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe("DataPage", () => {
  it("renderiza os diferentes estados da página de dados", async () => {
    const store = renderPage();
    expect(screen.getByLabelText("Carregando dados")).toBeInTheDocument();

    act(() => {
      store.dispatch(telemetryActions.fetchFailed("Falha de rede"));
    });
    expect(await screen.findByText("Falha de rede")).toBeInTheDocument();

    act(() => {
      store.dispatch(telemetryActions.fetchSucceeded([]));
    });
    expect(
      await screen.findByText("Não há leituras disponíveis para exibir."),
    ).toBeInTheDocument();

    act(() => {
      store.dispatch(
        telemetryActions.fetchSucceeded([
          {
            name: "temperature",
            data: [{ datetime: "2023-01-01T00:00:00.000Z", max: 25 }],
          },
        ]),
      );
    });
    expect(await screen.findByTestId("charts")).toBeInTheDocument();
  });
});
