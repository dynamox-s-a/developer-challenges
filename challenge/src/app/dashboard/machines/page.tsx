import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { MachinesFilters } from '@/components/dashboard/machines/machines-filters';
import { MachinesTable } from '@/components/dashboard/machines/machines-table';
import type { Machine } from '@/components/dashboard/machines/machines-table';

export const metadata = { title: `Machines | Dashboard | ${config.site.name}` } satisfies Metadata;

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
  const page = 0;
  const rowsPerPage = 5;

  const paginatedMachines = applyPagination(machines, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <MachinesFilters />
      <MachinesTable
        count={machines.length}
        page={page}
        rows={machines}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Machine[], page: number, rowsPerPage: number): Machine[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
