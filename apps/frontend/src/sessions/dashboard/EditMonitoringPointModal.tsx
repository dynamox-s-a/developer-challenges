import {
  Box,
  Card,
  Select,
  Button,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  CardHeader,
  CardContent,
  CardActions,
  FormControl,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Modal
} from '@mui/material';
import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import { MonitoringPoint } from '@prisma/client';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { updateMonitoringPoint, getMachines, getSensors, getMonitoringPoints } from '../../lib/api';
import { UpdateMonitoringPointDto, updateMonitoringPointDto } from '@dynamox-challenge/dto';
import { selectMonitoringPoint, removeMonitoringPoint } from '../../lib/redux/features/monitoringPointsSlice';

export const EditMonitoringPointModal = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.user);
  const { status: sensorStatus, data: sensors } = useAppSelector(state => state.sensors);
  const { status: machineStatus, data: machines } = useAppSelector(state => state.machines);
  const {
    status: mPStatus,
    data: monitoringPoints,
    openEditModal,
    monitoringPointSelected
  } = useAppSelector(state => state.monitoringPoints);

  const formik = useFormik({
    initialValues: {
      name: monitoringPointSelected?.name || '',
      machineId: monitoringPointSelected?.sensorId || 0,
      sensorId: monitoringPointSelected?.sensorId || 0,
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      machineId: Yup
        .number()
        .required('Machine is required'),
      sensorId: Yup
        .number()
        .required('Type is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newMonitoringPoint: UpdateMonitoringPointDto = {
          ...values
        };

        const body = updateMonitoringPointDto.safeParse(newMonitoringPoint);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        dispatch(updateMonitoringPoint({
          monitoringPointsId: (monitoringPointSelected as MonitoringPoint).id,
          body: body.data,
          accessToken: accessToken as string
        }));
        formik.resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
      }
    }
  });

  const getSensorOptions = useCallback(() => {
    const currentMachine = machines.find((machine) => machine.id === formik.values.machineId);
    if (sensorStatus === 'loading') {
      return <MenuItem value={0} disabled selected>Loading sensors...</MenuItem>;
    } else if (sensorStatus === 'error') {
      return <MenuItem value={0} disabled selected>Error loading sensors</MenuItem>;
    } else if (sensorStatus === 'ready') {
      if (monitoringPoints.length > 0 && sensors.length > 0) {
        return sensors
          .filter((sensor) => {
            if (currentMachine && currentMachine.type === 'Pump') {
              return sensor.model === 'HF+'
            } else if (currentMachine && currentMachine.type === 'Fan') {
              return sensor.model !== 'HF+'
            } else {
              return true;
            }
          })
          .map((sensor) => (
            <MenuItem key={sensor.id} value={sensor.id}>
              {sensor.id} - {sensor.model}
            </MenuItem>
          ));
      } else if (sensors.length > 0) {
        return sensors
          .filter((sensor) => {
            if (currentMachine && currentMachine.type === 'Pump') {
              return sensor.model === 'HF+'
            } else if (currentMachine && currentMachine.type === 'Fan') {
              return sensor.model !== 'HF+'
            } else {
              return true;
            }
          })
          .filter((sensor) => {
            return !monitoringPoints.some((mP) => mP.sensorId === sensor.id);
          })
          .map((sensor) => (
            <MenuItem key={sensor.id} value={sensor.id}>
              {sensor.id} - {sensor.model}
            </MenuItem>
          ));
      }
    }
  }, [sensorStatus, sensors, monitoringPoints, machines, formik.values.machineId]);

  const getMachineOptions = useCallback(() => {
    if (machineStatus === 'loading') {
      return <MenuItem value={0} disabled selected>Loading machines...</MenuItem>;
    } else if (machineStatus === 'error') {
      return <MenuItem value={0} disabled selected>Error loading machines</MenuItem>;
    } else if (machineStatus === 'ready') {
      if (monitoringPoints.length > 0 && machines.length > 0) {
        return machines
          .filter((machine) => {
            return !monitoringPoints.some((mP) => mP.machineId === machine.id);
          })
          .map((machine) => (
            <MenuItem key={machine.id} value={machine.id}>
              {machine.type} - {machine.name}
            </MenuItem>
          ));
      } else if (machines.length > 0) {
        return machines.map((machine) => (
          <MenuItem key={machine.id} value={machine.id}>
            {machine.type} - {machine.name}
          </MenuItem>
        ));
      } else {
        return <MenuItem value={0} disabled selected>No machines available</MenuItem>;
      }
    }
  }, [machineStatus, machines, monitoringPoints]);

  const updateData = useCallback(() => {
    if (accessToken === null) return;
    dispatch(getSensors({ accessToken: accessToken as string }));
    dispatch(getMachines({ accessToken: accessToken as string }));
    dispatch(getMonitoringPoints({ accessToken: accessToken as string }));
  }, [dispatch, accessToken]);

  useEffect(() => {
    updateData()
  }, [updateData]);


  return (
    <Modal
        open={openEditModal}
        onClose={() => dispatch(selectMonitoringPoint(null))}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '80%',
          margin: 'auto'
        }}
      >
        <form
          autoComplete="off"
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Edit the monitoring point"
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    // md={6}
                  >
                    <TextField
                      error={!!(formik.touched.name && formik.errors.name)}
                      fullWidth
                      helperText={formik.touched.name && formik.errors.name}
                      label="Name"
                      name="name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.name}
                      variant="filled"
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    // md={6}
                  >
                    <FormControl fullWidth>
                      <InputLabel variant='filled' htmlFor="machineId">Machine</InputLabel>
                      <Select
                        error={!!(formik.touched.machineId && formik.errors.machineId)}
                        fullWidth
                        label="Machine"
                        inputProps={{
                          name: 'machineId',
                          id: 'machineId',
                        }}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.machineId}
                        required
                      >
                        {getMachineOptions()}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={12}
                    // md={6}
                  >
                    <FormControl fullWidth>
                      <InputLabel variant='filled' htmlFor="sensorId">Sensor</InputLabel>
                      <Select
                        error={!!(formik.touched.sensorId && formik.errors.sensorId)}
                        fullWidth
                        label="Sensor"
                        inputProps={{
                          name: 'sensorId',
                          id: 'sensorId',
                        }}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.sensorId}
                        required
                      >
                        {getSensorOptions()}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                disabled={mPStatus === 'loading'}
                onClick={() => {
                  dispatch(removeMonitoringPoint((selectMonitoringPoint as unknown as MonitoringPoint).id))
                  dispatch(selectMonitoringPoint(null))
                }}
              >
                Remove Monitoring Point {' '} { mPStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
              <Button variant="contained" type='submit' disabled={mPStatus === 'loading'}>
                Add Monitoring Point {' '} { mPStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
            </CardActions>
          </Card>
        </form>
      </Modal>
  );
};
