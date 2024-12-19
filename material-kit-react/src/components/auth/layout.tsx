import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { paths } from "@/paths";
import { DynamicLogo } from "@/components/core/logo";

/**
 * Props for the Layout component.
 */
export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that defines the structure for the application page.
 * @param {LayoutProps} props The properties for the component.
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export function Layout({ children }: LayoutProps): React.JSX.Element {
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
          <Box
            component={RouterLink}
            href={paths.home}
            sx={{ display: "inline-block", fontSize: 0 }}
          />
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
          <Box sx={{ maxWidth: "450px", width: "100%" }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          background:
            "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
          color: "var(--mui-palette-common-white)",
          display: { xs: "none", lg: "flex" },
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Typography variant="h5">Welcome to Dynapredict!</Typography>
          <Typography variant="body1">
            Dynapredict is a platform that helps you to predict the future.
          </Typography>
          <Box display="flex" justifyContent="center" marginTop={2}>
            <DynamicLogo height={50} width={202} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}