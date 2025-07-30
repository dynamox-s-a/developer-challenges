'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines } from '@/store/features/machinesSlice';
import { useEffect } from 'react';
import { MonitoringPointsTable, type MonitoringPoint } from '@/components/dashboard/monitoring/monitoring-points-table';
import { AddMonitoringPointDialog } from '@/components/dashboard/monitoring/add-monitoring-point-dialog';

type Order = 'asc' | 'desc';

export default function Page(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { list: machines, loading, error } = useSelector((state: RootState) => state.machines);
  const [orderBy, setOrderBy] = React.useState<keyof MonitoringPoint>('id');
  const [order, setOrder] = React.useState<Order>('asc');
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const monitoringPoints = machines.flatMap((m) => m.monitoringPoints.map(point => ({
    ...point,
    machineName: m.name,
    machineType: m.type
  })));

  const handleSort = (property: keyof MonitoringPoint) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring Points</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add
          </Button>
        </div>
      </Stack>

      <MonitoringPointsTable
        monitoringPoints={monitoringPoints}
        orderBy={orderBy}
        order={order}
        onSort={handleSort}
      />
      
      <AddMonitoringPointDialog
        open={open}
        onClose={handleCloseDialog}
        machines={machines}
      />
    </Stack>
  );
}
