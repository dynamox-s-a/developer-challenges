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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const { user, token } = await loginRequest(email, password);

      dispatch(loginSuccess({ user, token }));

      document.cookie = `token=${token}; path=/`;
      document.cookie = `user=${JSON.stringify(user)}; path=/`;

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/events');
      }
    } catch {
      setError('Invalid email or password');
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
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}