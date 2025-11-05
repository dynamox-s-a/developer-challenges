"use client";

import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const ligthTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7C3AED",
      light: "#A855F7",
      dark: "#6D28D9",
    },
    secondary: {
      main: "#0891B2",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 50%, #F8FAFC 100%)",
          minHeight: "100vh",
          transition: "background 0.3s ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          padding: "10px 24px",
        },
        contained: {
          background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #6D28D9 0%, #0E7490 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#6D28D9",
    },
    secondary: {
      main: "#06B6D4",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1",
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          minHeight: "100vh",
          transition: "background 0.3s ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          padding: "10px 24px",
        },
        contained: {
          background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #6D28D9 0%, #0E7490 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          border: "1px solid rgba(226, 232, 240, 0.1)",
        },
      },
    },
  },
});
