import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Typography, Box, Alert, Skeleton } from '@mui/material';
import Header from '../../components/Header';
import SensorChart from '../../components/SensorChart';
import { fetchDataRequest, setHoveredTimestamp } from '../../store/modules/sensorSlice';
import type { RootState } from '../../store';
import '../../App.css';

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
      <Container maxWidth="xl" className="app-container">
        <Header />
        <div className="charts-grid">
          {[1, 2, 3].map((_, index) => (
            <Paper key={index} className="chart-card" elevation={0}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="rectangular" height={280} sx={{ mt: 2 }} />
            </Paper>
          ))}
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" className="app-container">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!acceleration.x || !velocity.x || !temperature) {
    return (
      <Container maxWidth="xl" className="app-container">
        <Typography>Aguardando dados...</Typography>
      </Container>
    );
  }

  const accelerationSeries = [
    { name: 'Horizontal', data: acceleration.x.data, color: '#1976d2' },
    { name: 'Radial', data: acceleration.y?.data || [], color: '#d32f2f' },
    { name: 'Axial', data: acceleration.z?.data || [], color: '#2e7d32' },
  ];

  const velocitySeries = [
    { name: 'Horizontal', data: velocity.x.data, color: '#1976d2' },
    { name: 'Radial', data: velocity.y?.data || [], color: '#d32f2f' },
    { name: 'Axial', data: velocity.z?.data || [], color: '#2e7d32' },
  ];

  const temperatureSeries = [
    { name: 'Temperatura', data: temperature.data, color: '#ed6c02' },
  ];

  return (
    <Container maxWidth="xl" className="app-container">
      <Header />
      <div className="charts-grid">
        <Paper className="chart-card" elevation={0}>
          <Typography className="chart-title" color="primary">
            Aceleração RMS
          </Typography>
          <div className="chart-container">
            <SensorChart
              title="Aceleração RMS"
              series={accelerationSeries}
              yAxisTitle="Análise RMS (g)"
              hoveredTimestamp={hoveredTimestamp}
              onHover={handleHover}
            />
          </div>
        </Paper>

        <Paper className="chart-card" elevation={0}>
          <Typography className="chart-title" color="secondary">
            Velocidade RMS
          </Typography>
          <div className="chart-container">
            <SensorChart
              title="Velocidade RMS"
              series={velocitySeries}
              yAxisTitle="Análise RMS (mm/s)"
              hoveredTimestamp={hoveredTimestamp}
              onHover={handleHover}
            />
          </div>
        </Paper>

        <Paper className="chart-card" elevation={0}>
          <Typography className="chart-title" color="success">
            Temperatura
          </Typography>
          <div className="chart-container">
            <SensorChart
              title="Temperatura"
              series={temperatureSeries}
              yAxisTitle="Temperatura (°C)"
              hoveredTimestamp={hoveredTimestamp}
              onHover={handleHover}
            />
          </div>
        </Paper>
      </div>
    </Container>
  );
};

export default DashboardPage;