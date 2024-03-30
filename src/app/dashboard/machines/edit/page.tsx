'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Button from '@mui/material/Button';

import { config } from '@/config';
import { MachineForm } from '@/components/dashboard/machine/machine-form';

import { paths } from '@/paths';
import { machine_types } from '@/types';
import RouterLink from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import { MonitoringPointTable } from '@/components/dashboard/monitoring-point/monitoring-point-table';
import type { MonitoringPoint } from '@/components/dashboard/monitoring-point/monitoring-point-table';

let monitoringPoints = [
  {
    id: '1',
    name: 'Monitoring Point 01',
    type: 'TcAg',
    machine: 'Machine 01'
  },
  {
    id: '2',
    name: 'Monitoring Point 02',
    type: 'HF+',
    machine: 'Machine 02'
  }
] satisfies MonitoringPoint[];


export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams()
  const id = searchParams.get(`id`);


  const page = 0;
  const rowsPerPage = 5;
  const router = useRouter();

  const paginatedMonitoringpoints = applyPagination(monitoringPoints, page, rowsPerPage);

  const handleDeleteClick = React.useCallback((evt) => {

    const objWithIdIndex = monitoringPoints.findIndex((obj) => obj.id === evt.currentTarget.id);
    monitoringPoints.splice(objWithIdIndex, 1);

    console.log('onClick', evt.currentTarget.id);

    router.refresh();
  }, []);


  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">{id ? 'Edit' : 'Add'} Machine {id}</Typography>
      </div>
      
      <Grid container spacing={3}>
        <Grid>
          <MachineForm id={id}/>
        </Grid>
      </Grid>
      
      <Stack>
        <Stack sx={{ 'margin-top': '25px', 'margin-bottom': '15px' }} direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5">Monitoring Points</Typography>
          </Stack>
          <div>
            <Button sx={{ 'display': id != undefined ? 'flex' : 'none' }} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" component={RouterLink} href={paths.dashboard.edit_monitoring_point}>
              Add
            </Button>
          </div>
        </Stack>
          
        <Grid>
            <MonitoringPointTable
              count={paginatedMonitoringpoints.length}
              page={page}
              rows={paginatedMonitoringpoints}
              rowsPerPage={rowsPerPage}
              handleDeleteClick={handleDeleteClick}
            />
        </Grid>
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: MonitoringPoint[], page: number, rowsPerPage: number): MonitoringPoint[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
