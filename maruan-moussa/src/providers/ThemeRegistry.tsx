"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import createEmotionCache from "@/createEmotionCache";
import { darkTheme, ligthTheme } from "@/theme/theme";

const clientSideEmotionCache = createEmotionCache();

export default function ThemeRegistry({
  children,
  mode = "light",
}: {
  children: React.ReactNode;
  mode?: "light" | "dark";
}) {
  const theme = mode === "light" ? ligthTheme : darkTheme;

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
