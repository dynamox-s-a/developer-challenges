import { Box, Paper, Typography } from "@mui/material";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { dashboardPalette } from "../../../theme";
import { makeChartOptions } from "../lib/chartOptions";
import type { DashboardChart } from "../model/types";

interface ChartPanelProps {
  chart: DashboardChart;
}

export function ChartPanel({ chart }: ChartPanelProps) {
  return (
    <Paper
      component="section"
      elevation={0}
      variant="outlined"
      sx={{
        minWidth: 0,
        overflow: "hidden",
        borderColor: dashboardPalette.sectionBorder,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3.5 },
          py: 2.25,
          borderBottom: `1px solid ${dashboardPalette.sectionBorder}`,
        }}
      >
        <Typography
          component="h2"
          variant="subtitle1"
          sx={{ fontWeight: 700, color: dashboardPalette.chartTitle }}
        >
          {chart.title}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={makeChartOptions(chart)}
        />
      </Box>
    </Paper>
  );
}
