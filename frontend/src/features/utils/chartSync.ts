import type { Chart, Point } from "highcharts";
import Highcharts from "highcharts";

type HasX = { x: number };

export function findPointIndex(
  points: readonly HasX[],
  x: number,
  hint: number,
): number {
  if (points.length === 0) return -1;
  if (points[hint]?.x === x) return hint;

  let low = 0;
  let high = points.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (points[mid].x < x) low = mid + 1;
    else high = mid;
  }

  const before = low - 1;
  if (before >= 0 && x - points[before].x <= points[low].x - x) return before;
  return low;
}

export function syncCharts(
  source: Point,
  charts: ReadonlyArray<Chart | undefined> = Highcharts.charts,
): void {
  const sourceChart = source.series.chart;

  for (const chart of charts) {
    if (!chart || chart === sourceChart) continue;

    const points = chart.series
      .filter((series) => series.visible)
      .map(
        (series) =>
          series.points[findPointIndex(series.points, source.x, source.index)],
      )
      .filter((point) => point !== undefined);
    if (points.length === 0) continue;

    chart.tooltip.refresh(points);
    chart.xAxis[0].drawCrosshair(undefined, points[0]);
  }
}

export function clearSync(
  source: Chart,
  charts: ReadonlyArray<Chart | undefined> = Highcharts.charts,
): void {
  for (const chart of charts) {
    if (chart && chart !== source) chart.pointer.reset(false, 0);
  }
}
