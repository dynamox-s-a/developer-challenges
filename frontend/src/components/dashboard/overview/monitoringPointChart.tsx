"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import { ArrowClockwise as ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { ApexOptions } from "apexcharts";

import { Chart } from "@/components/core/chart";
import { useAppSelector } from "@/types/hooks";

/**
 * A component that visualizes the number of monitoring points associated with each machine.
 */
export function MonitoringPointsChart(): React.JSX.Element {
  const chartOptions = useChartOptions();
  const machines = useAppSelector((state) => state.machines.machines);

  const chartSeries = React.useMemo(() => {
    if (!machines || machines.length === 0) return [];

    return [
      {
        name: "Monitoring Points Count",
        data: machines.map((machine) => ({
          x: machine.name,
          y: machine.monitoringPoints?.length ?? 0,
        })),
      },
    ];
  }, [machines]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
          >
            Sync
          </Button>
        }
        title="Monitoring Points by Machine"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
        >
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

/**
 * Hook to generate chart options for the MonitoringPointsChart component.
 * @returns {ApexOptions} The configuration object for the chart.
 */
function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.25),
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: "solid" },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: "40px" } },
    stroke: { colors: ["transparent"], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: [],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}