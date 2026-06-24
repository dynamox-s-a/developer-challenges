import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  Skeleton,
} from '@mui/material';
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

  // --- Loading com Skeleton ---
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Header />
        <Grid container spacing={4}>
          {[1, 2, 3].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  height: 350,
                  borderRadius: 2,
                }}
              >
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rectangular" height={280} sx={{ mt: 2 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // --- Estado de erro ---
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // --- Aguardando dados ---
  if (!acceleration.x || !velocity.x || !temperature) {
    return (
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Typography>Aguardando dados...</Typography>
      </Container>
    );
  }

  // --- Preparação das séries ---
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

  // --- Dashboard principal ---
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Header />

      <Grid container spacing={4}>
        {/* Aceleração */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, md: 2 },
              height: '100%',
              minHeight: 350,
              borderRadius: 2,
            }}
          >
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

        {/* Velocidade */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, md: 2 },
              height: '100%',
              minHeight: 350,
              borderRadius: 2,
            }}
          >
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

        {/* Temperatura */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, md: 2 },
              height: '100%',
              minHeight: 350,
              borderRadius: 2,
            }}
          >
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