import type Highcharts from "highcharts";
import type { DashboardChart } from "../model/types";
import { chartPalette, theme } from "../../../theme";

const dashboardBackground = theme.palette.background.paper;

export function makeChartOptions(chart: DashboardChart): Highcharts.Options {
  return {
    chart: {
      type: "line",
      height: 440,
      animation: false,
      zooming: { type: "x" },
      spacing: [12, 12, 18, 12],
      backgroundColor: dashboardBackground,
      plotBackgroundColor: dashboardBackground,
      style: { fontFamily: theme.typography.fontFamily },
    },
    title: { text: "" },
    credits: { enabled: false },
    time: { timezone: "UTC" },
    xAxis: {
      type: "datetime",
      lineColor: chartPalette.grid,
      tickColor: chartPalette.grid,
      gridLineWidth: 1,
      gridLineColor: chartPalette.grid,
      crosshair: {
        color: chartPalette.crosshair,
        dashStyle: "ShortDash",
        width: 1,
      },
      title: { text: undefined },
      labels: { style: { color: chartPalette.axisLabel, fontSize: "13px" } },
    },
    yAxis: {
      gridLineColor: chartPalette.grid,
      gridLineWidth: 1,
      lineWidth: 1,
      lineColor: chartPalette.grid,
      title: {
        text: `${chart.title} (${chart.unit})`,
        style: {
          color: chartPalette.axisLabel,
          fontSize: "13px",
          fontWeight: "400",
        },
      },
      labels: { style: { color: chartPalette.axisLabel, fontSize: "13px" } },
    },
    tooltip: {
      shared: true,
      valueSuffix: ` ${chart.unit}`,
      xDateFormat: "%d/%m/%Y %H:%M:%S UTC",
      backgroundColor: theme.palette.background.paper,
      borderColor: chartPalette.tooltipBorder,
      shadow: false,
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: chartPalette.legendText,
        fontSize: "13px",
        fontWeight: "600",
      },
      symbolWidth: 18,
      symbolRadius: 0,
    },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 2.25,
        marker: {
          enabled: false,
          states: { hover: { enabled: true, radius: 4 } },
        },
        states: { hover: { lineWidthPlus: 0 } },
      },
    },
    series: chart.series.map((series, index) => ({
      type: "line",
      id: series.id,
      name: series.name,
      data: series.data,
      color: chartPalette.series[index],
    })),
  };
}
