import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Logo } from "@web/components/layout/Logo";

export interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Two-column public layout: the form on the left, a decorative panel on the
 * right that collapses below `lg`. Adapted from the Devias auth layout (MIT).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: { xs: "flex", lg: "grid" },
        flexDirection: "column",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100%",
      }}
    >
      <Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}>
        <Box sx={{ p: 3 }}>
          <Logo variant="dark" />
        </Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flex: "1 1 auto",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: 450, width: "100%" }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          background:
            "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
          color: "common.white",
          display: { xs: "none", lg: "flex" },
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 480, textAlign: "center" }}>
          <Typography color="inherit" variant="h5">
            Monitor your assets before they fail
          </Typography>
          <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
            Register machines, attach sensors to monitoring points and inspect
            the raw time series collected in the field.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
