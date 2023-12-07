import { createTheme } from "@mui/material";

export const MaterialTheme = createTheme({
  palette: {
    primary: {
      main: "#0165DB",
      dark: "#263252",
      light: "#5D7A8C",
      contrastText: "#fff",
    },
    background: {
      paper: "#fff",
      default: "#F4F7FC",
    },
    error: {
      main: "#ff4c4c",
    },
  },
});
