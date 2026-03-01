import { Avatar, Box, Button, Typography } from '@mui/material';
import MonitorHeart from '@mui/icons-material/MonitorHeart';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleBack = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 420,
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <MonitorHeart />
        </Avatar>
        <Typography variant="h1" fontWeight="bold" color="primary">
          404
        </Typography>

        <Typography variant="h5" fontWeight="medium">
          Sinal não detectado
        </Typography>

        <Typography variant="body1" color="text.secondary">
          A rota que você acessou não existe neste sistema de monitoramento.
        </Typography>

        <Button variant="contained" size="large" onClick={handleBack} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
