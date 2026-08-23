import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: { default: "#f7f8fa", paper: "#ffffff" },
    primary: { main: "#2f80d1" },
    text: { primary: "#36373b", secondary: "#5f636b" },
  },
  shape: { borderRadius: 4 },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

export const dashboardPalette = {
  appBarTopBorder: "#dedede",
  appBarBottomBorder: "#e1e5ea",
  sectionBorder: "#dce2e8",
  metadataDivider: "#dfe4ea",
  pageTitle: "#383a3e",
  metadataText: "#3f4247",
  chartTitle: "#414247",
} as const;

export const chartPalette = {
  series: ["#2185d0", "#d72e78", "#bd8b00"],
  grid: dashboardPalette.sectionBorder,
  crosshair: "#7f8c99",
  axisLabel: "#5e74b5",
  tooltipBorder: "#cbd5df",
  legendText: "#4c4d52",
} as const;
