"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Iconify from "../../components/Iconify/Iconify";

import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/FormProvider/FormProvider";
import MainTextField from "../../components/TextField/TextField";
import { Theme, useMediaQuery } from "@mui/material";
import {
  AuthCredentials,
  login,
} from "@/app/services/Authentication/AuthService";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("This field is required")
    .email("Please enter a valid email address"),
  password: Yup.string().required("This field is required"),
});

export default function Login() {
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
      let post = await login(credentials);
      post.status == 201 && router.push("/routes/home");
    } catch (error) {
      console.error("Error in login", error);
    } finally {
      setLoading(false);
    }
  };

  const submitOnEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          onKeyDown={submitOnEnter}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "60vh",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <Iconify icon={"material-symbols:lock"} width={28} height={28} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log-in
          </Typography>
          <Box sx={{ mt: 1, width: "100%" }}>
            <Grid
              sx={{ flexDirection: isXs ? "column" : "row" }}
              container
              spacing={2}
            >
              <Grid item xs={12}>
                <MainTextField
                  fullWidth
                  id="email"
                  requerido
                  name="email"
                  autoComplete="new-password"
                  label="E-mail"
                />
              </Grid>
              <Grid item xs={12}>
                <MainTextField
                  requerido
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <LoadingButton
              color="secondary"
              loading={loading}
              endIcon={<Iconify icon="material-symbols:login" />}
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
                {!loading ? "Entrar" : ""}
              </Typography>
            </LoadingButton>
          </Box>
          <Grid mt={2} container>
            <Grid item xs={12}>
              <Link href="/routes/register" variant="body2">
                Register a new user
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FormProvider>
  );
}
