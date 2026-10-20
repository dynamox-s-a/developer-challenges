import type {
  ChartData,
  ChartPoint,
  ChartSeries,
  MetricKey,
  SeriesDto,
  SeriesName,
} from "./types";

const SERIES_CONFIG: Record<
  SeriesName,
  { metric: MetricKey; label: ChartSeries["name"] }
> = {
  "accelerationRms/x": { metric: "acceleration", label: "Axial" },
  "accelerationRms/y": { metric: "acceleration", label: "Horizontal" },
  "accelerationRms/z": { metric: "acceleration", label: "Radial" },
  "velocityRms/x": { metric: "velocity", label: "Axial" },
  "velocityRms/y": { metric: "velocity", label: "Horizontal" },
  "velocityRms/z": { metric: "velocity", label: "Radial" },
  temperature: { metric: "temperature", label: "Temperatura" },
};

function toPoints(data: SeriesDto["data"]): ChartPoint[] {
  const points: ChartPoint[] = [];
  let sorted = true;
  for (const { datetime, max } of data) {
    const time = Date.parse(datetime);
    if (Number.isNaN(time) || !Number.isFinite(max)) continue;
    if (points.length && time < points[points.length - 1][0]) sorted = false;
    points.push([time, max]);
  }
  return sorted ? points : points.sort((a, b) => a[0] - b[0]);
}

export function toChartData(series: SeriesDto[]): ChartData {
  const charts: ChartData = { acceleration: [], velocity: [], temperature: [] };
  for (const { name, data } of series) {
    if (!Object.hasOwn(SERIES_CONFIG, name)) continue;
    const { metric, label } = SERIES_CONFIG[name];
    charts[metric].push({ name: label, data: toPoints(data) });
  }

  return charts;
}
