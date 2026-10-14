import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Placeholder shown when a list has loaded successfully but has no rows. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <Typography variant="h6">{title}</Typography>
        {description ? (
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        ) : null}
        {action}
      </Stack>
    </Box>
  );
}
