import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuthContext } from '../../login/providers/auth-provider';
import getAllMachines from '../../machine/actions';
import { MachineType } from '../../machine/types/machine-type';
import getAllSensors from '../../sensor/actions';
import { SensorType } from '../../sensor/types/sensor-type';
import { createMonitoringPoint } from '../actions';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MonitoringPointFormProps {}
const MonitoringPointsCreationForm: React.FC<MonitoringPointFormProps> = (
  params
) => {
  const getMachineList = {
    queryFn: () => getAllMachines({ page: 1, size: 5 }),
    queryKey: ['Machines'],
  };

  const getSensorList = {
    queryFn: () => getAllSensors({ page: 1, size: 5 }),
    queryKey: ['Sensors'],
  };

  const { data: sensorData, isFetching: loadingSensors } =
    useQuery(getSensorList);

  const { data: machineData, isFetching: loadingMachines } =
    useQuery(getMachineList);

  const { user } = useAuthContext();
  const [creationResult, setCreationResult] = React.useState('');
  const [state, setState] = React.useState<{
    name: string;
    userId: string | '';
    sensorId: string | '';
    machineId: string | '';
  }>({
    name: '',
    userId: user?.sub || '',
    sensorId: '',
    machineId: '',
  });

  const machineList: MachineType[] =
    !machineData?.data || loadingMachines ? [] : machineData.data;
  const sensorList: SensorType[] =
    !sensorData?.data || loadingSensors ? [] : sensorData.data;

  const { mutate, isPending } = useMutation({
    mutationFn: createMonitoringPoint,
    onSuccess: () => {
      setCreationResult('Ponto de monitoramento criado com sucesso.');
      setTimeout(() => {
        setCreationResult('');
        setState({
          name: '',
          userId: user?.sub || '',
          sensorId: '',
          machineId: '',
        });
      }, 5000);
    },
    onError: (error) => console.log(error),
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      name: event.target.value,
    });
  };

  const handleSensorIdChange = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      sensorId: event.target.value,
    });
  };

  const handleMachineIdChange = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      machineId: event.target.value,
    });
  };

  const createMonitoringPointTrigger = () => {
    const machine = machineList.filter(
      (machine) => machine._id === state.machineId
    )[0];
    const userId = state.userId === '' ? user?.sub : state.userId;
    mutate({
      machine,
      point: {
        name: state.name,
        userId,
        sensorId: state.sensorId,
      },
    });
    return;
  };

  const creationBlocked = state.name === '' || state.sensorId === '';

  return (
    <Paper
      sx={{
        maxWidth: 936,
        margin: 'auto',
        overflow: 'hidden',
        width: 800,
        alignItems: 'center',
        padding: 4,
      }}
    >
      <FormControl
        component="form"
        variant="standard"
        onSubmit={(e) => {
          e.preventDefault();
          createMonitoringPointTrigger();
        }}
        sx={{ gap: 6, flexDirection: 'row' }}
      >
        <FormLabel component="legend">Create machine</FormLabel>
        <FormGroup sx={{ gap: 2, flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <TextField
                required
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: 'default',
                    alignSelf: 'flex-start',
                    justifySelf: 'flex-start',
                  },
                }}
                variant="filled"
                onChange={handleNameChange}
              />
            }
            label="name"
            labelPlacement="start"
            sx={{ gap: 1 }}
          />
          <Stack direction={'row'} width={350}>
            <FormControlLabel
              control={
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.machineId}
                  label="Machine"
                  required
                  onChange={handleMachineIdChange}
                  sx={{ width: 100 }}
                >
                  {machineList.map((machine, index) => (
                    <MenuItem key={index} value={machine._id}>
                      {machine.name}
                    </MenuItem>
                  ))}
                </Select>
              }
              label="machine"
              labelPlacement="start"
              sx={{ gap: 1 }}
            />
            <FormControlLabel
              control={
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={state.sensorId}
                  label="Sensor"
                  required
                  onChange={handleSensorIdChange}
                  sx={{ width: 100 }}
                >
                  {sensorList
                    .filter((sensor) => {
                      const machine = machineList.find(
                        (machine) => machine._id === state.machineId
                      );
                      if (machine && machine.type === 'Pump') {
                        return sensor.modelName === 'HF+';
                      }
                      return true;
                    })
                    .map((sensor, index) => (
                      <MenuItem key={index} value={sensor._id}>
                        {sensor.modelName}
                      </MenuItem>
                    ))}
                </Select>
              }
              label="sensor"
              labelPlacement="start"
              sx={{ gap: 1 }}
            />
          </Stack>
        </FormGroup>
        <Button
          type="submit"
          variant="contained"
          disabled={creationBlocked}
          sx={{ mr: 1, width: 200, height: 80, alignSelf: 'center' }}
        >
          Create
        </Button>
      </FormControl>
      <FormHelperText sx={{ textAlign: 'end' }}>
        {creationResult}
      </FormHelperText>
    </Paper>
  );
};

export default MonitoringPointsCreationForm;
