"use client";

import { useEffect, useMemo, useRef } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import {
  Chart as HighchartsChart,
  type ChartOptions,
  type HighchartsReactRefObject,
} from "@highcharts/react";
import type Highcharts from "highcharts";
import type { MeasurementSeries, MetricKind } from "./types";

const AXIS_COLORS = ["#5b4bcc", "#e4873b", "#16866d"];

const METRIC_CONFIG: Record<
  MetricKind,
  { title: string; unit: string; description: string }
> = {
  acceleration: {
    title: "Aceleração RMS",
    unit: "g",
    description: "Intensidade da vibração nos três eixos",
  },
  velocity: {
    title: "Velocidade RMS",
    unit: "mm/s",
    description: "Severidade global da vibração",
  },
  temperature: {
    title: "Temperatura",
    unit: "°C",
    description: "Condição térmica do sensor",
  },
};

type SensorChartProps = {
  metric: MetricKind;
  series: MeasurementSeries[];
  activeTimestamp: number | null;
  onHoverTimestamp: (timestamp: number | null) => void;
};

const seriesLabel = (name: string) => {
  if (name === "temperature") return "Temperatura";
  return `Eixo ${name.split("/")[1]?.toUpperCase()}`;
};

export function SensorChart({
  metric,
  series,
  activeTimestamp,
  onHoverTimestamp,
}: SensorChartProps) {
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const config = METRIC_CONFIG[metric];

  const options = useMemo<ChartOptions>(
    () => ({
      accessibility: {
        enabled: false,
      },
      chart: {
        height: 260,
        backgroundColor: "transparent",
        spacing: [12, 8, 4, 0],
        animation: false,
        zooming: { type: "x" },
        style: { fontFamily: "Manrope, Inter, system-ui, sans-serif" },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
        lineColor: "#dfe2ea",
        tickColor: "#dfe2ea",
        tickLength: 5,
        crosshair: {
          color: "#7163d9",
          dashStyle: "Dash",
          width: 1,
          zIndex: 5,
        },
        labels: {
          style: { color: "#7c8598", fontSize: "11px" },
          format: "{value:%d %b}",
        },
      },
      yAxis: {
        title: {
          text: config.unit,
          rotation: 0,
          align: "high",
          y: -12,
          x: 8,
          style: { color: "#7c8598", fontSize: "11px", fontWeight: "600" },
        },
        gridLineColor: "#edf0f5",
        lineWidth: 0,
        tickAmount: 4,
        labels: {
          style: { color: "#7c8598", fontSize: "11px" },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "#17233f",
        borderWidth: 0,
        borderRadius: 10,
        shadow: false,
        style: { color: "#ffffff", fontSize: "12px" },
        headerFormat:
          '<span style="color:#b8bfd0">{point.key:%d/%m/%Y • %H:%M}</span><br/>',
        pointFormat:
          '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y:.2f}</b><br/>',
      },
      plotOptions: {
        series: {
          animation: false,
          lineWidth: 2,
          marker: {
            enabled: false,
            radius: 3,
            states: { hover: { enabled: true, radius: 4 } },
          },
          states: {
            inactive: { opacity: 0.35 },
            hover: { lineWidthPlus: 0 },
          },
          turboThreshold: 0,
        },
      },
      series: series.map((item, index) => ({
        type: "line",
        name: seriesLabel(item.name),
        color: AXIS_COLORS[index],
        data: item.data.map((point) => [
          Date.parse(point.datetime),
          point.max,
        ]),
      })),
    }),
    [config.unit, series],
  );

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    if (activeTimestamp === null) {
      chart.tooltip.hide(0);
      chart.xAxis[0]?.removePlotLine("synchronized-crosshair");
      chart.series.forEach((item) => item.points.forEach((point) => point.setState()));
      return;
    }

    const points = chart.series
      .map((item) =>
        item.points.reduce<Highcharts.Point | null>((nearest, point) => {
          if (!nearest) return point;
          return Math.abs(point.x - activeTimestamp) <
            Math.abs(nearest.x - activeTimestamp)
            ? point
            : nearest;
        }, null),
      )
      .filter((point): point is Highcharts.Point => Boolean(point));

    if (points.length > 0) {
      chart.xAxis[0]?.removePlotLine("synchronized-crosshair");
      chart.xAxis[0]?.addPlotLine({
        id: "synchronized-crosshair",
        value: activeTimestamp,
        color: "#7163d9",
        dashStyle: "Dash",
        width: 1,
        zIndex: 5,
        className: "synchronized-crosshair",
      });
      chart.tooltip.refresh(points);
      points.forEach((point) => point.setState("hover"));
    }
  }, [activeTimestamp]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const chart = chartRef.current?.chart;
    const xAxis = chart?.xAxis[0];
    if (!chart || !xAxis || chart.series.length === 0) return;

    const bounds = chart.container.getBoundingClientRect();
    const chartX = event.clientX - bounds.left;
    const isInsidePlot =
      chartX >= chart.plotLeft && chartX <= chart.plotLeft + chart.plotWidth;

    if (isInsidePlot) {
      onHoverTimestamp(xAxis.toValue(chartX));
    }
  };

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-label={`Gráfico de ${config.title}`}
      data-sync-active={activeTimestamp !== null}
      sx={{
        borderRadius: 3,
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(25, 34, 56, 0.03)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.25}
        sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.25, pb: 0.5 }}
      >
        <Box>
          <Typography variant="h2">{config.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {config.description}
          </Typography>
        </Box>
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          {series.map((item, index) => (
            <Chip
              key={item.name}
              size="small"
              label={seriesLabel(item.name)}
              sx={{
                bgcolor: `${AXIS_COLORS[index]}12`,
                color: AXIS_COLORS[index],
                fontWeight: 700,
                fontSize: 11,
                "&::before": {
                  content: '""',
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: AXIS_COLORS[index],
                  ml: 1,
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onHoverTimestamp(null)}
        sx={{ px: { xs: 0.5, sm: 1.5 }, touchAction: "pan-y" }}
      >
        <HighchartsChart
          ref={(instance) => {
            chartRef.current = instance as HighchartsReactRefObject | null;
          }}
          options={options}
        />
      </Box>
    </Paper>
  );
}
