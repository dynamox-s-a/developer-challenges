import { describe, expect, it } from "vitest";
import { telemetryActions, telemetryReducer } from "../model/telemetrySlice";

describe("telemetry reducer", () => {
  it("passa por todos os estados possíveis", () => {
    let state = telemetryReducer(undefined, telemetryActions.fetchRequested());
    expect(state.status).toBe("loading");
    state = telemetryReducer(state, telemetryActions.fetchSucceeded([]));
    expect(state.status).toBe("succeeded");
    state = telemetryReducer(
      state,
      telemetryActions.fetchFailed("network error"),
    );
    expect(state).toMatchObject({ status: "failed", error: "network error" });
  });

  it("retorna ao estado idle quando uma requisição ativa é cancelada", () => {
    const loadingState = telemetryReducer(
      undefined,
      telemetryActions.fetchRequested(),
    );
    expect(
      telemetryReducer(loadingState, telemetryActions.fetchCancelled()).status,
    ).toBe("idle");
  });
});
