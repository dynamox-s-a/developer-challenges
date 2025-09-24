"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/styles/theme";
import type { ThemeProviderWrapperProps } from "../types/ui";

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
