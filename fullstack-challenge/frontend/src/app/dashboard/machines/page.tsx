import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import MachineRepository from '@/lib/repository/machine';
import { MachinesTable } from '@/components/dashboard/machines/machines-table';

export const metadata = { title: `Machines | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const repository = new MachineRepository()
  const fetchRowsPromise = repository.list()

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
        </Stack>
      </Stack>
      <MachinesTable fetchRowsPromise={fetchRowsPromise}></MachinesTable>
    </Stack>
  );
}
