import { FormEvent, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, login } from '../features/auth/authSlice';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { status, error, user, accessToken } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('admin@dynamox.test');
  const [password, setPassword] = useState('Dynamox@123');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  if (accessToken && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());
    dispatch(login({ email, password }));
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{
        background: 'linear-gradient(145deg, #0B3A5B 0%, #1A5F8F 45%, #00A3A1 100%)',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" color="primary">
                DynaPredict
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in with the seeded challenge credentials
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
