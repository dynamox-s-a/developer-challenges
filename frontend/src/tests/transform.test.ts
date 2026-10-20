import { describe, expect, it } from "vitest";
import { toChartData } from "../features/data/transform";
import type { SeriesDto } from "../features/data/types";
import { seriesDtoFixture } from "./features/data/fixtures";

const ISO = [
  "2023-11-07T11:53:38.187Z",
  "2023-11-07T15:59:08.000Z",
  "2023-11-07T19:59:08.000Z",
] as const;
const [T0, T1, T2] = ISO.map((iso) => Date.parse(iso));

const temperature = (data: SeriesDto["data"]): SeriesDto[] => [
  { name: "temperature", data },
];

describe("toChartData", () => {
  it("groups series by metric with display labels", () => {
    const charts = toChartData(seriesDtoFixture);
    expect(charts.acceleration.map((s) => s.name)).toEqual([
      "Axial",
      "Horizontal",
      "Radial",
    ]);
    expect(charts.velocity.map((s) => s.name)).toEqual([
      "Axial",
      "Horizontal",
      "Radial",
    ]);
    expect(charts.temperature.map((s) => s.name)).toEqual(["Temperatura"]);
  });

  it("maps points to [timestamp ms, value] tuples", () => {
    const [axial] = toChartData(seriesDtoFixture).acceleration;

    expect(axial.data).toEqual([
      [T0, 0.1],
      [T1, 0.2],
      [T2, 0.3],
    ]);
  });

  it("keeps each series' own values", () => {
    const { velocity } = toChartData(seriesDtoFixture);

    expect(velocity.map((s) => s.data.map(([, value]) => value))).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  it("returns empty metrics for empty input", () => {
    expect(toChartData([])).toEqual({
      acceleration: [],
      velocity: [],
      temperature: [],
    });
  });

  it("ignores unknown series names", () => {
    const unknown = {
      name: "foo/x",
      data: [{ datetime: ISO[0], max: 1 }],
    } as unknown as SeriesDto;

    const charts = toChartData([unknown, ...seriesDtoFixture]);

    expect(charts.acceleration).toHaveLength(3);
    expect(charts.velocity).toHaveLength(3);
    expect(charts.temperature).toHaveLength(1);
  });

  it("sorts unsorted points ascending by time", () => {
    const charts = toChartData(
      temperature([
        { datetime: ISO[2], max: 22 },
        { datetime: ISO[0], max: 20 },
        { datetime: ISO[1], max: 21 },
      ]),
    );

    expect(charts.temperature[0].data).toEqual([
      [T0, 20],
      [T1, 21],
      [T2, 22],
    ]);
  });

  it("drops points with an invalid datetime or a non-finite value", () => {
    const charts = toChartData(
      temperature([
        { datetime: "not a date", max: 1 },
        { datetime: ISO[0], max: 20 },
        { datetime: ISO[1], max: Number.NaN },
        { datetime: ISO[2], max: Number.POSITIVE_INFINITY },
      ]),
    );

    expect(charts.temperature[0].data).toEqual([[T0, 20]]);
  });

  it("does not mutate its input", () => {
    const input = structuredClone(seriesDtoFixture);

    toChartData(input);

    expect(input).toEqual(seriesDtoFixture);
  });
});
