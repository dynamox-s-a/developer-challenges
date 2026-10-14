import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Primary action for the page, usually a button. */
  action?: ReactNode;
}

/**
 * Page title with an optional description and a trailing action.
 *
 * Stacks vertically on small screens so the action never overflows.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4">{title}</Typography>
        {description ? (
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        ) : null}
      </Stack>
      {action ? <div>{action}</div> : null}
    </Stack>
  );
}
