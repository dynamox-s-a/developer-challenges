'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Button,
  Alert,
  Container,
  Stack
} from '@mui/material';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');

      router.push(user.role === 'admin' ? '/dashboard' : '/events');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack 
        spacing={3}
        sx={{
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >

        <Box textAlign='center' width={'100%'}>
          <Box
            sx={{
              width: 64,
              height: 64,
              margin: '0 auto',
              borderRadius: 3,
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ConfirmationNumberIcon sx={{ color: '#fff', fontSize: 32 }} />
          </Box>

          <Typography variant='h4' sx={{fontWeight: 'bold', mt: 2}}>
            EventHub
          </Typography>

          <Typography color='text.secondary'>
            Faça login para gerenciar seus eventos.
          </Typography>
        </Box>

        <Card sx={{width: '100%', borderRadius: 3}}>
          <CardHeader
            title='Login'
            subheader='Entre com suas credênciais para continuar'
          />

          <CardContent>
            <form onSubmit={handleSubmit}>

              <Stack spacing={2}>

                {error && (
                  <Alert severity='error'>
                    {error}
                  </Alert>
                )}

                <TextField
                  label='Email'
                  type='email'
                  placeholder='admin@events.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />

                <TextField
                  label='Senha'
                  type='password'
                  placeholder='senha'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />

                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  fullWidth
                  sx={{backgroundColor: '#6366f1'}}
                >
                  Login
                </Button>

              </Stack>
            </form>
          </CardContent>
        </Card>

      </Stack>
    </Container>
  );
}