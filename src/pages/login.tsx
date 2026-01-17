import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

export const Login = () => {
  // uso dispatch para disparar a ação de login no Redux
  const dispatch = useDispatch();
  
  // uso navigate para redirecionar o usuário após login bem-sucedido
  const navigate = useNavigate();
  
  // armazeno o email do formulário
  const [email, setEmail] = useState('');
  
  // armazeno a senha do formulário
  const [password, setPassword] = useState('');
  
  // armazeno a mensagem de erro para exibir ao usuário
  const [error, setError] = useState('');

  // valido as credenciais e faço login se forem válidas
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // verifico se o email e senha correspondem às credenciais esperadas
    if (email === 'admin@dynamox.net' && password === 'admin') {
      // uso dispatch para disparar a ação de login salvando o email no estado global
      dispatch(login(email));
      // uso navigate para redirecionar para a página de máquinas
      navigate('/machines'); 
    } else {
      // exibo uma mensagem de erro com as credenciais corretas
      setError('Credenciais inválidas! Tente: admin@dynamox.net / admin');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* monto o card de login com elevation e padding */}
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            width: '100%' 
          }}
        >
          {/* exibo o título da aplicação */}
          <Typography component="h1" variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            DynaPredict
          </Typography>

          {/* exibo um subtítulo descrevendo o propósito da página */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Entre para gerenciar seus ativos
          </Typography>

          {/* crio o formulário de login */}
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            {/*crio um campo de entrada para o email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {/* crio um campo de entrada para a senha */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* exibo um alerta de erro se houver mensagem de erro */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* crio o botão de submit para fazer login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};