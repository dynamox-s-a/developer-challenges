import type { ReadingsMetricsDto } from '@dynapredict/shared-types';
import { Box, Paper, Typography } from '@mui/material';
import { formatDateTime, formatNumber } from '../utils/format';

interface Tile {
  label: string;
  value: string | null;
}

function tiles(metrics: ReadingsMetricsDto | null): Tile[] {
  const number = (value: number | null | undefined) =>
    value === null || value === undefined ? null : formatNumber(value);
  const date = (value: string | null | undefined) =>
    value ? formatDateTime(value) : null;
  return [
    { label: 'Readings', value: number(metrics?.count) },
    { label: 'Minimum', value: number(metrics?.min) },
    { label: 'Maximum', value: number(metrics?.max) },
    { label: 'Average', value: number(metrics?.avg) },
    { label: 'First reading', value: date(metrics?.firstTimestamp) },
    { label: 'Last reading', value: date(metrics?.lastTimestamp) },
  ];
}

export interface MetricsCardsProps {
  metrics: ReadingsMetricsDto | null;
  /** Dims the current values while new ones load, instead of flashing. */
  loading?: boolean;
}

/**
 * The series' aggregates as stat tiles, beside the chart: the visible text
 * alternative to it. A dl keeps each label tied to its value for screen
 * readers; a missing value (no readings) reads "No data", not a fake zero.
 */
export function MetricsCards({ metrics, loading = false }: MetricsCardsProps) {
  return (
    <Box
      component="dl"
      aria-label="Series metrics"
      aria-busy={loading}
      sx={{
        m: 0,
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(6, minmax(0, 1fr))',
        },
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 150ms',
      }}
    >
      {tiles(metrics).map((tile) => (
        <Paper key={tile.label} variant="outlined" sx={{ p: 1.5, minWidth: 0 }}>
          <Typography
            component="dt"
            variant="body2"
            color="text.secondary"
            noWrap
          >
            {tile.label}
          </Typography>
          <Typography
            component="dd"
            variant="h6"
            sx={{ m: 0, fontWeight: 600, overflowWrap: 'anywhere' }}
          >
            {tile.value ?? (
              <Typography component="span" color="text.secondary">
                No data
              </Typography>
            )}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
