import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Typography, Alert, Skeleton } from '@mui/material';
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
              <Skeleton variant="text" width="40%" height={24} />
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
    { name: 'Horizontal', data: acceleration.x.data, color: '#CC337D' },
    { name: 'Radial', data: acceleration.y?.data || [], color: '#B48A00' },
    { name: 'Axial', data: acceleration.z?.data || [], color: '#2386CB' },
  ];

  const velocitySeries = [
    { name: 'Horizontal', data: velocity.x.data, color: '#CC337D' },
    { name: 'Radial', data: velocity.y?.data || [], color: '#B48A00' },
    { name: 'Axial', data: velocity.z?.data || [], color: '#2386CB' },
  ];

  const temperatureSeries = [
    { name: 'Temperatura', data: temperature.data, color: '#89982E' },
  ];

  const chartConfigs = [
    {
      title: 'Aceleração RMS',
      series: accelerationSeries,
      yAxisTitle: 'Aceleração RMS (g)',
    },
    {
      title: 'Velocidade RMS',
      series: velocitySeries,
      yAxisTitle: 'Velocidade RMS (mm/s)',
    },
    {
      title: 'Temperatura',
      series: temperatureSeries,
      yAxisTitle: 'Temperatura (°C)',
    },
  ];

  return (
    <Container maxWidth="xl" className="app-container">
      <Header />
      <div className="charts-grid">
        {chartConfigs.map((config, index) => (
          <Paper key={index} className="chart-card" elevation={0}>
            <Typography className="chart-title">
              {config.title}
            </Typography>
            <div className="chart-container">
              <SensorChart
                title={config.title}
                series={config.series}
                yAxisTitle={config.yAxisTitle}
                hoveredTimestamp={hoveredTimestamp}
                onHover={handleHover}
              />
            </div>
          </Paper>
        ))}
      </div>
    </Container>
  );
};

export default DashboardPage;