import {
  Box, Button, Container, TextField, Typography, Paper,
  Toolbar,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/header/header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    const sucesso = await login(email, password);
  
    if (sucesso) {
      navigate('/');
    } else {
      setErro('Wrong email or password');
    }
  }

  return (
    <>
      <Header /> 
      <Toolbar />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          marginTop: 8, 
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography variant="h5" gutterBottom>Login</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(event.target.value)}
            />
            {erro && (
              <Typography color="error" variant="body2">{erro}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Enter
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
