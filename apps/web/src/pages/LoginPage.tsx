import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { login, selectAuth } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store';

/**
 * Credencial da seed de demonstração (`prisma/seed.ts`, documentada em `docs/SETUP.md`).
 * Os dados são 100% sintéticos, então o formulário já abre preenchido — para entrar como
 * outro perfil basta digitar o e-mail dele. `VITE_DEMO_LOGIN=off` desliga o preenchimento.
 */
const DEMO_LOGIN = { email: 'analista@dynamox.local', password: 'Dynamox@2026' };
const DEMO_LOGIN_ENABLED = import.meta.env.VITE_DEMO_LOGIN !== 'off';

function requestedPrivatePath(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/')
  ) {
    return state.from;
  }
  return '/';
}

export function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectAuth);
  const location = useLocation();
  const [email, setEmail] = useState(DEMO_LOGIN_ENABLED ? DEMO_LOGIN.email : '');
  const [password, setPassword] = useState(DEMO_LOGIN_ENABLED ? DEMO_LOGIN.password : '');

  if (status === 'authenticated') {
    return <Navigate to={requestedPrivatePath(location.state)} replace />;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void dispatch(login({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h1" component="h1" gutterBottom>
            Entrar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Monitoramento de Ativos — Desafio Dynamox
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {status === 'error' && error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_LOGIN_ENABLED ? DEMO_LOGIN.email : undefined}
                autoComplete="username"
                autoFocus
                required
                fullWidth
              />
              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={DEMO_LOGIN_ENABLED ? DEMO_LOGIN.password : undefined}
                autoComplete="current-password"
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={status === 'loading' || email.trim() === '' || password === ''}
              >
                {status === 'loading' ? 'Entrando…' : 'Entrar'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
