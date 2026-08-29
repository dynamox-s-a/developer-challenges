import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f4c5c",
      dark: "#093943",
      light: "#4f7f89",
    },
    secondary: {
      main: "#e36414",
    },
    background: {
      default: "#f5f7f8",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
      fontWeight: 700,
    },
    h2: {
      fontSize: "clamp(1.4rem, 3vw, 2rem)",
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "small",
      },
    },
  },
});
