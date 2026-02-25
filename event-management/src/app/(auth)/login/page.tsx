'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { RootState } from '@/store';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginError = useAppSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push('/events');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Paper
        elevation={3}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', padding: 2, maxWidth: 400 }}
      >
        <Typography variant="h4" align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" type="submit" data-testid="login-button">
            Login
          </Button>
        </Box>
        {loginError && (
          <Typography align="center" color="error" data-testid="error-message">
            {loginError}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default LoginPage;
