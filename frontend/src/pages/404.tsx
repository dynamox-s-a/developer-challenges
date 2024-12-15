import * as React from "react";
import type { Metadata } from "next";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArrowLeft } from "@mui/icons-material";

export default function NotFoundPage(): React.JSX.Element {
  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Stack spacing={3} sx={{ alignItems: "center", maxWidth: "md" }}>
        <Box>
          <Box
            component="img"
            alt="404 Not Found"
            src="/assets/error-404.png"
            sx={{
              display: "inline-block",
              height: "auto",
              maxWidth: "100%",
              width: "400px",
            }}
          />
        </Box>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          404: The page you are looking for isn&apos;t here
        </Typography>
        <Typography
          color="text.secondary"
          variant="body1"
          sx={{ textAlign: "center" }}
        >
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation to get back on track.
        </Typography>
        <Button
          component={RouterLink}
          href="/"
          startIcon={<ArrowLeft />}
          variant="contained"
        >
          Go back to home
        </Button>
      </Stack>
    </Box>
  );
}
