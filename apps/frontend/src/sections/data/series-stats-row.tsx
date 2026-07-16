import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { MetricGroup } from 'src/store/measurements/selectors';

import { seriesColor, seriesLabel } from './chart-options';

const format = (value: number, metric: MetricGroup['metric']) =>
  value.toFixed(metric === 'acceleration' ? 4 : 2);

export function SeriesStatsRow({ group }: { group: MetricGroup }) {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ px: 3, pb: 2, overflowX: 'auto', scrollbarWidth: 'thin' }}
    >
      {group.series.map((series) => (
        <Stack key={series.id} spacing={0.5} sx={{ minWidth: 128 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: seriesColor(series) }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {seriesLabel(series)}
            </Typography>
          </Stack>

          <Typography variant="subtitle2">
            {format(series.stats.last, group.metric)}
            <Typography component="span" variant="caption" sx={{ color: 'text.disabled', ml: 0.5 }}>
              {group.unit}
            </Typography>
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            máx {format(series.stats.max, group.metric)} • méd {format(series.stats.avg, group.metric)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
