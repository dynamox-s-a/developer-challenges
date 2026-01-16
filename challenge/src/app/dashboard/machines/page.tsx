import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { InteractiveTable } from '@/components/dashboard/interactive-table';
import { 
  GridColDef,
  GridRowsProp,
} from '@mui/x-data-grid';

export const metadata = { title: `Machines | Dashboard | ${config.site.name}` } satisfies Metadata;

// Data
export interface Machine {
    id: string;
    name: string;
    type: string;
  }

const initialRows: GridRowsProp = [
  { id: '001', name: 'AEP-001', type: 'Pump'},
  { id: '002', name: 'AEP-002', type: 'Pump'},
  { id: '003', name: 'GIP-001', type: 'Pump'},
  { id: '005', name: 'GIP-002', type: 'Pump'},
  { id: '006', name: 'TF-001', type: 'Fan'},
  { id: '007', name: 'TF-002', type: 'Fan'},
  { id: '008', name: 'TF-003', type: 'Fan'},
  { id: '009', name: 'TF-005', type: 'Fan'},
] satisfies Machine[];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150, editable: false },
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    // {
    //   field: 'age',
    //   headerName: 'Age',
    //   type: 'number',
    //   width: 80,
    //   align: 'left',
    //   headerAlign: 'left',
    //   editable: true,
    // },
    // {
    //   field: 'joinDate',
    //   headerName: 'Join date',
    //   type: 'date',
    //   width: 180,
    //   editable: true,
    // },
    {
      field: 'type',
      headerName: 'Type',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Fan', 'Pump'],
    },
  ];


export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
        </Stack>
      </Stack>
      <InteractiveTable 
        columns={columns}
        columnsCount={columns.length}
        initialRows={initialRows}
      />
      {/* <MachinesTable
        count={machines.length}
        rows={machines}
      /> */}
    </Stack>
  );
}
