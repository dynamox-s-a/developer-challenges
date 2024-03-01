import {
  Box,
  Link,
  Stack,
  Alert,
  Button,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import * as Yup from 'yup';
import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import AuthLayout from '../../layouts/auth/Layout';
import { signIn, useSession } from "next-auth/react";
import LoadingContent from '../../components/LoadingContent';

const Page = () => {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") router.push("/");

  const formik = useFormik({
    initialValues: {
      email: 'dynamox@leonardojacomussi.com',
      password: 'W3lc@me!',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err?.message });
        helpers.setSubmitting(false);
      } finally {
        setLoading(false);
      }
      return;
    }
  });

  useEffect(() => {
    console.log('status', status);
  }, [status]);

  if (status === "loading" || loading) {
    return <LoadingContent />;
  }

  return (
    <>
      <Head>
        <title>
          Login | Dynamox
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
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
                <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </Button>
                <Alert
                  // color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>{formik.initialValues.email}</b> and password <b>{formik.initialValues.password}</b>
                  </div>
                </Alert>
              </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => (
  <AuthLayout subtitle='A melhor solução de manutenção preditiva'>
    {page}
  </AuthLayout>
);

export default Page;
