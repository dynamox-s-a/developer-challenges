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

export const metadata = { title: `Monitoring points | Dashboard | ${config.site.name}` } satisfies Metadata;

// Data
export interface MonitoringPoints {
    id: string;
    name: string;
    type: string;
    machineId: string;
    machineName: string;
    machineType: string;
  }

const initialRows: GridRowsProp = [
  { id: '001', name: 'IT-001', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  { id: '002', name: 'IT-002', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  { id: '003', name: 'IT-003', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  { id: '005', name: 'IT-005', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  { id: '006', name: 'IT-006', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  { id: '007', name: 'IT-007', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  { id: '008', name: 'IT-008', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  { id: '009', name: 'IT-009', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
] satisfies MonitoringPoints[];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150, editable: false },
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
        field: 'type',
        headerName: 'Type',
        width: 220,
        editable: true,
        type: 'singleSelect',
        valueOptions: ["TcAg", "TcAs", "HF+"]
    },
    { field: 'machineId', headerName: 'Machined ID', width: 180, editable: true },
    { field: 'machineName', headerName: 'Machine name', width: 180, editable: false },
    { field: 'machineType', headerName: 'Machine type', width: 180, editable: false },
  ];


export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring points</Typography>
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
