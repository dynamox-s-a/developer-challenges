import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { MachinesTable } from '@/components/dashboard/machines/machines-table';
import type { Machine } from '@/components/dashboard/machines/machines-table';
import { AddDialogButton } from '@/components/dashboard/machines/machines-add-form';
import { EditDialogButton } from '@/components/dashboard/machines/machine-edit-form';

export const metadata = { title: `Machines | Dashboard | ${config.site.name}` } satisfies Metadata;

// Data
const machines = [
  {
    id: '001',
    name: 'AEP-001',
    type: 'Pump', 
  },
  {
    id: '002',
    name: 'AEP-002',
    type: 'Pump', 
  },
  {
    id: '003',
    name: 'GIP-001',
    type: 'Pump', 
  },
  {
    id: '005',
    name: 'GIP-002',
    type: 'Pump', 
  },
  {
    id: '006',
    name: 'TF-001',
    type: 'Fan', 
  },
  {
    id: '007',
    name: 'TF-002',
    type: 'Fan', 
  },
  {
    id: '008',
    name: 'TF-003',
    type: 'Fan', 
  },
  {
    id: '009',
    name: 'TF-005',
    type: 'Fan', 
  },
] satisfies Machine[];

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
        </Stack>
        <AddDialogButton/>
        <EditDialogButton/>
      </Stack>
      <MachinesTable
        count={machines.length}
        rows={machines}
      />
    </Stack>
  );
}
