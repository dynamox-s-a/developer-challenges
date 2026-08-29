import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAuthError, login, register } from "./authSlice";

interface LoginLocationState {
  from?: string;
}

type AuthMode = "sign-in" | "register";

const copy = {
  "sign-in": {
    title: "Sign in to DynaMonitor",
    submit: "Sign in",
    togglePrompt: "Don't have an account?",
    toggleAction: "Create one",
  },
  register: {
    title: "Create your DynaMonitor account",
    submit: "Create account",
    togglePrompt: "Already have an account?",
    toggleAction: "Sign in",
  },
} as const;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSubmitting = status === "submitting";
  const isRegistering = mode === "register";
  const passwordTooShort = isRegistering && password.length > 0 && password.length < 8;

  useEffect(() => {
    if (status === "authenticated") {
      const state = location.state as LoginLocationState | null;
      navigate(state?.from ?? "/machines", { replace: true });
    }
  }, [location.state, navigate, status]);

  function handleToggleMode() {
    dispatch(clearAuthError());
    setMode(isRegistering ? "sign-in" : "register");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const credentials = { email: email.trim(), password };
    void dispatch(isRegistering ? register(credentials) : login(credentials));
  }

  return (
    <Box
      alignItems="center"
      display="flex"
      minHeight="100vh"
      py={4}
      sx={{
        background: "linear-gradient(145deg, #e8f0f2 0%, #f5f7f8 55%, #fcefe7 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Card elevation={4}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Box textAlign="center">
                <Typography component="h1" variant="h5">
                  {copy[mode].title}
                </Typography>
                <Typography color="text.secondary" mt={0.5} variant="body2">
                  Manage machines, sensors, and vibration series.
                </Typography>
              </Box>
              {error ? (
                <Alert onClose={() => dispatch(clearAuthError())} severity="error">
                  {error}
                </Alert>
              ) : null}
              <Box component="form" noValidate onSubmit={handleSubmit} width="100%">
                <Stack spacing={2}>
                  <TextField
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting}
                    id="email"
                    label="Email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    value={email}
                  />
                  <TextField
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    disabled={isSubmitting}
                    error={passwordTooShort}
                    helperText={isRegistering ? "At least 8 characters." : undefined}
                    id="password"
                    label="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    type="password"
                    value={password}
                  />
                  <Button
                    disabled={
                      isSubmitting ||
                      !email.trim() ||
                      !password ||
                      (isRegistering && password.length < 8)
                    }
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting ? (
                      <CircularProgress color="inherit" size={22} />
                    ) : (
                      copy[mode].submit
                    )}
                  </Button>
                </Stack>
              </Box>
              <Typography color="text.secondary" variant="body2">
                {copy[mode].togglePrompt}{" "}
                <Link component="button" onClick={handleToggleMode} type="button">
                  {copy[mode].toggleAction}
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
