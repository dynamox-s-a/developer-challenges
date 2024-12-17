import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#29477b",
      light: "#4269a2",
      dark: "#1b3254",
    },
    secondary: {
      main: "#8a9fd3",
      light: "#b0c8ea",
      dark: "#5e77a1",
    },
    error: {
      main: "#e57373",
    },
    warning: {
      main: "#ffb74d",
    },
    info: {
      main: "#4fc3f7",
    },
    success: {
      main: "#81c784",
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
});
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4269a2",
      light: "#6d90c3",
      dark: "#29477b",
    },
    secondary: {
      main: "#8a9fd3",
      light: "#b0c8ea",
      dark: "#6078b4",
    },
    error: {
      main: "#e57373",
    },
    warning: {
      main: "#ffb74d",
    },
    info: {
      main: "#4fc3f7",
    },
    success: {
      main: "#81c784",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
});
