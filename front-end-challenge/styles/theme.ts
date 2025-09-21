import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2E7D32",
    },
    secondary: {
      main: "#F5F5F5",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },
});

export default theme;
