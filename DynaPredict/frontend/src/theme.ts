import { createTheme } from "@mui/material/styles";
import { lightBlue } from "@mui/material/colors";
// Shared theme used by the app
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    // keep Roboto as primary, fallback to Inter if available
    fontFamily: "Roboto, Inter, sans-serif",
  },
  palette: {
    primary: {
      main: lightBlue[700],
      light: lightBlue[400],
      dark: lightBlue[900],
    },
    secondary: {
      main: "#ff9800",
    },
    background: {
      default: "#f3f4f6",
    },
    mode: "light",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
