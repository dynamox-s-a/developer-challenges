import reducer from "../reducer";
import { dataFetchRequested, dataFetchSucceeded, dataFetchFailed } from "../actions";

describe("data reducer", () => {
  it("liga loading ao solicitar fetch", () => {
    const state = reducer(undefined, dataFetchRequested());
    expect(state.loading).toBe(true);
  });

  it("guarda séries ao sucesso", () => {
    const payload = { acceleration: [], velocity: [], temperature: [] };
    const state = reducer(undefined, dataFetchSucceeded(payload));
    expect(state.loading).toBe(false);
    expect(state.acceleration).toEqual([]);
  });

  it("salva mensagem de erro ao falhar", () => {
    const state = reducer(undefined, dataFetchFailed("erro"));
    expect(state.loading).toBe(false);
    expect(state.error).toBe("erro");
  });
});
