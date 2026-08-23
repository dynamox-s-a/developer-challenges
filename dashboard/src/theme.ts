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
