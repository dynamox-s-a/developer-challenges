import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeading({ title, description, action }: PageHeadingProps) {
  return (
    <Stack
      alignItems={{ xs: "stretch", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={2}
    >
      <Box>
        <Typography component="h1" variant="h1">
          {title}
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
