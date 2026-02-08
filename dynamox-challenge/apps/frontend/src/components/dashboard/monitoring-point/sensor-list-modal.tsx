import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack
} from '@mui/material';
import { Trash as TrashIcon, Plus as PlusIcon } from '@phosphor-icons/react';
import { useGetSensorsByMonitoringPointQuery, useDeleteSensorMutation, useCreateSensorMutation } from '@/store/sensors/sensors.api';
import { SensorModel } from '@/types/sensor';

interface SensorListModalProps {
  open: boolean;
  onClose: () => void;
  monitoringPoint: { id: number; name: string; machine?: { type: string } } | null;
  machine?: { type: string };
}

export function SensorListModal({ open, onClose, monitoringPoint, machine }: SensorListModalProps): React.JSX.Element {
  const [deleteSensor, { isLoading: isDeleting }] = useDeleteSensorMutation();
  const [createSensor, { isLoading: isCreating }] = useCreateSensorMutation();

  const [selectedModel, setSelectedModel] = React.useState<SensorModel | ''>('');

  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: sensors = [], isLoading, refetch } = useGetSensorsByMonitoringPointQuery(
    monitoringPoint?.id as number,
    { skip: !monitoringPoint?.id }
  );

  const machineType = machine?.type || monitoringPoint?.machine?.type;
  const isPumpMachine = machineType === 'Bomba';

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreate = async () => {
    if (!monitoringPoint?.id || !selectedModel) return;

    try {
      await createSensor({
        model: selectedModel as SensorModel,
        monitoringPointId: monitoringPoint.id
      }).unwrap();

      setSnackbar({ open: true, message: 'Sensor created successfully', severity: 'success' });
      setSelectedModel(''); // Reset selection
      refetch();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create sensor', severity: 'error' });
    }
  };

  const handleDelete = async (sensorId: number) => {
    try {
      await deleteSensor(sensorId).unwrap();
      setSnackbar({ open: true, message: 'Sensor deleted successfully', severity: 'success' });
      refetch();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete sensor', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Sensors for {monitoringPoint?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--mui-palette-background-level1)', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Add New Sensor</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth size="small">
                <InputLabel>Sensor Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Sensor Model"
                  onChange={(e) => setSelectedModel(e.target.value as SensorModel)}
                >
                  {/* Filter models based on machine type */}
                  {!isPumpMachine && <MenuItem value={SensorModel.TcAg}>TcAg</MenuItem>}
                  {!isPumpMachine && <MenuItem value={SensorModel.TcAs}>TcAs</MenuItem>}
                  <MenuItem value={SensorModel.HF_PLUS}>HF+</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={handleCreate}
                disabled={!selectedModel || isCreating}
              >
                Add
              </Button>
            </Stack>
            {isPumpMachine && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                * Pumps (Bomba) only support HF+ sensors.
              </Typography>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : sensors.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No sensors attached to this monitoring point.
            </Typography>
          ) : (
            <List>
              {sensors.map((sensor) => (
                <ListItem
                  key={sensor.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(sensor.id)} disabled={isDeleting}>
                      {isDeleting ? <CircularProgress size={20} /> : <TrashIcon />}
                    </IconButton>
                  }
                  sx={{
                    bgcolor: 'var(--mui-palette-background-paper)',
                    mb: 1,
                    borderRadius: 1,
                    border: '1px solid var(--mui-palette-divider)'
                  }}
                >
                  <ListItemText
                    primary={sensor.model === 'HF_PLUS' ? 'HF+' : sensor.model}
                    secondary={`ID: ${sensor.id}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
