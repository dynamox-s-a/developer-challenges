import {
  Box,
  Card,
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
  Unstable_Grid2 as Grid
} from '@mui/material';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { createSensor, getSensors } from '../../lib/api';
import { CreateSensorDto, createSensorDto } from '@dynamox-challenge/dto';
// import { addSensor, updateSensor, removeSensor } from '../../lib/redux/features/sensorsSlice';
import sensorAf from '../../../public/assets/dynamox/sensor-af.png';
import sensorHf from '../../../public/assets/dynamox/sensor-hf.png';
import sensorTca from '../../../public/assets/dynamox/sensor-tca.png';

const sensorsImg = {
  'TcAg': sensorAf.src,
  'TcAs': sensorHf.src,
  'HF+': sensorTca.src
};

export const AddSensorForm = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.user);
  const sensorStatus = useAppSelector(state => state.sensors.status);

  const formik = useFormik({
    initialValues: {
      model: 'TcAg',
    },
    validationSchema: Yup.object({
      model: Yup
        .string()
        .max(255)
        .oneOf(['TcAg', 'TcAs', 'HF+'])
        .required('Model is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newSensor: CreateSensorDto = {
          ...values
        };

        const body = createSensorDto.safeParse(newSensor);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        dispatch(createSensor({ body: body.data, accessToken: accessToken as string }));
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
    <form
      autoComplete="off"
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Add a new sensor"
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
                    height="auto"
                    width={100}
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
          <Button variant="contained" type='submit' disabled={sensorStatus === 'loading'}>
            Add Sensor {' '} { sensorStatus === 'loading' && <CircularProgress size={13} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
