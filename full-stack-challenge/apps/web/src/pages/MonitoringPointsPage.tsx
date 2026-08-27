import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SensorsIcon from '@mui/icons-material/Sensors';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Link as RouterLink } from 'react-router-dom';
import {
  MachineType,
  SensorModel,
  isSensorAllowedForMachine,
  type MachineDto,
  type MonitoringPointDto,
  type MonitoringPointSortField,
} from '@dynamox/shared';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { fetchMachines } from '../features/machines/machinesSlice';
import {
  associateSensor,
  clearMonitoringPointsError,
  createMonitoringPoint,
  deleteMonitoringPoint,
  fetchMonitoringPoints,
  removeSensor,
  setMonitoringPointsPage,
  setMonitoringPointsSort,
} from '../features/monitoringPoints/monitoringPointsSlice';

const ALL_SENSOR_MODELS = [SensorModel.TcAg, SensorModel.TcAs, SensorModel.HFPlus];

const SORTABLE_COLUMNS: MonitoringPointSortField[] = [
  'machineName',
  'machineType',
  'name',
  'sensorModel',
];

type ConfirmAction =
  | { type: 'deletePoint'; point: MonitoringPointDto }
  | { type: 'removeSensor'; point: MonitoringPointDto }
  | null;

export function MonitoringPointsPage() {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines.items);
  const {
    items,
    page,
    totalPages,
    total,
    sortBy,
    order,
    status,
    mutationStatus,
    error,
  } = useAppSelector((state) => state.monitoringPoints);

  const [createOpen, setCreateOpen] = useState(false);
  const [sensorOpen, setSensorOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPointDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [createForm, setCreateForm] = useState({ machineId: '', name: '' });
  const [sensorForm, setSensorForm] = useState({
    sensorId: '',
    model: SensorModel.HFPlus as SensorModel,
  });

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page, sortBy, order, limit: 5 }));
  }, [dispatch, page, sortBy, order]);

  const selectedMachine: MachineDto | undefined = useMemo(
    () => machines.find((machine) => machine.id === createForm.machineId),
    [machines, createForm.machineId]
  );

  const selectedMachinePointCount = selectedMachine?.monitoringPointsCount ?? 0;

  const allowedModelsForSelectedPoint = useMemo(() => {
    if (!selectedPoint) return ALL_SENSOR_MODELS;
    return ALL_SENSOR_MODELS.filter((model) =>
      isSensorAllowedForMachine(selectedPoint.machineType, model)
    );
  }, [selectedPoint]);

  const machinesBelowRecommended = useMemo(
    () => machines.filter((machine) => machine.monitoringPointsCount < 2),
    [machines]
  );

  const openCreate = () => {
    dispatch(clearMonitoringPointsError());
    setCreateForm({
      machineId: machines[0]?.id ?? '',
      name: '',
    });
    setCreateOpen(true);
  };

  const openSensorDialog = (point: MonitoringPointDto) => {
    dispatch(clearMonitoringPointsError());
    setSelectedPoint(point);
    const models = ALL_SENSOR_MODELS.filter((model) =>
      isSensorAllowedForMachine(point.machineType, model)
    );
    setSensorForm({
      sensorId: '',
      model: models[0] ?? SensorModel.HFPlus,
    });
    setSensorOpen(true);
  };

  const handleSort = (columnId: string) => {
    if (!SORTABLE_COLUMNS.includes(columnId as MonitoringPointSortField)) return;
    const field = columnId as MonitoringPointSortField;
    const nextOrder = sortBy === field && order === 'asc' ? 'desc' : 'asc';
    dispatch(setMonitoringPointsSort({ sortBy: field, order: nextOrder }));
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!createForm.machineId) return;

    const result = await dispatch(
      createMonitoringPoint({
        machineId: createForm.machineId,
        payload: { name: createForm.name },
      })
    );

    if (createMonitoringPoint.fulfilled.match(result)) {
      setCreateOpen(false);
      dispatch(fetchMachines());
      dispatch(setMonitoringPointsPage(1));
      dispatch(fetchMonitoringPoints({ page: 1, sortBy, order, limit: 5 }));
    }
  };

  const handleAssociateSensor = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPoint) return;

    const result = await dispatch(
      associateSensor({
        pointId: selectedPoint.id,
        payload: sensorForm,
      })
    );

    if (associateSensor.fulfilled.match(result)) {
      setSensorOpen(false);
      setSelectedPoint(null);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'deletePoint') {
      const result = await dispatch(deleteMonitoringPoint(confirmAction.point.id));
      if (deleteMonitoringPoint.fulfilled.match(result)) {
        dispatch(fetchMachines());
        dispatch(fetchMonitoringPoints({ page, sortBy, order, limit: 5 }));
      }
    } else {
      await dispatch(removeSensor(confirmAction.point.id));
    }

    setConfirmAction(null);
  };

  const columns: Array<DataTableColumn<MonitoringPointDto>> = useMemo(
    () => [
      {
        id: 'machineName',
        label: 'Machine Name',
        sortable: true,
        render: (row) => row.machineName,
      },
      {
        id: 'machineType',
        label: 'Machine Type',
        sortable: true,
        render: (row) => row.machineType,
      },
      {
        id: 'name',
        label: 'Monitoring Point Name',
        sortable: true,
        render: (row) => row.name,
      },
      {
        id: 'sensorModel',
        label: 'Sensor Model',
        sortable: true,
        render: (row) => row.sensorModel ?? '—',
      },
      {
        id: 'sensorId',
        label: 'Sensor ID',
        render: (row) => row.sensorId ?? '—',
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        render: (row) => (
          <>
            <IconButton
              aria-label="time-series"
              component={RouterLink}
              to={`/monitoring-points/${row.id}/time-series`}
            >
              <ShowChartIcon />
            </IconButton>
            {!row.sensorId ? (
              <IconButton aria-label="associate sensor" onClick={() => openSensorDialog(row)}>
                <SensorsIcon />
              </IconButton>
            ) : (
              <Button
                size="small"
                onClick={() => setConfirmAction({ type: 'removeSensor', point: row })}
              >
                Remove sensor
              </Button>
            )}
            <IconButton
              aria-label="delete"
              onClick={() => setConfirmAction({ type: 'deletePoint', point: row })}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Monitoring Points"
        subtitle={`${total} total · 5 per page · sort by any column`}
        actions={
          <Button variant="contained" onClick={openCreate} disabled={machines.length === 0}>
            New monitoring point
          </Button>
        }
      />

      {machines.length === 0 && (
        <Alert severity="info">Create a machine first before adding monitoring points.</Alert>
      )}

      {machinesBelowRecommended.length > 0 && (
        <Alert severity="info">
          Recommended: at least 2 monitoring points per machine. Below target:{' '}
          {machinesBelowRecommended
            .map((machine) => `${machine.name} (${machine.monitoringPointsCount})`)
            .join(', ')}
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <DataTable
        columns={columns}
        rows={items}
        getRowId={(row) => row.id}
        loading={status === 'loading'}
        emptyMessage="No monitoring points yet."
        sortBy={sortBy}
        sortDirection={order}
        onSort={handleSort}
      />

      <Box display="flex" justifyContent="flex-end">
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_event, value) => dispatch(setMonitoringPointsPage(value))}
          color="primary"
        />
      </Box>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create monitoring point</DialogTitle>
        <Box component="form" onSubmit={handleCreate}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel id="machine-label">Machine</InputLabel>
                <Select
                  labelId="machine-label"
                  label="Machine"
                  value={createForm.machineId}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, machineId: e.target.value }))
                  }
                >
                  {machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      {machine.name} ({machine.type}) · {machine.monitoringPointsCount} points
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Monitoring point name"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
              />
              {selectedMachine && selectedMachinePointCount < 2 && (
                <Alert severity="info">
                  {selectedMachine.name} currently has {selectedMachinePointCount} monitoring
                  point(s). Aim for at least 2.
                </Alert>
              )}
              {selectedMachine?.type === MachineType.Pump && (
                <Alert severity="warning">
                  Pump machines can only use HF+ sensors (TcAg/TcAs are blocked).
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={mutationStatus === 'loading'}>
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={sensorOpen} onClose={() => setSensorOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Associate sensor</DialogTitle>
        <Box component="form" onSubmit={handleAssociateSensor}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedPoint
                  ? `${selectedPoint.machineName} (${selectedPoint.machineType}) · ${selectedPoint.name}`
                  : ''}
              </Typography>
              <TextField
                label="Sensor ID"
                value={sensorForm.sensorId}
                onChange={(e) =>
                  setSensorForm((prev) => ({ ...prev, sensorId: e.target.value }))
                }
                required
                fullWidth
                helperText="Must be unique across the system"
              />
              <FormControl fullWidth>
                <InputLabel id="sensor-model-label">Sensor model</InputLabel>
                <Select
                  labelId="sensor-model-label"
                  label="Sensor model"
                  value={sensorForm.model}
                  onChange={(e) =>
                    setSensorForm((prev) => ({
                      ...prev,
                      model: e.target.value as SensorModel,
                    }))
                  }
                >
                  {allowedModelsForSelectedPoint.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedPoint?.machineType === MachineType.Pump && (
                <Alert severity="info">TcAg and TcAs are hidden for Pump machines.</Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSensorOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={mutationStatus === 'loading'}>
              Associate
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={
          confirmAction?.type === 'removeSensor'
            ? 'Remove sensor'
            : 'Delete monitoring point'
        }
        description={
          confirmAction?.type === 'removeSensor'
            ? `Remove sensor "${confirmAction.point.sensorId}" from "${confirmAction.point.name}"?`
            : `Delete monitoring point "${confirmAction?.point.name}"?`
        }
        confirmLabel={confirmAction?.type === 'removeSensor' ? 'Remove' : 'Delete'}
        loading={mutationStatus === 'loading'}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
      />
    </Stack>
  );
}
