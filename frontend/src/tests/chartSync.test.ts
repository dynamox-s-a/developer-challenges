import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Chart, Point } from "highcharts";
import {
  clearSync,
  findPointIndex,
  syncCharts,
} from "../features/utils/chartSync";

const xs = [100, 200, 300, 400];
const toPoints = (values: number[]) => values.map((x, index) => ({ x, index }));

function fakeChart(seriesX: number[][], visible: boolean[] = []) {
  const series = seriesX.map((values, i) => ({
    visible: visible[i] ?? true,
    points: toPoints(values),
  }));
  const chart = {
    series,
    tooltip: { refresh: vi.fn() },
    xAxis: [{ drawCrosshair: vi.fn() }],
    pointer: { reset: vi.fn() },
  };
  return { chart, asChart: chart as unknown as Chart };
}

function sourcePoint(chart: Chart, x: number, index: number) {
  return { x, index, series: { chart } } as unknown as Point;
}

describe("findPointIndex", () => {
  const points = toPoints(xs);

  it("uses the hint when it matches the timestamp", () => {
    expect(findPointIndex(points, 300, 2)).toBe(2);
  });

  it("falls back to search when the hint is wrong", () => {
    expect(findPointIndex(points, 300, 0)).toBe(2);
  });

  it("returns the nearest point when there is no exact match", () => {
    expect(findPointIndex(points, 240, 0)).toBe(1);
    expect(findPointIndex(points, 260, 0)).toBe(2);
  });

  it("clamps to the edges", () => {
    expect(findPointIndex(points, 1, 0)).toBe(0);
    expect(findPointIndex(points, 999, 0)).toBe(3);
  });

  it("returns -1 for no points", () => {
    expect(findPointIndex([], 100, 0)).toBe(-1);
  });
});

describe("syncCharts", () => {
  let source: ReturnType<typeof fakeChart>;
  let target: ReturnType<typeof fakeChart>;

  beforeEach(() => {
    source = fakeChart([xs]);
    target = fakeChart([xs, xs, xs]);
  });

  it("shows tooltip and crosshair on the other charts at the same time", () => {
    syncCharts(sourcePoint(source.asChart, 200, 1), [
      source.asChart,
      target.asChart,
    ]);

    expect(target.chart.tooltip.refresh).toHaveBeenCalledTimes(1);
    const shown = target.chart.tooltip.refresh.mock.calls[0][0];
    expect(shown).toHaveLength(3);
    expect(shown.every((p: { x: number }) => p.x === 200)).toBe(true);
    expect(target.chart.xAxis[0].drawCrosshair).toHaveBeenCalledWith(
      undefined,
      shown[0],
    );
  });

  it("does not touch the source chart", () => {
    syncCharts(sourcePoint(source.asChart, 200, 1), [
      source.asChart,
      target.asChart,
    ]);
    expect(source.chart.tooltip.refresh).not.toHaveBeenCalled();
  });

  it("skips hidden series", () => {
    const partial = fakeChart([xs, xs, xs], [true, false, true]);
    syncCharts(sourcePoint(source.asChart, 200, 1), [
      source.asChart,
      partial.asChart,
    ]);
    expect(partial.chart.tooltip.refresh.mock.calls[0][0]).toHaveLength(2);
  });

  it("ignores destroyed charts and charts without points", () => {
    const empty = fakeChart([[]]);
    expect(() =>
      syncCharts(sourcePoint(source.asChart, 200, 1), [
        undefined,
        source.asChart,
        empty.asChart,
      ]),
    ).not.toThrow();
    expect(empty.chart.tooltip.refresh).not.toHaveBeenCalled();
  });
});

describe("clearSync", () => {
  it("resets every chart except the source", () => {
    const source = fakeChart([xs]);
    const target = fakeChart([xs]);
    clearSync(source.asChart, [source.asChart, undefined, target.asChart]);

    expect(target.chart.pointer.reset).toHaveBeenCalledWith(false, 0);
    expect(source.chart.pointer.reset).not.toHaveBeenCalled();
  });
});
