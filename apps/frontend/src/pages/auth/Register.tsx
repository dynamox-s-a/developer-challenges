import React from 'react';
import { Box, Button, TextField, Link, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Usando import.meta.env para pegar a URL da API dinamicamente no Vite
  const apiUrl = import.meta.env.VITE_API_URL || 'https://dynamax-13e4b3075752.herokuapp.com/api';

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/register`, // URL da API dinâmica
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        }
      );

      if (response.data) {
        navigate('/login'); // Redireciona para a página de login após o registro bem-sucedido
      } else {
        alert('Falha no registro');
      }
    } catch (error) {
      console.error('Erro durante o registro:', error);
      alert('Falha no registro. Por favor, tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      {/* Área do formulário de registro */}
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
            Cadastro
          </Typography>
          <Typography variant="body2" gutterBottom>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              fullWidth
              label="Nome"
              margin="normal"
              variant="outlined"
              {...register('firstName', { required: 'Nome é obrigatório' })}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName?.message as string}
            />
            <TextField
              fullWidth
              label="Sobrenome"
              margin="normal"
              variant="outlined"
              {...register('lastName', { required: 'Sobrenome é obrigatório' })}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName?.message as string}
            />
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
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
              Cadastrar
            </Button>
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
          backgroundColor: '#122647',
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

export default RegisterPage;
