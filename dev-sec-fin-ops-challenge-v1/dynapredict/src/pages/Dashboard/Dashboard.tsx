import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/Slices/authSlice';
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao DynaPredict
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/machines')}
        >
          Gerenciar Máquinas
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/sensors')}
        >
          Gerenciar Sensores
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sistema de Monitoramento de Ativos
          </Typography>
          <Typography color="text.secondary">
            Gerencie suas máquinas, pontos de monitoramento e sensores.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
