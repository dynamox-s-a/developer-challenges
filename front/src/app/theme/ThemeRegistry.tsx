"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import palette from "./palette";
import React from "react";
import { useSelector } from "../redux/store";
import { presetsDeCores } from "./type";

export default function ThemeRegistry(props: any) {
  const { children } = props;
  const { indexColor } = useSelector((state) => state.theme);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 490,
        sm: 600,
        md: 960,
        lg: 1200,
        xl: 1920,
      },
    },
    palette: palette.light,
    shape: { borderRadius: 8 },
  });

  theme.palette.primary = presetsDeCores[indexColor];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <></> {children}
    </ThemeProvider>
  );
}
