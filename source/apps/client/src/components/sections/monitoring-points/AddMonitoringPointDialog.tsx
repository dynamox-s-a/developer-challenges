import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  FormHelperText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store/store';
import { fetchMachines } from 'store/slices/machinesSlice';
import { createMonitoringPoint, associateSensor, fetchMonitoringPoints } from 'store/slices/monitoringPointsSlice';

interface AddMonitoringPointDialogProps {
  open: boolean;
  onClose: () => void;
}

const SENSOR_MODELS = [
  { value: 'TcAg', label: 'TcAg' },
  { value: 'TcAs', label: 'TcAs' },
  { value: 'HF_Plus', label: 'HF+' },
];

const AddMonitoringPointDialog = ({ open, onClose }: AddMonitoringPointDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: machines } = useSelector((state: RootState) => state.machines);
  
  const [name, setName] = useState('');
  const [machineId, setMachineId] = useState<number | ''>('');
  const [sensorModel, setSensorModel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPump, setIsPump] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchMachines());
    }
  }, [open, dispatch]);

  const validate = () => {
    if (!name || !machineId || !sensorModel) {
      setError('Please fill in all fields');
      return false;
    }

    const selectedMachine = machines.find(m => m.id === machineId);
    if (selectedMachine?.type === 'Pump' && (sensorModel === 'TcAg' || sensorModel === 'TcAs')) {
      setError('Pump machines cannot be associated with TcAg or TcAs sensors');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // 1. Create Monitoring Point
      const mpAction = await dispatch(createMonitoringPoint({ name, machineId: machineId as number }));
      if (createMonitoringPoint.rejected.match(mpAction)) {
        throw new Error('Failed to create monitoring point');
      }

      const newMp = mpAction.payload;

      // 2. Associate Sensor (Auto-generate ID)
      const autoSensorId = `SN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const sensorAction = await dispatch(associateSensor({ 
        pointId: newMp.id, 
        sensorId: autoSensorId, 
        model: sensorModel 
      }));

      if (associateSensor.rejected.match(sensorAction)) {
        throw new Error('Failed to associate sensor');
      }

      // 3. Refresh list and close
      dispatch(fetchMonitoringPoints({ page: 1 }));
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setMachineId('');
    setSensorModel('');
    setError(null);
    onClose();
  };

  useEffect(() => {
    const flag = machines.find(({ id }) => id == machineId)?.type;
    setIsPump(flag == 'Pump');
  }, [machineId])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Add New Monitoring Point</DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Stack direction="column" spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
            required
            placeholder="e.g. Motor Drive End"
          />

          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel>Machine</InputLabel>
            <Select
              value={machineId}
              label="Machine"
              onChange={(e) => setMachineId(Number(e.target.value))}
            >
              {machines.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel>Sensor Model</InputLabel>
            <Select
              value={sensorModel}
              label="Sensor Model"
              onChange={(e) => setSensorModel(e.target.value)}
            >
              {(isPump ? [SENSOR_MODELS[2]] : SENSOR_MODELS).map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Sensor ID will be automatically generated. {isPump && 'Pumps only support HF+.'}
            </FormHelperText>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Monitoring Point'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMonitoringPointDialog;
