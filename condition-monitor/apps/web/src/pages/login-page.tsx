import { loginRequestSchema, type LoginRequest } from '@condition-monitor/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router';
import type { z } from 'zod';
import { login } from '../features/session/session-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type LoginForm = z.input<typeof loginRequestSchema>;

/**
 * Login with the fixed credentials (assumption A1). The form validates with the same
 * schema as the API (ADR 0007); the API's own answer still wins, field by field.
 */
export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAppSelector((state) => state.session.status);
  const [failure, setFailure] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm, unknown, LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: '', password: '' },
  });

  const from = (location.state as { from?: string } | null)?.from ?? '/';
  if (status === 'authenticated') {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (credentials: LoginRequest) => {
    setFailure(null);
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
      return;
    }
    const reason = result.payload;
    for (const fieldError of reason?.fieldErrors ?? []) {
      if (fieldError.field === 'email' || fieldError.field === 'password') {
        setError(fieldError.field, { message: fieldError.message });
      }
    }
    setFailure(reason?.message ?? 'Login failed.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper component="main" sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Condition Monitor
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to continue.
        </Typography>
        {failure && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {failure}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            autoComplete="username"
            fullWidth
            margin="normal"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            autoFocus
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Signing in' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
