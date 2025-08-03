'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from '@mui/material';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { type Machine } from '@/store/features/machinesSlice';
import { createMonitoringPoint } from '@/store/features/monitoringPointsSlice';

// Sensor type configurations
const SENSOR_CONFIGS = {
  pump: [
    { value: 'HF+', label: 'Pressure/Level/Flow (HF+)' }
  ],
  fan: [
    { value: 'TcAg', label: 'Temperature (TcAg)' },
    { value: 'TcAs', label: 'Humidity (TcAs)' },
    { value: 'HF+', label: 'Pressure/Level/Flow (HF+)' }
  ]
} as const;

interface AddMonitoringPointDialogProps {
  open: boolean;
  onClose: () => void;
  machines: Machine[];
}

export function AddMonitoringPointDialog({ 
  open, 
  onClose, 
  machines 
}: AddMonitoringPointDialogProps): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMachineId, setSelectedMachineId] = React.useState<string>('');
  const [monitoringPointName, setMonitoringPointName] = React.useState<string>('');
  const [sensorType, setSensorType] = React.useState<string>('');

  const handleMachineChange = (machineId: string) => {
    setSelectedMachineId(machineId);
    // Reset sensor type when machine changes
    setSensorType('');
  };

  const handleAddMonitoringPoint = () => {
    dispatch(createMonitoringPoint({ name: monitoringPointName, sensorType, machineId: selectedMachineId }));
    setSelectedMachineId('');
    setMonitoringPointName('');
    setSensorType('');
    onClose();
  };

  const handleClose = () => {
    setSelectedMachineId('');
    setMonitoringPointName('');
    setSensorType('');
    onClose();
  };

  // Get the selected machine to determine available sensor types
  const selectedMachine = machines.find(machine => machine.id === selectedMachineId);
  const machineType = selectedMachine?.type as keyof typeof SENSOR_CONFIGS;
  const availableSensors = machineType ? SENSOR_CONFIGS[machineType] : [];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Monitoring Point</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2, minWidth: 400 }}>
          <FormControl fullWidth>
            <InputLabel>Machine Name</InputLabel>
            <Select
              value={selectedMachineId}
              label="Machine Name"
              onChange={(e) => handleMachineChange(e.target.value as string)}
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
              onChange={(e) => setSensorType(e.target.value as string)}
              disabled={!selectedMachineId}
            >
              {availableSensors.map((sensor) => (
                <MenuItem key={sensor.value} value={sensor.value}>
                  {sensor.label}
                </MenuItem>
              ))}
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
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 