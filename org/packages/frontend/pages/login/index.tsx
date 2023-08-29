'use strict';
import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from 'store/features/user-slice';
import { useAppDispatch, useAppSelector } from 'store/store';
import Button from 'components/button';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoading = useAppSelector((state) => state.loading.loginUser);
  const error = useAppSelector((state) => state.error.loginUser);
  const user = useAppSelector((state) => state.user.user);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup.string().max(255).required('Password is required'),
    }),
    onSubmit: (values) => {
      const payload = { email: values.email, password: values.password };

      dispatch(loginUser(payload));
    },
  });

  useEffect(() => {
    if (user.accessToken) {
      // TODO: Update to Redirect
      router.push('/');
    }
  }, [router, user.accessToken]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%',
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                isLoading={isLoading}
              >
                Continue
              </Button>

              {!!error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  <div>{error}</div>
                </Alert>
              )}
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Page;
