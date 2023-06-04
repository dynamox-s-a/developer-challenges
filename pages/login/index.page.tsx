import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { signIn } from "lib/auth/auth";
import { loginResultMsg } from "lib/utils/post/post-result";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [error, setError] = React.useState<string | null>(null);

  const login = async function (
    email: string,
    password: string
  ): Promise<string> {
    const loginRoute = "/api/login";

    const response = await fetch(loginRoute, {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => null);

    if (!response) {
      return loginResultMsg.FETCH_ERROR;
    } else if (response.status === 401) {
      return loginResultMsg.BAD_CREDENTIALS;
    } else if (response.status !== 200) {
      return loginResultMsg.UNKNOW_ERROR;
    }

    const loginResponse = await response.json().catch(() => null);
    const session = signIn(loginResponse);
    if (!!session) {
      window.location.reload();
      return loginResultMsg.SUCCESS;
    }

    return loginResultMsg.BAD_RESPONSE;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      setError("Insira todas as informações necessárias para efetuar o login");
      return;
    }
    const response = await login(email, password);
    if (response != loginResultMsg.SUCCESS) setError(response);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            data-testid="form"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              inputProps={{ "data-testid": "email-input" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputProps={{ "data-testid": "password-input" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-testid="submit-button"
            >
              Sign In
            </Button>
            {error && (
              <Alert severity="error" data-testid="alert-error">
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
