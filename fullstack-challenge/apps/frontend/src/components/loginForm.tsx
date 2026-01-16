'use client';

import { Box, TextField, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function getLoginErrorMessage(error?: string) {
    switch (error) {
      case 'CredentialsSignin':
        return 'E-mail ou senha inválidos. Verifique os dados e tente novamente.';
      default:
        return 'Não foi possível realizar o login. Tente novamente.';
    }
  }

  async function loginHandle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    if (res?.error) {
      setError(getLoginErrorMessage(res.error));
      setEmail('');
      setPassword('');
    } else {
      setError(null);
      window.location.href = '/dashboard';
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: '90%', sm: 450 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '50%',
            maxWidth: 300,
            mb: 4,
          }}
        >
          <Image
            src="/icons/Dynamox-logo.png"
            alt="Logo"
            width={300}
            height={300}
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Box>

        {/* Formulário */}
        <Box
          component="form"
          onSubmit={loginHandle}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            boxShadow: 5,
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h4" textAlign="center">
            User Login
          </Typography>

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Login
          </Button>

          {error && (
            <Typography
              color="error"
              variant="body2"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
