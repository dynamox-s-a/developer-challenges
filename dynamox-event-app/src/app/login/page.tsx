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

    console.log('Login attempt:', { email, password });

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
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box width="100%">
          <Stack spacing={3}>

            <Box textAlign="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  margin: '0 auto',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ConfirmationNumberIcon sx={{ color: '#fff', fontSize: 32 }} />
              </Box>

              <Typography variant="h4" sx={{fontWeight: 'bold', mt: 2}}>
                EventHub
              </Typography>

              <Typography color="text.secondary">
                Faça login para gerenciar seus eventos.
              </Typography>
            </Box>

            <Card>
              <CardHeader
                title="Login"
                subheader="Entre com suas credênciais para continuar"
              />

              <CardContent>

                <form onSubmit={handleSubmit}>

                  <Stack spacing={2}>

                    {error && (
                      <Alert severity="error">
                        {error}
                      </Alert>
                    )}

                    <TextField
                      label="Email"
                      type="email"
                      placeholder="admin@events.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                    />

                    <TextField
                      label="Senha"
                      type="password"
                      placeholder="senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      Login
                    </Button>

                  </Stack>
                </form>

                {/* Demo credentials */}
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'grey.100'
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    Demo Credentials
                  </Typography>

                  <Typography variant="body2">
                    <b>Admin:</b> admin@events.com / admin123
                  </Typography>

                  <Typography variant="body2">
                    <b>Reader:</b> reader@events.com / reader123
                  </Typography>
                </Box>

              </CardContent>
            </Card>

          </Stack>
        </Box>
      </Box>
    </Container>
  );
}