// src/pages/DashboardPage/index.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Header from '../../components/Header';
import SensorChart from '../../components/SensorChart';
import { fetchDataRequest, setHoveredTimestamp } from '../../store/modules/sensorSlice';
import type { RootState } from '../../store';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { loading, error, acceleration, velocity, temperature, hoveredTimestamp } = useSelector(
    (state: RootState) => state.sensor
  );

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  const handleHover = (timestamp: number | null) => {
    dispatch(setHoveredTimestamp(timestamp));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!acceleration.x || !velocity.x || !temperature) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Typography>Aguardando dados...</Typography>
      </Container>
    );
  }

  const accelerationSeries = [
    { name: 'Horizontal (X)', data: acceleration.x.data, color: '#1976d2' },
    { name: 'Radial (Y)', data: acceleration.y?.data || [], color: '#d32f2f' },
    { name: 'Axial (Z)', data: acceleration.z?.data || [], color: '#2e7d32' },
  ];

  const velocitySeries = [
    { name: 'Horizontal (X)', data: velocity.x.data, color: '#1976d2' },
    { name: 'Radial (Y)', data: velocity.y?.data || [], color: '#d32f2f' },
    { name: 'Axial (Z)', data: velocity.z?.data || [], color: '#2e7d32' },
  ];

  const temperatureSeries = [
    { name: 'Temperatura', data: temperature.data, color: '#ed6c02' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Header />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Aceleração RMS
            </Typography>
            <Box sx={{ height: 280 }}>
              <SensorChart
                title="Aceleração RMS"
                series={accelerationSeries}
                hoveredTimestamp={hoveredTimestamp}
                onHover={handleHover}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="secondary">
              Velocidade RMS
            </Typography>
            <Box sx={{ height: 280 }}>
              <SensorChart
                title="Velocidade RMS"
                series={velocitySeries}
                hoveredTimestamp={hoveredTimestamp}
                onHover={handleHover}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom color="success">
              Temperatura
            </Typography>
            <Box sx={{ height: 280 }}>
              <SensorChart
                title="Temperatura"
                series={temperatureSeries}
                hoveredTimestamp={hoveredTimestamp}
                onHover={handleHover}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;