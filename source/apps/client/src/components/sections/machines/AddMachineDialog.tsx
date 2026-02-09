import { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';
import { createMachine, updateMachine, Machine, MonitoringPoint } from 'store/slices/machinesSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import IconifyIcon from 'components/base/IconifyIcon';
import Box from '@mui/material/Box';

interface AddMachineDialogProps {
  open: boolean;
  onClose: () => void;
  machine?: Machine | null;
}

const SENSOR_MODELS = ['HF_Plus', 'TcAg', 'TcAs'];

const AddMachineDialog = ({ open, onClose, machine }: AddMachineDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [type, setType] = useState<'Fan' | 'Pump'>('Fan');
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(machine);

  useEffect(() => {
    if (open) {
      if (machine) {
        setName(machine.name);
        setType(machine.type as 'Fan' | 'Pump');
        setMonitoringPoints(machine.monitoringPoints.length > 0 
          ? machine.monitoringPoints.map(mp => ({
              id: mp.id,
              name: mp.name,
              sensor: mp.sensor ? { model: mp.sensor.model } : { model: 'HF_Plus' }
            }))
          : [{ name: '', sensor: { model: 'HF_Plus' } }, { name: '', sensor: { model: 'HF_Plus' } }]
        );
      } else {
        setName('');
        setType('Fan');
        setMonitoringPoints([
          { name: '', sensor: { id: '', model: 'HF_Plus' } },
          { name: '', sensor: { id: '', model: 'HF_Plus' } }
        ]);
      }
      setError(null);
    }
  }, [open, machine]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    const newType = e.target.value as 'Fan' | 'Pump';
    setType(newType);
    
    // Business rule: If type is Pump, reset invalid sensors
    if (newType === 'Pump') {
      setMonitoringPoints(prev => prev.map(mp => {
        if (mp.sensor && (mp.sensor.model === 'TcAg' || mp.sensor.model === 'TcAs')) {
          return { ...mp, sensor: { ...mp.sensor, model: 'HF_Plus' } };
        }
        return mp;
      }));
    }
  };

  const handleAddSensor = () => {
    setMonitoringPoints([...monitoringPoints, { name: '', sensor: { model: 'HF_Plus' } }]);
  };

  const handleRemoveSensor = (index: number) => {
    if (monitoringPoints.length <= 2) return;
    const newList = [...monitoringPoints];
    newList.splice(index, 1);
    setMonitoringPoints(newList);
  };

  const handleMPChange = (index: number, field: 'name' | 'sensorModel', value: string) => {
    const newList = [...monitoringPoints];
    const item = { ...newList[index] };

    if (field === 'name') {
      item.name = value;
    } else if (field === 'sensorModel') {
      item.sensor = { ...item.sensor!, model: value };
    }

    newList[index] = item;
    setMonitoringPoints(newList);
  };

  const validate = () => {
    if (!name.trim()) return "Machine name is required";
    if (monitoringPoints.some(mp => !mp.name.trim())) return "All monitoring points must have a name";
    if (type === 'Pump' && monitoringPoints.some(mp => mp.sensor?.model !== 'HF_Plus')) {
      return "Pump machines can only use HF+ sensors";
    }
    return null;
  };

  const handleAddOrUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        name,
        type,
        monitoringPoints
      };

      if (isEdit && machine) {
        await dispatch(updateMachine({ id: machine.id, data: payload })).unwrap();
      } else {
        await dispatch(createMachine(payload)).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEdit ? 'update' : 'create'} machine.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    onClose();
  };

  const isFormValid = name.trim() !== '' && monitoringPoints.length >= 2 && monitoringPoints.every(mp => mp.name.trim() !== '');

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
        {isEdit ? 'Update machine' : 'Add machine'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4} sx={{ mt: 0 }}>
          {/* Left Column: Machine Details */}
          <Grid item xs={12} md={5}>
            <Stack direction="column" spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Boiler Cooling Fan"
                  disabled={isLoading}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Type
                </Typography>
                <FormControl fullWidth variant="filled" disabled={isLoading}>
                  <Select
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <MenuItem value="Fan">Fan</MenuItem>
                    <MenuItem value="Pump">Pump</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Grid>

          {/* Right Column: Sensors / Monitoring Points */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Monitoring Points
            </Typography>
            <Stack direction="column" spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
              {monitoringPoints.map((mp, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.disabled" sx={{ minWidth: 25 }}>
                    {mp.id ? `ID${mp.id}` : 'NEW'}
                  </Typography>
                  <TextField
                    
                    variant="filled"
                    placeholder="BCF_S1"
                    value={mp.name}
                    onChange={(e) => handleMPChange(index, 'name', e.target.value)}
                    sx={{ flex: 2 }}
                    disabled={isLoading}
                  />
                  
                  <FormControl variant="filled"  sx={{ flex: 1.5 }} disabled={isLoading}>
                    <Select
                      value={mp.sensor?.model || 'HF_Plus'}
                      onChange={(e) => handleMPChange(index, 'sensorModel', e.target.value)}
                    >
                      {SENSOR_MODELS.map(model => (
                        <MenuItem 
                          key={model} 
                          value={model}
                          disabled={type === 'Pump' && (model === 'TcAg' || model === 'TcAs')}
                        >
                          {model === 'HF_Plus' ? 'HF+' : model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {monitoringPoints.length > 2 && (
                    <IconButton 
                       
                      onClick={() => handleRemoveSensor(index)}
                      disabled={isLoading}
                      color="error"
                    >
                      <IconifyIcon icon="ic:baseline-remove-circle-outline" />
                    </IconButton>
                  )}
                </Stack>
              ))}
              
              <Button
                variant="text"
                startIcon={<IconifyIcon icon="ic:baseline-plus" />}
                onClick={handleAddSensor}
                disabled={isLoading}
                sx={{ 
                  alignSelf: 'flex-end', 
                  color: 'text.primary',
                  bgcolor: 'neutral.200',
                  '&:hover': { bgcolor: 'neutral.300' },
                  px: 2,
                  py: 1,
                  borderRadius: 2
                }}
              >
                Add sensor
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4, pt: 2, justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={handleCancel} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddOrUpdate}
          variant="contained"
          disabled={!isFormValid || isLoading}
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMachineDialog;
