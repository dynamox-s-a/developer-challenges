'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines } from '@/store/features/machinesSlice';
import { useEffect, useMemo } from 'react';
import { MonitoringPointsTable, type MonitoringPoint } from '@/components/dashboard/monitoring/monitoring-points-table';
import { AddMonitoringPointDialog } from '@/components/dashboard/monitoring/add-monitoring-point-dialog';
import { fetchMonitoringPoints } from '@/store/features/monitoringPointsSlice';

type Order = 'asc' | 'desc';

export default function Page(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { list: monitoringPointsData, loading: monitoringPointsLoading, error: monitoringPointsError } = useSelector((state: RootState) => state.monitoringPoints);
  const { list: machinesData, loading: machinesLoading } = useSelector((state: RootState) => state.machines);
  const [orderBy, setOrderBy] = React.useState<keyof MonitoringPoint>('id');
  const [order, setOrder] = React.useState<Order>('asc');
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
    dispatch(fetchMachines());
  }, [dispatch]);

  // Combine monitoring points with machine data
  const monitoringPoints = useMemo(() => {
    return monitoringPointsData.map((point: import('@/store/features/monitoringPointsSlice').MonitoringPoint) => {
      const machine = machinesData.find(m => m.id === point.machineId);
      return {
        id: point.id || point.sensorId, // Use sensorId as id if id is not available
        name: point.name,
        sensorType: point.sensorType,
        machineId: point.machineId,
        sensorId: point.sensorId,
        machineName: machine?.name || 'Unknown Machine',
        machineType: machine?.type || 'Unknown Type'
      };
    });
  }, [monitoringPointsData, machinesData]);

  const handleSort = (property: keyof MonitoringPoint) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    // Refetch monitoring points after adding a new one
    dispatch(fetchMonitoringPoints());
  };

  const isLoading = monitoringPointsLoading || machinesLoading;

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
            disabled={isLoading}
          >
            Add
          </Button>
        </div>
      </Stack>

      {monitoringPointsError && (
        <Alert severity="error">
          {monitoringPointsError}
        </Alert>
      )}

      {isLoading ? (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography>Loading monitoring points...</Typography>
        </Stack>
      ) : (
        <MonitoringPointsTable
          monitoringPoints={monitoringPoints}
          orderBy={orderBy}
          order={order}
          onSort={handleSort}
        />
      )}
      
      <AddMonitoringPointDialog
        open={open}
        onClose={handleCloseDialog}
        machines={machinesData}
      />
    </Stack>
  );
}
