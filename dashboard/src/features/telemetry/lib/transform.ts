import type {
  DashboardChart,
  RawSeries,
  TelemetryResponse,
} from "../model/types";

const definitions: Array<{
  id: DashboardChart["id"];
  title: string;
  unit: string;
  sourceNames: string[];
}> = [
  {
    id: "acceleration",
    title: "Aceleração RMS",
    unit: "g",
    sourceNames: [
      "accelerationRms/x",
      "accelerationRms/y",
      "accelerationRms/z",
    ],
  },
  {
    id: "temperature",
    title: "Temperatura",
    unit: "°C",
    sourceNames: ["temperature"],
  },
  {
    id: "velocity",
    title: "Velocidade RMS",
    unit: "g",
    sourceNames: ["velocityRms/x", "velocityRms/y", "velocityRms/z"],
  },
];

function toChartSeries(series: RawSeries) {
  const axis = series.name.split("/")[1];
  const labels: Record<string, string> = {
    x: "Axial",
    y: "Horizontal",
    z: "Radial",
  };
  return {
    id: series.name,
    name: labels[axis] ?? "Temperatura",
    data: series.data
      .map(
        ({ datetime, max }) => [Date.parse(datetime), max] as [number, number],
      )
      .filter(
        ([timestamp, value]) =>
          Number.isFinite(timestamp) && Number.isFinite(value),
      ),
  };
}

export function buildDashboardCharts(
  data: TelemetryResponse,
): DashboardChart[] {
  const byName = new Map(data.map((series) => [series.name, series]));
  return definitions.map((definition) => ({
    ...definition,
    series: definition.sourceNames
      .map((name) => byName.get(name))
      .filter((series): series is RawSeries => Boolean(series))
      .map(toChartSeries),
  }));
}
