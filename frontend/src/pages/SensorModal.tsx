import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, MenuItem, TextField, Alert, Box 
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { associateSensor, resetSensorState } from '../features/sensors/sensorSlice';
import { fetchMonitoringPoints } from '../features/monitoringPoints/monitoringPointSlice';

interface SensorModalProps {
  open: boolean;
  onClose: () => void;
  point: any | null;
}

export const SensorModal = ({ open, onClose, point }: SensorModalProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.sensors);
  
  const [sensorId, setSensorId] = useState('');
  const [model, setModel] = useState('');

  const isPump = point?.machine_type === 'Pump';

  const handleSave = async () => {
    if (point && sensorId && model) {
      const result = await dispatch(associateSensor({
        id: sensorId,
        model: model,
        monitoring_point_id: point.point_id
      }));

      if (associateSensor.fulfilled.match(result)) {
        dispatch(fetchMonitoringPoints({ page: 1, sort_by: 'point_name', order: 'asc' }));
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setSensorId('');
    setModel('');
    dispatch(resetSensorState());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Associar Novo Sensor</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="ID Único do Sensor (Serial)"
            fullWidth
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          />

          <TextField
            select
            label="Modelo do Sensor"
            fullWidth
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <MenuItem value="TcAg" disabled={isPump}>TcAg {isPump && '(Bloqueado para tipo Pump)'}</MenuItem>
            <MenuItem value="TcAs" disabled={isPump}>TcAs {isPump && '(Bloqueado para tipo Pump)'}</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={!sensorId || !model || loading}
          sx={{
            bgcolor: '#7a2f54',
            '&:hover': {
              bgcolor: '#8a3f64'
            }
          }}
        >
          {loading ? 'Associando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};