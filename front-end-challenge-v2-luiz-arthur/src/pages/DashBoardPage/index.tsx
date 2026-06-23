import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Header from '../../components/Header';
import { fetchDataRequest } from '../../store/modules/sensorSlice';
import type { RootState } from '../../store';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { loading, error, acceleration, velocity, temperature } = useSelector(
    (state: RootState) => state.sensor
  );

  // Dispara a busca ao montar a página (rota /data)
  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  // Estado de loading
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Verifica se os dados essenciais estão carregados
  if (!acceleration.x || !velocity.x || !temperature) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Typography>Aguardando dados...</Typography>
      </Container>
    );
  }

  // Tela principal com os gráficos
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Header />

      <Grid container spacing={4}>
        {/* Gráfico 1: Aceleração */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Aceleração RMS
            </Typography>
            <Box sx={{ height: 280 }}>
              {/* Placeholder - será substituído na Fase 4 */}
              <Typography color="textSecondary" align="center" sx={{ mt: 8 }}>
                📊 Gráfico (Fase 4)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico 2: Velocidade */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="secondary">
              Velocidade RMS
            </Typography>
            <Box sx={{ height: 280 }}>
              <Typography color="textSecondary" align="center" sx={{ mt: 8 }}>
                📊 Gráfico (Fase 4)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico 3: Temperatura */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="success">
              Temperatura
            </Typography>
            <Box sx={{ height: 280 }}>
              <Typography color="textSecondary" align="center" sx={{ mt: 8 }}>
                📊 Gráfico (Fase 4)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;