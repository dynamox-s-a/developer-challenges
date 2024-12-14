import { createTheme } from "@mui/material/styles";

const darkPalette = {
  mode: "dark",
  primary: {
    light: "#9c4d7b",
    main: "#692746",
    dark: "#3a001d",
  },
  secondary: {
    light: "#99a3d1",
    main: "#6675b8",
    dark: "#354785",
  },
  background: {
    default: "#121212",
    paper: "#1d1d1d",
  },
  text: {
    primary: "#ffffff",
    secondary: "#aaaaaa",
  },
  error: {
    main: "#f44336",
  },
  warning: {
    main: "#ff9800",
  },
  info: {
    main: "#2196f3",
  },
  success: {
    main: "#4caf50",
  },
} as const;

const lightPalette = {
  mode: "light",
  primary: {
    light: "#9c4d7b",
    main: "#692746",
    dark: "#3a001d",
  },
  secondary: {
    light: "#99a3d1",
    main: "#6675b8",
    dark: "#354785",
  },
  background: {
    default: "#f5f5f5",
    paper: "#ffffff",
  },
  text: {
    primary: "#333333",
    secondary: "#666666",
  },
  error: {
    main: "#f44336",
  },
  warning: {
    main: "#ff9800",
  },
  info: {
    main: "#2196f3",
  },
  success: {
    main: "#4caf50",
  },
} as const;

const darkTheme = createTheme({ palette: darkPalette });
const lightTheme = createTheme({ palette: lightPalette });

export { darkTheme, lightTheme };
