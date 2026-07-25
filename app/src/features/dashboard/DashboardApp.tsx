"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { Dashboard } from "./Dashboard";
import { store } from "./store";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5b4bcc", dark: "#4435a8" },
    success: { main: "#16866d" },
    text: { primary: "#17233f", secondary: "#69738a" },
    background: { default: "#f6f7fa", paper: "#ffffff" },
    divider: "#e7e9f0",
  },
  typography: {
    fontFamily: "Manrope, Inter, system-ui, sans-serif",
    h1: {
      fontSize: "clamp(1.35rem, 3vw, 1.85rem)",
      fontWeight: 750,
      letterSpacing: "-0.035em",
    },
    h2: {
      fontSize: "1rem",
      fontWeight: 750,
      letterSpacing: "-0.015em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export function DashboardApp() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
}
