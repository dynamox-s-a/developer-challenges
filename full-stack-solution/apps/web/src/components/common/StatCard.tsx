import type { ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface StatCardProps {
  label: string;
  value: string | number | null;
  icon?: ReactNode;
  /** Shows a skeleton instead of the value. */
  loading?: boolean;
  caption?: string;
}

/**
 * Single metric tile, inspired by the Devias "budget"/"total customers" cards.
 * Used for the overview counters and the time-series metrics.
 */
export function StatCard({
  label,
  value,
  icon,
  loading = false,
  caption,
}: StatCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" variant="overline">
              {label}
            </Typography>
            {loading ? (
              <Skeleton width={96} height={40} />
            ) : (
              <Typography variant="h4" noWrap>
                {value ?? "—"}
              </Typography>
            )}
            {caption ? (
              <Typography color="text.secondary" variant="caption">
                {caption}
              </Typography>
            ) : null}
          </Stack>
          {icon ? (
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                height: 48,
                width: 48,
              }}
            >
              {icon}
            </Avatar>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
