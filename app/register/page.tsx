"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") redirect("/dashboard");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().min(5).max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setLoading(true);
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
        const data = await res.json();

        if (res.status !== 200) throw new Error(data.message);

        const signInStatus = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        setLoading(false);

        if (!signInStatus?.ok) {
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit: "An error as occurred, please try to login again.",
          });
          helpers.setSubmitting(false);
          return;
        }
      } catch (error) {
        setLoading(false);
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        helpers.setStatus({ success: false });
        helpers.setErrors({
          submit: message,
        });
        helpers.setSubmitting(false);
        return;
      }
    },
  });

  if (status === "loading" || loading) return "Loading.........";

  return (
    <>
      <Head>
        <title>Register</title>
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Login
                </Link>
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
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
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
}
