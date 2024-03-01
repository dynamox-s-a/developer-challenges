import {
  Box,
  Card,
  Modal,
  Select,
  Button,
  Divider,
  MenuItem,
  CardMedia,
  InputLabel,
  CardHeader,
  CardContent,
  CardActions,
  FormControl,
  CircularProgress,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Sensor } from '@prisma/client';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { updateSensor, getSensors } from '../../lib/api';
import { UpdateSensorDto, updateSensorDto } from '@dynamox-challenge/dto';
import { selectSensor, removeSensor } from '../../lib/redux/features/sensorsSlice';

import sensorAf from '../../../public/assets/dynamox/sensor-af.png';
import sensorHf from '../../../public/assets/dynamox/sensor-hf.png';
import sensorTca from '../../../public/assets/dynamox/sensor-tca.png';

const sensorsImg = {
  'TcAg': sensorAf.src,
  'TcAs': sensorHf.src,
  'HF+': sensorTca.src
};

export const EditSensorModal = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.user);
  const { status: sensorStatus, sensorSelected, openEditModal } = useAppSelector(state => state.sensors);

  const formik = useFormik({
    initialValues: {
      model: sensorSelected?.model || 'TcAg',
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      type: Yup
        .string()
        .max(255)
        .oneOf(['TcAg', 'TcAs', 'HF+'])
        .required('Type is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newSensor: UpdateSensorDto = {
          ...values
        };

        const body = updateSensorDto.safeParse(newSensor);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        dispatch(
          updateSensor({
            sensorId: (sensorSelected as Sensor).id,
            body: body.data,
            accessToken: accessToken as string
          })
        );
        dispatch(selectSensor(null));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
      }
    }
  });

  useEffect(() => {
    if (accessToken === null) return;
    dispatch(getSensors({ accessToken: accessToken as string }));
  }, [dispatch, accessToken]);


  return (
    <Modal
        open={openEditModal}
        onClose={() => dispatch(selectSensor(null))}
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
              title="Edit the sensor"
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
                    <FormControl fullWidth>
                      <InputLabel variant='filled' htmlFor="model">Model</InputLabel>
                      <Select
                        error={!!(formik.touched.model && formik.errors.model)}
                        fullWidth
                        label="Model"
                        // name="model"
                        inputProps={{
                          name: 'model',
                          id: 'model',
                        }}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.model}
                        required
                      >
                        <MenuItem value="TcAg" selected>TcAg</MenuItem>
                        <MenuItem value="TcAs">TcAs</MenuItem>
                        <MenuItem value="HF+">HF+</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={12}
                    flex={1}
                    // md={6}
                  >
                    <Card>
                      {sensorsImg[formik.values.model as 'TcAg' | 'TcAs' | 'HF+']
                        && <CardMedia
                        component="img"
                        sx={{ objectFit: 'cover', width: '150px', height: 'auto', margin: 'auto' }}
                        image={sensorsImg[formik.values.model as 'TcAg' | 'TcAs' | 'HF+']}
                        alt={formik.values.model as 'TcAg' | 'TcAs' | 'HF+'}
                      />}
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                disabled={sensorStatus === 'loading'}
                onClick={() => {
                  dispatch(removeSensor((sensorSelected as Sensor).id));
                  dispatch(selectSensor(null));
                }}
              >
                Remove Sensor {' '} { sensorStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
              <Button variant="contained" type='submit' disabled={sensorStatus === 'loading'}>
                Update Sensor {' '} { sensorStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
            </CardActions>
          </Card>
        </form>
      </Modal>
  );
};
