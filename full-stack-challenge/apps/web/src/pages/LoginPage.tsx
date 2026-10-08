import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, SESSION_EXPIRED_ERROR } from '../features/auth/authSlice';

interface LoginFormValues {
  email: string;
  password: string;
}

// Dots split the domain into labels, so no two quantifiers compete for the
// same characters and matching stays linear (no ReDoS backtracking).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export const DEFAULT_PRIVATE_PATH = '/machines';

/** Where to go after signing in: the private page that sent us here, if any. */
function redirectTarget(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/')
    ? from
    : DEFAULT_PRIVATE_PATH;
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { status, loginPending, error } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } });

  if (status === 'authenticated') {
    return <Navigate to={redirectTarget(location.state)} replace />;
  }

  const onSubmit = handleSubmit(({ email, password }) => {
    void dispatch(login({ email: email.trim(), password }));
  });

  const { ref: emailRef, ...emailField } = register('email', {
    required: 'Email is required',
    pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
  });
  const { ref: passwordRef, ...passwordField } = register('password', {
    required: 'Password is required',
  });

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs" sx={{ py: { xs: 4, sm: 8 } }}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ p: { xs: 3, sm: 4 }, display: 'grid', gap: 3 }}
        >
          <Box>
            <Typography component="h1" variant="h5" fontWeight={600}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DynaPredict asset monitoring
            </Typography>
          </Box>

          {error && (
            <Alert
              severity={
                error.code === SESSION_EXPIRED_ERROR.code ? 'warning' : 'error'
              }
            >
              {error.message}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              id="login-email"
              label="Email"
              type="email"
              autoComplete="username"
              required
              fullWidth
              inputRef={emailRef}
              {...emailField}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              fullWidth
              inputRef={passwordRef}
              {...passwordField}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((shown) => !shown)}
                      edge="end"
                      sx={{ width: 44, height: 44 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loginPending}
              sx={{ minHeight: 44 }}
            >
              {loginPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
