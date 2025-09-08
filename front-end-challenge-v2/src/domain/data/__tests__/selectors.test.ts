import { selectLoading, selectError } from "../selectors";
import type { AppState } from "@/app/store";

describe("selectors data", () => {
  it("selectLoading retorna flag", () => {
    const mock = { data: { loading: true } } as unknown as AppState;
    expect(selectLoading(mock)).toBe(true);
  });

  it("selectError retorna erro", () => {
    const mock = { data: { error: "x" } } as unknown as AppState;
    expect(selectError(mock)).toBe("x");
  });
});
