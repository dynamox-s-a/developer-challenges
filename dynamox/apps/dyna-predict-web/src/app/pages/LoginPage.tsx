import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@dynamox/types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import MonitorHeart from '@mui/icons-material/MonitorHeart';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/features/auth/auth.slice';
import { routePaths } from '../../router/paths';


function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate(routePaths.dashboard);
    } catch {
      setError('root', { message: 'Email ou senha incorretos' });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: 440, p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <MonitorHeart />
          </Avatar>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Dyna Predict
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plataforma de monitoramento de saúde e performance de ativos
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}
          >
            <TextField
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', { required: 'Email é obrigatório' })}
            />

            <TextField
              label="Senha"
              fullWidth
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
            />

            {errors.root && (
              <Typography variant="body2" color="error" textAlign="center">
                {errors.root.message}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
              Entrar
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 0.5 }}>
                Usuários de Demo
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                demo1@dynapredict.com · demo123
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                demo2@dynapredict.com · demo456
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
