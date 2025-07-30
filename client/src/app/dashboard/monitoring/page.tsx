'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';


type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  return [...array].sort(comparator);
}

const machines = [
  { id: 'USR-010', name: 'Pump Alpha Romeo', type: 'pump', monitoringPoints: [] },
  {
    id: 'USR-009',
    name: 'Cooling Beta',
    type: 'fan',
    monitoringPoints: [
      { id: 'USR-009-001', monitoringPointName: 'Temperature', sensorType: 'TcAg' },
      { id: 'USR-009-002', monitoringPointName: 'Humidity', sensorType: 'TcAS' },
      { id: 'USR-009-003', monitoringPointName: 'Pressure', sensorType: 'HF+' },
    ],
  },
  {
    id: 'USR-008',
    name: 'Industrial Gamma',
    type: 'pump',
    monitoringPoints: [
      { id: 'USR-008-004', monitoringPointName: 'Temperature', sensorType: 'TcAg' },
      { id: 'USR-008-005', monitoringPointName: 'Humidity', sensorType: 'TcAS' },
      { id: 'USR-008-006', monitoringPointName: 'Pressure', sensorType: 'HF+' },
      { id: 'USR-008-007', monitoringPointName: 'Level', sensorType: 'HF+' },
      { id: 'USR-008-008', monitoringPointName: 'Flow', sensorType: 'HF+' },
    ],
  },
];

type MonitoringPoint = {
  id: string;
  monitoringPointName: string;
  sensorType: string;
  machineName: string;
};

export default function Page(): React.JSX.Element {
  const [orderBy, setOrderBy] = React.useState<keyof MonitoringPoint>('id');
  const [order, setOrder] = React.useState<Order>('asc');
  const [open, setOpen] = React.useState(false);
  const [selectedMachineId, setSelectedMachineId] = React.useState<string>('');
  const [monitoringPointName, setMonitoringPointName] = React.useState<string>('');
  const [sensorType, setSensorType] = React.useState<string>('');

  const monitoringPoints = machines.flatMap((m) => m.monitoringPoints.map(point => ({
    ...point,
    machineName: m.name,
    machineType: m.type
  })));

  const sorted = stableSort(monitoringPoints, getComparator(order, orderBy));

  const handleSort = (property: keyof MonitoringPoint) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleAddMonitoringPoint = () => {
    // Here you would typically save the monitoring point
    console.log('Adding monitoring point:', {
      machineId: selectedMachineId,
      monitoringPointName,
      sensorType
    });
    
    // Reset form
    setSelectedMachineId('');
    setMonitoringPointName('');
    setSensorType('');
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setSelectedMachineId('');
    setMonitoringPointName('');
    setSensorType('');
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {(['machineName', 'machineType', 'monitoringPointName', 'sensorType'] as (keyof MonitoringPoint)[]).map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {({
                      id: 'Point ID',
                      monitoringPointName: 'Monitoring Point Name', 
                      sensorType: 'Sensor Type',
                      machineName: 'Machine Name',
                      machineType: 'Machine Type'
                    }[key] || key)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.machineName}</TableCell>
                <TableCell>{point.machineType}</TableCell>
                <TableCell>{point.monitoringPointName}</TableCell>
                <TableCell>{point.sensorType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add Monitoring Point</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: 400 }}>
            <FormControl fullWidth>
              <InputLabel>Machine Name</InputLabel>
              <Select
                value={selectedMachineId}
                label="Machine Name"
                onChange={(e) => setSelectedMachineId(e.target.value)}
              >
                {machines.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Monitoring Point Name"
              value={monitoringPointName}
              onChange={(e) => setMonitoringPointName(e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Sensor Type</InputLabel>
              <Select
                value={sensorType}
                label="Sensor Type"
                onChange={(e) => setSensorType(e.target.value)}
              >
                <MenuItem value="TcAg">Temperature (TcAg)</MenuItem>
                <MenuItem value="TcAS">Humidity (TcAS)</MenuItem>
                <MenuItem value="HF+">Pressure/Level/Flow (HF+)</MenuItem>
              </Select>
            </FormControl>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleAddMonitoringPoint}
                disabled={!selectedMachineId || !monitoringPointName || !sensorType}
              >
                Add Monitoring Point
              </Button>
              <Button variant="outlined" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
