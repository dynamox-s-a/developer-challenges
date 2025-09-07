import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0f19",
      paper: "#111826",
    },
    text: {
      primary: "#f5f5f5",
    },
    primary: { main: "#00bcd4" },
    secondary: { main: "#ff9800" },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});
