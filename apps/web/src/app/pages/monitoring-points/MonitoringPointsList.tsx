import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Sensors as SensorIcon, Timeline as TimelineIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchMonitoringPoints, createMonitoringPoint, updateMonitoringPoint, deleteMonitoringPoint } from '@/app/store/slices/monitoringPointsSlice';
import { fetchMachines } from '@/app/store/slices/machinesSlice';
import { createSensor, updateSensor } from '@/app/store/slices/sensorsSlice';
import type { MonitoringPoint } from '@/app/types';
import { TimeSeriesChart } from '@/app/components/TimeSeriesChart';
import { TimeSeriesDataForm } from '@/app/components/TimeSeriesDataForm';

export const MonitoringPointsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, page, limit, loading } = useSelector((state: RootState) => state.monitoringPoints);
  const machines = useSelector((state: RootState) => state.machines.items);
  
  const [open, setOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MonitoringPoint | null>(null);
  const [formData, setFormData] = useState({ name: '', machineId: '' });
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sensor Dialog
  const [sensorOpen, setSensorOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(null);
  const [sensorModel, setSensorModel] = useState<'TcAg' | 'TcAs' | 'HF+'>('TcAg');

  // Chart Dialog
  const [chartOpen, setChartOpen] = useState(false);

  useEffect(() => {
    const currentLimit = limit < 5 ? 5 : limit;
    dispatch(fetchMonitoringPoints({ page, limit: currentLimit, sortBy, sortOrder }));
    dispatch(fetchMachines());
  }, [dispatch, page, limit, sortBy, sortOrder]);

  const handleOpen = (point?: MonitoringPoint) => {
    if (point) {
      setEditingPoint(point);
      setFormData({ name: point.name, machineId: point.machineId });
    } else {
      setEditingPoint(null);
      setFormData({ name: '', machineId: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPoint(null);
  };

  const handleSubmit = async () => {
    if (editingPoint) {
      await dispatch(updateMonitoringPoint({ id: editingPoint.id, data: { name: formData.name } }));
    } else {
      await dispatch(createMonitoringPoint(formData));
    }
    dispatch(fetchMonitoringPoints({ page, limit, sortBy, sortOrder }));
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this monitoring point?')) {
      await dispatch(deleteMonitoringPoint(id));
      dispatch(fetchMonitoringPoints({ page, limit, sortBy, sortOrder }));
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(fetchMonitoringPoints({ page: newPage + 1, limit, sortBy, sortOrder }));
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(fetchMonitoringPoints({ page: 1, limit: parseInt(event.target.value, 10), sortBy, sortOrder }));
  };

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  // Sensor Management
  const handleOpenSensor = (point: MonitoringPoint) => {
    setSelectedPoint(point);
    const isPump = point.machine?.type === 'Pump';
    const current = point.sensor?.model;
    const validForPump = current === 'HF+';
    setSensorModel(isPump && !validForPump ? 'HF+' : (current || (isPump ? 'HF+' : 'TcAg')));
    setSensorOpen(true);
  };

  const handleCloseSensor = () => {
    setSensorOpen(false);
    setSelectedPoint(null);
  };

  const handleSaveSensor = async () => {
    if (selectedPoint) {
      if (selectedPoint.sensor) {
        await dispatch(updateSensor({ id: selectedPoint.sensor.id, data: { model: sensorModel } }));
      } else {
        await dispatch(createSensor({ model: sensorModel, monitoringPointId: selectedPoint.id }));
      }
      dispatch(fetchMonitoringPoints({ page, limit, sortBy, sortOrder }));
      handleCloseSensor();
    }
  };

  // Chart Management
  const handleOpenChart = (point: MonitoringPoint) => {
    setSelectedPoint(point);
    setChartOpen(true);
  };

  const handleCloseChart = () => {
    setChartOpen(false);
    setSelectedPoint(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Monitoring Points</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Point
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'machineName'}
                  direction={sortBy === 'machineName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('machineName')}
                >
                  Machine Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'machineType'}
                  direction={sortBy === 'machineType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('machineType')}
                >
                  Machine Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'sensorModel'}
                  direction={sortBy === 'sensorModel' ? sortOrder : 'asc'}
                  onClick={() => handleSort('sensorModel')}
                >
                  Sensor Model
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.machine?.name}</TableCell>
                <TableCell>{point.machine?.type}</TableCell>
                <TableCell>{point.sensor?.model || '-'}</TableCell>
                <TableCell>
                  {point.sensor && (
                    <Tooltip title="View Data">
                      <IconButton onClick={() => handleOpenChart(point)} color="info">
                        <TimelineIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Manage Sensor">
                    <IconButton onClick={() => handleOpenSensor(point)} color="secondary">
                      <SensorIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpen(point)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(point.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No monitoring points found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Monitoring Point Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingPoint ? 'Edit Monitoring Point' : 'Add Monitoring Point'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {!editingPoint && (
            <TextField
              select
              margin="dense"
              label="Machine"
              fullWidth
              value={formData.machineId}
              onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
            >
              {machines.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type})
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sensor Dialog */}
      <Dialog open={sensorOpen} onClose={handleCloseSensor}>
        <DialogTitle>{selectedPoint?.sensor ? 'Edit Sensor' : 'Add Sensor'}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Monitoring Point: {selectedPoint?.name}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Machine: {selectedPoint?.machine?.name} ({selectedPoint?.machine?.type})
          </Typography>
          <TextField
            select
            margin="dense"
            label="Sensor Model"
            fullWidth
            value={sensorModel}
            onChange={(e) => setSensorModel(e.target.value as 'TcAg' | 'TcAs' | 'HF+')}
            helperText={selectedPoint?.machine?.type === 'Pump' && 'TcAg e TcAs não são compatíveis com máquinas Pump.'}
          >
            <MenuItem value="TcAg" disabled={selectedPoint?.machine?.type === 'Pump'}>
              TcAg
            </MenuItem>
            <MenuItem value="TcAs" disabled={selectedPoint?.machine?.type === 'Pump'}>
              TcAs
            </MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSensor}>Cancel</Button>
          <Button onClick={handleSaveSensor} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chart Dialog */}
      <Dialog open={chartOpen} onClose={handleCloseChart} maxWidth="md" fullWidth>
        <DialogTitle>Time Series Data - {selectedPoint?.name}</DialogTitle>
        <DialogContent>
          {selectedPoint?.sensor && (
            <>
              <TimeSeriesDataForm sensorId={selectedPoint.sensor.id} />
              <TimeSeriesChart sensorId={selectedPoint.sensor.id} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChart}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
