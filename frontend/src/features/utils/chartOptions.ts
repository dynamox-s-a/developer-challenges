import type { ChartSeries } from "../data/types";
import type { Options } from "highcharts";
import { clearSync, syncCharts } from "./chartSync";

const SERIES_COLORS: Record<ChartSeries["name"], string> = {
  Axial: "#2084c8",
  Horizontal: "#cc307c",
  Radial: "#b48800",
  Temperatura: "#88982c",
};

const SHORT_MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function buildChartOptions(
  series: ChartSeries[],
  yAxisTitle: string,
  valueDecimals = 2,
): Options {
  return {
    chart: {
      type: "line",
      height: 320,
      marginLeft: 72,
      animation: false,
      style: { fontFamily: "inherit" },
    },
    title: {
      text: undefined,
    },
    palette: { colorScheme: "light" },
    credits: { enabled: false },
    lang: { shortMonths: SHORT_MONTHS_PT },
    xAxis: {
      type: "datetime",
      crosshair: true,
      labels: { format: "{value:%e. %b}" },
    },
    yAxis: { title: { text: yAxisTitle } },
    legend: { align: "center", verticalAlign: "bottom" },
    tooltip: {
      shared: true,
      xDateFormat: "%e. %b %Y, %H:%M",
      valueDecimals,
      followTouchMove: false,
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 2,
        marker: { enabled: false, states: { hover: { enabled: false } } },
        point: {
          events: {
            mouseOver() {
              syncCharts(this);
            },
          },
        },
        events: {
          mouseOut() {
            clearSync(this.chart);
          },
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 480 },
          chartOptions: { chart: { height: 260, marginLeft: 56 } },
        },
      ],
    },
    series: series.map((s) => ({
      type: "line",
      name: s.name,
      data: s.data,
      color: SERIES_COLORS[s.name],
    })),
  };
}
