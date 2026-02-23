'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
} from '@mui/material';

import { loginRequest } from '@/services/authService';
import { loginSuccess } from '@/store/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await loginRequest(email, password);

      // Atualiza Redux
      dispatch(loginSuccess({ user, token }));

      // Salva cookies para o middleware
      document.cookie = `token=${token}; path=/;`;
      document.cookie = `user=${JSON.stringify(user)}; path=/;`;

      // Redirecionamento por role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/events');
      }

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
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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