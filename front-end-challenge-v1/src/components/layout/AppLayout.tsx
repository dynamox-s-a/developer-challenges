"use client";

import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disableContainer?: boolean;
}

export function AppLayout({
  children,
  maxWidth = "lg",
  disableContainer = false,
}: AppLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {disableContainer ? (
          children
        ) : (
          <Container maxWidth={maxWidth}>{children}</Container>
        )}
      </Box>
    </Box>
  );
}
