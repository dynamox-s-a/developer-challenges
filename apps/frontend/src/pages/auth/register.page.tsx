import * as Yup from 'yup';
import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { createUser } from '../../services/api';
import AuthLayout from '../../layouts/auth/Layout';
import { useSession, signIn } from "next-auth/react";
import LoadingContent from '../../components/LoadingContent';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

const Page = () => {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") router.push("/");

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      submit: null
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
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        const user = await createUser({ ...values });
        if (user && Object.prototype.hasOwnProperty.call(user, 'id')) {
          await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        setLoading(false);
      }
    }
  });

  if (status === "loading" || loading) {
    return <LoadingContent />;
  }

  return (
    <>
      <Head>
        <title>
          Register | Dynamox
        </title>
      </Head>
      {status === "unauthenticated" && (

        <Box
          sx={{
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
                  Register
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Already have an account?
                  &nbsp;
                  <Link
                    component={NextLink}
                    href="/auth/login"
                    underline="hover"
                    variant="subtitle2"
                  >
                    Log in
                  </Link>
                </Typography>
              </Stack>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Name"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
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
              </form>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

Page.getLayout = (page: ReactNode) => (
  <AuthLayout subtitle='A melhor solução de manutenção preditiva'>
    {page}
  </AuthLayout>
);

export default Page;
