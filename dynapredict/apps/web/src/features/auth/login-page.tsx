import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { loginSchema, type LoginInput } from '@dynapredict/shared';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './auth.slice';

// Ex.: { email: ['Informe um e-mail válido'] }
type FieldErrors = Partial<Record<keyof LoginInput, string[]>>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { token, status, error } = useAppSelector((state) => state.auth);

  const [values, setValues] = useState<LoginInput>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Já tem token (acabou de logar ou já estava logado)? Sai da tela de login
  if (token) {
    return <Navigate to="/machines" replace />;
  }

  const isLoading = status === 'loading';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // impede o navegador de recarregar a página

    // 1. Valida no front, com o MESMO schema que a API usa
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setFieldErrors({});

    // 2. Chama a API pelo thunk. Se der certo, o token aparece no Redux
    //    e o "if (token)" lá em cima faz o redirecionamento
    dispatch(login(result.data));
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            DynaPredict
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Entre com sua conta para continuar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="E-mail"
                type="email"
                autoComplete="email"
                autoFocus
                fullWidth
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email?.[0]}
              />

              <TextField
                label="Senha"
                type="password"
                autoComplete="current-password"
                fullWidth
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password?.[0]}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

