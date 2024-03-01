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
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Machine } from '@prisma/client';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { updateMachine, getMachines } from '../../lib/api';
import { UpdateMachineDto, updateMachineDto } from '@dynamox-challenge/dto';
import { selectMachine, removeMachine } from '../../lib/redux/features/machinesSlice';

export const EditMachineModal = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.user);
  const { status: machineStatus, machineSelected, openEditModal } = useAppSelector(state => state.machines);

  const formik = useFormik({
    initialValues: {
      name: machineSelected?.name || '',
      type: machineSelected?.type || 'Pump',
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
        const newMachine: UpdateMachineDto = {
          ...values
        };

        const body = updateMachineDto.safeParse(newMachine);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        dispatch(
          updateMachine({
            machineId: (machineSelected as Machine).id,
            body: body.data,
            accessToken: accessToken as string
          })
        );
        dispatch(selectMachine(null));
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
    <Modal
        open={openEditModal}
        onClose={() => dispatch(selectMachine(null))}
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
              title="Edit machine"
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
              <Button
                variant="outlined"
                disabled={machineStatus === 'loading'}
                onClick={() => {
                  dispatch(removeMachine((machineSelected as Machine).id));
                  dispatch(selectMachine(null));
                }}
              >
                Delete Machine {' '} { machineStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
              <Button variant="contained" type='submit' disabled={machineStatus === 'loading'}>
                Update Machine {' '} { machineStatus === 'loading' && <CircularProgress size={13} />}
              </Button>
            </CardActions>
          </Card>
        </form>
      </Modal>
  );
};
