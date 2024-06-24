import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  useCreateSensorMutation,
  useGetMachinesQuery,
  useGetSensorsByMachineIdQuery,
} from './features/monitor/monitorSlice';
import useAuth from './useAuth';

export default function CreateSensor() {
  const location = useLocation();
  const n = useNavigate();
  const machineId = location.pathname.split('/')[2];
  const authContext = useAuth();
  const { data: machineData, isLoading } = useGetMachinesQuery(
    authContext!.user.id
  );
  const { refetch: refetchSensors } = useGetSensorsByMachineIdQuery(machineId);
  const [createSensor] = useCreateSensorMutation();

  const machine = machineData?.find((m) => m.id == machineId);

  // if machine id not exist
  if (!isLoading && !machine) {
    alert('Machine not found. Returning to Machine list.');
    return <Navigate to="/machines" />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    createSensor({
      machineId,
      name: `${d.get('name')}`,
      type: `${d.get('type')}`,
    })
      .unwrap()
      .then(() => {
        n(`/sensors/${machineId}`);
        refetchSensors();
      })
      .catch((error: Error) => {
        alert('Error: try again later');
        console.log('Error: ', error);
      });
  };

  const sensorOptions =
    SENSOR_MAP[MACHINE_TYPES.indexOf(`${machine?.type}`)] || [];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h5">
        Create Sensor
      </Typography>

      <Typography>
        Machine: {machine?.name} | {machine?.type}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem 0',
          alignSelf: 'stretch',
        }}
      >
        <FormControl fullWidth>
          <TextField
            name="name"
            label="New sensor name"
            required
            fullWidth
            autoFocus
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sslId">Type</InputLabel>
          <Select
            name="type"
            labelId="sslId"
            label="Type"
            defaultValue={sensorOptions[0]}
            required
          >
            {sensorOptions.map((i: string | number, k: number) => (
              <MenuItem key={k} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="outlined" sx={{ m: '2rem 0' }}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

export type newSensorParams = { machineId: string; name: string; type: string };
