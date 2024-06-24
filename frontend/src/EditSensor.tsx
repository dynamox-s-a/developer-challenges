import { useLocation, useNavigate } from 'react-router-dom';
import { MACHINE_TYPES, SENSOR_MAP } from './constants';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  useGetMachinesQuery,
  useGetSensorsByMachineIdQuery,
  useUpdateSensorByIdMutation,
} from './features/monitor/monitorSlice';
import useAuth from './useAuth';

export default function EditSensor() {
  const n = useNavigate();
  const l = useLocation();

  const machineId = l.pathname.split('/')[2];
  const sensorId = l.pathname.split('/')[3];

  const authContext = useAuth();
  const { data: machineData, isLoading } = useGetMachinesQuery(
    authContext!.user.id
  );
  const { data: sensorData, refetch: refetchSensors } =
    useGetSensorsByMachineIdQuery(machineId);

  const [updateSensor] = useUpdateSensorByIdMutation();

  const machine = machineData?.find((m) => m.id == machineId);
  const sensor = sensorData?.find((s) => s.id == sensorId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    updateSensor({
      id: sensorId,
      name: `${d.get('name')}`,
      type: `${d.get('type')}`,
    })
      .unwrap()
      .then(() => {
        refetchSensors().then(() => n(`/sensors/${machineId}`));
      })
      .catch((error: Error) => {
        alert('Error: try update later');
        console.log('Error: ', error);
      });
  };

  const sensorOptions =
    SENSOR_MAP[MACHINE_TYPES.indexOf(`${machine?.type}`)] || [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: '2rem',
      }}
    >
      <Typography component="h1" variant="h5">
        Edit Sensor
      </Typography>

      <Typography>
        Machine: {machine?.name} | Type: {machine?.type}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem 0',
          alignSelf: 'stretch',
        }}
      >
        <FormControl fullWidth>
          <TextField
            name="name"
            label="New sensor name"
            fullWidth
            autoFocus
            defaultValue={`${sensor?.name}`}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sslId">Type</InputLabel>
          <Select
            name="type"
            labelId="sslId"
            label="Type"
            defaultValue={sensor?.type}
            required
          >
            {sensorOptions.map((i: string | number, k: number) => (
              <MenuItem key={k} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="outlined" sx={{ m: '2rem 0' }} fullWidth>
          Save
        </Button>
      </Box>
    </Box>
  );
}
