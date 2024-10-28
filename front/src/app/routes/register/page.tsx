"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  useMediaQuery,
} from "@mui/material";
import Iconify from "../../components/Iconify/Iconify";

import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import MainTextField from "../../components/TextField/TextField";
import FormProvider from "../../components/FormProvider/FormProvider";
import MainSelect from "../../components/Select/MainSelect";
import {
  AuthCredentials,
  register,
} from "@/app/services/Authentication/AuthService";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("This field is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("This field is required"),
});

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  let defaultValues = {
    nome: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);
    let credentials: AuthCredentials = {
      email: data.email,
      password: data.password,
    };
    try {
      let post = await register(credentials);
      post.status == 201 && router.push("/routes/login");
    } catch (error) {
      console.error("Error in register", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "60vh",
            justifyContent: "center",
            direction: "column",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <Iconify icon={"mdi:register"} width={28} height={28} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register User
          </Typography>
          <Box sx={{ mt: 1, width: "100%" }}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: isXs ? "column" : "row",
              }}
              xs={12}
              container
              spacing={2}
            >
              <Grid item xs={12} xl={12}>
                <MainTextField
                  required
                  fullWidth
                  requerido
                  id="email"
                  name="email"
                  autoComplete="new-password"
                  label="E-mail"
                  sx={{ mb: 2 }}
                />
                <MainTextField
                  required
                  fullWidth
                  requerido
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  label="Password"
                  sx={{ mb: 2 }}
                />
                <MainTextField
                  required
                  fullWidth
                  requerido
                  id="confirm_password"
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  label="Password Confirmation"
                />
              </Grid>
              <Grid item xs={12} xl={12}>
                <LoadingButton
                  color="secondary"
                  loading={loading}
                  endIcon={<Iconify icon="mdi:register" />}
                  loadingPosition="start"
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{ minHeight: 32 }}
                >
                  <Typography
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: "Roboto,system-ui",
                    }}
                  >
                    {!loading ? "Register" : ""}
                  </Typography>
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </FormProvider>
  );
}
