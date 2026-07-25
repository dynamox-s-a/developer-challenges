import { describe, expect, it } from "vitest";
import {
  dashboardReducer,
  initialState,
  measurementsFailed,
  measurementsRequested,
  measurementsSucceeded,
  periodChanged,
} from "../src/features/dashboard/dashboardSlice";

describe("dashboardReducer", () => {
  it("representa o ciclo completo de uma consulta bem-sucedida", () => {
    const loading = dashboardReducer(initialState, measurementsRequested());
    expect(loading.status).toBe("loading");
    expect(loading.error).toBeNull();

    const loaded = dashboardReducer(
      loading,
      measurementsSucceeded([
        {
          name: "temperature",
          data: [{ datetime: "2023-12-12T15:02:42.000Z", max: 32.4 }],
        },
      ]),
    );

    expect(loaded.status).toBe("succeeded");
    expect(loaded.series[0]?.data[0]?.max).toBe(32.4);
  });

  it("preserva uma mensagem de erro útil e permite nova tentativa", () => {
    const failed = dashboardReducer(
      initialState,
      measurementsFailed("API indisponível"),
    );
    expect(failed).toMatchObject({
      status: "failed",
      error: "API indisponível",
    });

    expect(
      dashboardReducer(failed, measurementsRequested()),
    ).toMatchObject({ status: "loading", error: null });
  });

  it("altera o período sem modificar as medições", () => {
    const state = dashboardReducer(initialState, periodChanged(14));
    expect(state.periodDays).toBe(14);
    expect(state.series).toEqual([]);
  });
});
