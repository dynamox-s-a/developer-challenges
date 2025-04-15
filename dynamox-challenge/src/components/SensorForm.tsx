import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postSensor } from '../redux/actions/monitoringActions';
import { AppDispatch, RootState } from '../redux/store'; 
import { Machine, MonitoringPoint } from '../types';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

interface SensorFormProps {
  monitoringPointId: string;
  onClose: () => void;
}

export default function SensorForm({ monitoringPointId, onClose }: SensorFormProps) {
  const [model, setModel] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const machines = useSelector((state: RootState) => state.machines);
  const monitoringPoints = useSelector((state: RootState) => state.monitoringPoints);
  const monitoringPoint = monitoringPoints.find((point: MonitoringPoint) => point.id === monitoringPointId);
  const machine = machines.find((machine: Machine) => machine.id === monitoringPoint?.machineId);

  const handleSubmit = () => {
    if (model) {
      dispatch(postSensor(model, monitoringPointId));
      onClose(); 
    }
  };

  return (
    <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" component="h4">Add Sensor</Typography>
      <FormControl fullWidth>
        <InputLabel id="sensor-model-label">{machine && machine.type !== "Pump" ? "Selecione um modelo" : "Select a model"}</InputLabel>
        <Select
          labelId="sensor-model-label"
          id="sensor-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          label={machine && machine.type !== "Pump" ? "Selecione um modelo" : "Select a model"}
        >
          <MenuItem value="">
            {machine && machine.type !== "Pump" ? "Selecione um modelo" : "Select a model"}
          </MenuItem>
          { machine && machine.type !== "Pump" && (
          <>
          <MenuItem value="HF+">HF+</MenuItem>
          <MenuItem value="TcAg">TcAg</MenuItem>
          <MenuItem value="TcAs">TcAs</MenuItem>
          </>
          )}
          <MenuItem value="HF+">HF+</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!model}>Add</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  );
}
