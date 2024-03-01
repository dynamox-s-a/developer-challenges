import {
  Box,
  Card,
  Button,
  Divider,
  TextField,
  CardHeader,
  CardContent,
  CardActions,
  Unstable_Grid2 as Grid
} from '@mui/material';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { updateUser } from '../../lib/api';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import LoadingContent from '../../components/LoadingContent';
import { setUser as setUserStore } from '../../lib/redux/features/userSlice';
import { UpdateUserDto, updateUserDto } from '@dynamox-challenge/dto';

export const AccountProfileDetails = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email,
      password: '',
      oldPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      oldPassword: Yup
        .string()
        .max(255),
      password: Yup
        .string()
        .max(255)
        .when('oldPassword', (oldPassword, schema: Yup.Schema) => {
          return typeof(oldPassword) === 'string' && (oldPassword as string).length > 0
            ? schema.required('Password is required')
            : schema;
        })
        .min(8, 'The password must be at least 8 characters long')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/,
          'The password must contain at least 1 lowercase letter, 1 uppercase letter and 1 number'
        ),
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        const newUser: UpdateUserDto = {};

        if (values.name && values.name !== '') newUser.name = values.name;
        if (values.email && values.email !== '') newUser.email = values.email;
        if (values.password && values.password !== '') newUser.password = values.password;
        if (values.oldPassword && values.oldPassword !== '') newUser.oldPassword = values.oldPassword;

        const body = updateUserDto.safeParse(newUser);

        if (!body.success) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
          console.log('body.errors: ', body.error);
          return;
        }
        const userUpdated = await updateUser((user as User).id, body.data);
        if ('id' in userUpdated) {
          dispatch(setUserStore(userUpdated));
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  });

  if (loading) {
    return <LoadingContent />;
  }

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.oldPassword && formik.errors.oldPassword)}
                  fullWidth
                  helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                  label="Old Password"
                  name="oldPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.oldPassword}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="New Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type='submit'>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
