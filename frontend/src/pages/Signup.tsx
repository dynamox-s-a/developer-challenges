import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Paper, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser, resetSignupStatus } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: ''});

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, signupSuccess } = useAppSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(resetSignupStatus());
        };
    }, [dispatch]);;

    useEffect(() => {
        if (signupSuccess) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [signupSuccess, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };
    return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#7a2f54' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
            Criar Nova Conta
          </Typography>
          {signupSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Conta criada com sucesso! Redirecionando para o login...
            </Alert>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome Completo"
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading || signupSuccess}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="E-mail"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading || signupSuccess}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading || signupSuccess}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#7a2f54', '&:hover': { bgcolor: '#8a3f64' } }}
              disabled={loading || signupSuccess}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Já possui uma conta?{' '} 
              <Link to="/login" style={{ textDecoration: 'none', color: '#7a2f54', fontWeight: 'bold', fontStyle: 'normal' }}>
                Entre aqui
              </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};