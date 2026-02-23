'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
} from '@mui/material';

import { loginRequest } from '@/services/authService';
import { loginSuccess } from '@/store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const getRedirectPath = useCallback(
    (role?: string) => {
      if (redirect) return redirect;

      if (role === 'admin') {
        return '/admin/events';
      }

      return '/events';
    },
    [redirect]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getRedirectPath(user?.role));
    }
  }, [isAuthenticated, user, router, getRedirectPath]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await loginRequest(email, password);

      dispatch(loginSuccess({ user, token }));

      router.replace(getRedirectPath(user.role));
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" mb={2}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}