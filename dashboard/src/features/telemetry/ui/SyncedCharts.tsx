import { Stack } from "@mui/material";
import { ChartPanel } from "./ChartPanel";
import type { DashboardChart } from "../model/types";

interface SyncedChartsProps {
  charts: DashboardChart[];
}

export function SyncedCharts({ charts }: SyncedChartsProps) {
  return (
    <Stack spacing={2}>
      {charts.map((chart) => (
        <ChartPanel key={chart.id} chart={chart} />
      ))}
    </Stack>
  );
}
