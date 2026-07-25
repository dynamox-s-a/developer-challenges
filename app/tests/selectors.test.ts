import { describe, expect, it } from "vitest";
import {
  selectFilteredSeries,
  selectMetricSeries,
} from "../src/features/dashboard/selectors";
import type { RootState } from "../src/features/dashboard/store";

const buildState = (periodDays: number | null): RootState =>
  ({
    dashboard: {
      status: "succeeded",
      error: null,
      periodDays,
      series: [
        {
          name: "accelerationRms/x",
          data: [
            { datetime: "2023-11-01T00:00:00.000Z", max: 1 },
            { datetime: "2023-11-30T00:00:00.000Z", max: 2 },
          ],
        },
        {
          name: "temperature",
          data: [
            { datetime: "2023-11-01T00:00:00.000Z", max: 22 },
            { datetime: "2023-11-30T00:00:00.000Z", max: 27 },
          ],
        },
      ],
    },
  }) as RootState;

describe("seletores do dashboard", () => {
  it("usa a data mais recente do conjunto como referência do período", () => {
    const result = selectFilteredSeries(buildState(7));
    expect(result.every((series) => series.data.length === 1)).toBe(true);
    expect(result[0]?.data[0]?.max).toBe(2);
  });

  it("mantém todo o histórico quando o período é nulo", () => {
    expect(selectFilteredSeries(buildState(null))[0]?.data).toHaveLength(2);
  });

  it("separa temperatura das séries vetoriais", () => {
    const all = selectFilteredSeries(buildState(null));
    expect(selectMetricSeries(all, "temperature").map((item) => item.name)).toEqual([
      "temperature",
    ]);
    expect(selectMetricSeries(all, "acceleration").map((item) => item.name)).toEqual([
      "accelerationRms/x",
    ]);
  });
});
