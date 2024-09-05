import React from 'react';
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Use a variável de ambiente para a URL da API
  const apiUrl = import.meta.env.VITE_API_URL || 'https://dynamax-13e4b3075752.herokuapp.com/api';

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`, // Usando a variável de ambiente para a URL da API
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('token', response.data.token);
        navigate('/machines');
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      alert('Falha no login. Por favor, tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      {/* Área do formulário de login */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          padding: theme.spacing(4),
        }}
      >
        <Box maxWidth="400px" width="100%">
          <Typography variant="h4" gutterBottom>
            Entrar
          </Typography>
          <Typography variant="body2" gutterBottom>
            Não tem uma conta? <Link href="/register">Cadastrar-se</Link>
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Endereço de Email"
              margin="normal"
              variant="outlined"
              {...register('email', { required: 'Email é obrigatório' })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message as string}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              margin="normal"
              variant="outlined"
              {...register('password', { required: 'Senha é obrigatória' })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message as string}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Entrar
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: 'none' }}>
            <Link href="#" variant="body2">
              Esqueceu a senha?
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Área da imagem */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#122647', // Cor de fundo para o lado direito
        }}
      >
        <Box
          component="img"
          src="https://material-kit-react.devias.io/assets/auth-widgets.png"
          alt="Widgets de Autenticação"
          sx={{
            maxWidth: '100%',
            width: '600px',
            height: 'auto',
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
