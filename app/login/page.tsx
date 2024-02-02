"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useFormik } from "formik";
import { default as NextLink } from "next/link";
import * as Yup from "yup";
import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Login() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") redirect("/dashboard");

  const formik = useFormik({
    initialValues: {
      email: "gustavo@teste.com",
      password: "12345",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      const signInStatus = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      setLoading(false);
      if (!signInStatus?.ok) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Please check your email and password" });
        helpers.setSubmitting(false);
        return;
      }
    },
  });

  if (status === "loading" || loading) return "Loading.........";

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an acmachine? &nbsp;
                <Link component={NextLink} href="/register" underline="hover" variant="subtitle2">
                  Register
                </Link>
              </Typography>
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
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
              <Alert severity="info" sx={{ mt: 3 }}>
                <div>
                  You can use <b>gustavo@teste.com</b> and password <b>12345</b> to log in if you
                  don&apos;t want to register a new user.
                </div>
              </Alert>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
}
