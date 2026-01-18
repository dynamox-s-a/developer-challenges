import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import MonitoringPointRepository from '@/lib/repository/monitoring-point';
import { MonitoringPointsTable } from '@/components/dashboard/monitoring-points/monitoring-points-table';

export const metadata = { title: `Monitoring points | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const repository = new MonitoringPointRepository()
  const fetchRowsPromise = repository.list()

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">MonitoringPoints</Typography>
        </Stack>
      </Stack>
      <MonitoringPointsTable fetchRowsPromise={fetchRowsPromise}></MonitoringPointsTable>
    </Stack>
  );
}

