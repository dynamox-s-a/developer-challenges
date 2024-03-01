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
  Unstable_Grid2 as Grid
} from '@mui/material';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { createMachine, getMachines } from '../../lib/api';
import { CreateMachineDto, createMachineDto } from '@dynamox-challenge/dto';

export const AddMachineForm = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.user);
  const machineStatus = useAppSelector(state => state.machines.status);

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'Pump',
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      type: Yup
        .string()
        .max(255)
        .oneOf(['Pump', 'Fan'])
        .required('Type is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newMachine: CreateMachineDto = {
          ...values
        };

        const body = createMachineDto.safeParse(newMachine);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        dispatch(createMachine({ body: body.data, accessToken: accessToken as string }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
      }
    }
  });

  useEffect(() => {
    if (accessToken === null) return;
    dispatch(getMachines({ accessToken: accessToken as string }));
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
          title="Add a new machine"
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
                  <InputLabel variant='filled' htmlFor="type">Type</InputLabel>
                  <Select
                    error={!!(formik.touched.type && formik.errors.type)}
                    fullWidth
                    label="Type"
                    inputProps={{
                      name: 'type',
                      id: 'type',
                    }}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.type}
                    required
                  >
                    <MenuItem value="Pump" selected>Pump</MenuItem>
                    <MenuItem value="Fan">Fan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type='submit' disabled={machineStatus === 'loading'}>
            Add Machine {' '} { machineStatus === 'loading' && <CircularProgress size={13} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
