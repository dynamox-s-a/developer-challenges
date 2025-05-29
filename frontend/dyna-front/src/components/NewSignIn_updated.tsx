import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  Checkbox,
  FormControlLabel,
  Link,
  CssBaseline,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const theme = createTheme();

const NewSignIn: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // Assumindo que a resposta tem o formato: { "Login for: ": "nome", "Token": "token" }
      const token = response.data.Token;
      const userName = response.data["Login for: "];

      // Criar objeto user básico (pode ser melhorado obtendo mais dados do backend)
      const user = {
        id: 1, // Você pode obter isso de outro endpoint se necessário
        name: userName,
        email: email,
      };

      login(token, user);
    } catch (err: unknown) {
      console.error('Erro no login:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          {/* Ícone no topo */}
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>

          {/* Título centralizado */}
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          {/* Exibir erro se houver */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              sx={{ mb: 2 }}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Links */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Forgot password?
              </Link>
              <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>

          {/* Copyright */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 'auto' }}>
            {'Copyright © '}
            <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
              Dyna System
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default NewSignIn;
