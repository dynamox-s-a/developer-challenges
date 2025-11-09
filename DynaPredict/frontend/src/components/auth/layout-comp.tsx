import React from "react";
import { Box } from "@mui/material";

export interface LayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 360 },
          maxWidth: 600,
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: "450px", width: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
}
