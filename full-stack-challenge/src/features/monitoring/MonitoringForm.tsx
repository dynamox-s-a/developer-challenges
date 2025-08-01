import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useState } from 'react';
import { addMonitoringPoint, addSensorToPoint, type SensorModel } from './MonitoringSlice';
import { v4 as uuidv4 } from 'uuid';
import type { Machine } from '../machine/MachinesSlice';

export default function MonitoringForm() {
    const dispatch = useDispatch();
    const machines = useSelector((state: RootState) => state.machines.list);
    const [name, setName] = useState('');
    const [machineId, setMachineId] = useState('');
    const [sensorModel, setSensorModel] = useState<SensorModel>('HF+');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const machine = machines.find(m => m.id === machineId);
        if (!machine) return;

        if (['TcAg', 'TcAs'].includes(sensorModel) && machine.type === 'Pump') {
            alert('TcAg and TcAs sensors cannot be used with pump-type machines.');
            return;
        }

        const pointId = uuidv4();

        dispatch(
        addMonitoringPoint({
            id: pointId,
            name,
            machineId,
        })
        );

        dispatch(
        addSensorToPoint({
            pointId,
            sensor: {
            id: uuidv4(),
            model: sensorModel,
            },
        })
        );

        setName('');
        setMachineId('');
        setSensorModel('HF+');
    };

  return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Add Monitoring Point</Typography>

        <TextField
            label="Point Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
        />

        <FormControl fullWidth>
            <InputLabel>Machine</InputLabel>
            <Select
            value={machineId}
            label="Machine"
            onChange={e => setMachineId(e.target.value)}
            required
            >
            {machines.map((machine: Machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                {machine.name} ({machine.type})
                </MenuItem>
            ))}
            </Select>
        </FormControl>

        <TextField
            select
            label="Sensor model"
            value={sensorModel}
            onChange={e => setSensorModel(e.target.value as SensorModel)}
        >
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
        </TextField>

        <Button variant="contained" type="submit">
            Add
        </Button>
        </Box>
    );
}
