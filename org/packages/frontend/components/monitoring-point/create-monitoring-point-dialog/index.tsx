import { useState, useCallback, useEffect } from 'react';
import Button from 'components/button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/store';
import { createMonitoringPoint } from 'store/features/monitoring-points-slice';
import {
  SENSOR_MODEL_OPTIONS,
  MachineType,
  SensorModel,
} from 'utils/constants';
import usePrevious from 'hooks/use-previous';

type CreateMonitoringPointDialogTypes = {
  handleClose: () => void;
  machineId: number | string;
  machineType: MachineType;
};

const CreateMonitoringPointDialog = ({
  handleClose,
  machineId,
  machineType,
}: CreateMonitoringPointDialogTypes) => {
  const dispatch = useAppDispatch();
  const createMonitoringPointError = useAppSelector(
    (state) => state.error.createMonitoringPoint
  );
  const isLoading = useAppSelector(
    (state) => state.loading.createMonitoringPoint
  );
  const wasLoading = usePrevious(isLoading);

  const [name, setName] = useState('');
  const [sensorModel, setSensorModel] = useState('');
  // TODO: Make sensor model automatically HFp if machine type is Pump

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setSensorModel(event.target.value as string);
  }, []);

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value as string);
    },
    []
  );

  const onCreateClick = useCallback(() => {
    const payload = {
      machineId: Number(machineId),
      name,
      sensorModel,
    };

    dispatch(createMonitoringPoint(payload));
  }, [dispatch, machineId, name, sensorModel]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (createMonitoringPointError) {
        // Handle Error
      } else {
        handleClose();
      }
    }
  }, [createMonitoringPointError, handleClose, isLoading, wasLoading]);

  const selectOptions =
    machineType === MachineType.Pump ? [SensorModel.HFp] : SENSOR_MODEL_OPTIONS;
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Create monitoring point</DialogTitle>
      <DialogContent sx={{ width: '400px' }}>
        <Box
          sx={{
            padding: '12px 0',
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
            value={name}
            onChange={onChangeName}
            variant="outlined"
          />
        </Box>
        <FormControl fullWidth>
          <InputLabel id="sensor-select-label">Sensor Model</InputLabel>
          <Select
            labelId="sensor-select-label"
            id="sensor-select"
            value={sensorModel}
            label="Sensor Model"
            onChange={handleChange}
          >
            {selectOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onCreateClick}
          isLoading={isLoading}
          loadingSize={16}
          disabled={!name || !sensorModel}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMonitoringPointDialog;
