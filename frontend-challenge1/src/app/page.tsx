"use client"

import { useState, useEffect } from 'react';
import { fetchChartData } from '../api/chartData';
import TimeSeriesChart from '../components/TimeSeriesChart';
import Header from '../components/Header';
import { Container, Typography, Box } from '@mui/material';

interface DataState {
  x: [number, number][];
  y: [number, number][];
  z: [number, number][];
}

const IndexPage: React.FC = () => {

  const [accelerationData, setAccelerationData] = useState<DataState>({
    x: [],
    y: [],
    z: [],
  });
  const [velocityData, setVelocityData] = useState<DataState>({
    x: [],
    y: [],
    z: [],
  });
  const [temperatureData, setTemperatureData] = useState<[number, number][]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchChartData();
        setAccelerationData(data.acceleration);
        setVelocityData(data.velocity);
        setTemperatureData(data.temperature);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, []);

  const machineData = {
    id: 1023,
    point: 20192,
    production: 200,
    gramsPerHour: 16,
    runtime: 20,
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Análise de Dados
        </Typography>
      </Box>

      <Header />

      <Box border={1} bgcolor='#FFF' borderColor="gray" p={3} my={5}>

        <Box sx={{ mb: 4 }} border={1} borderRadius={1} borderColor="gray">
          <Box borderBottom={1} p={2} borderColor="gray" mb={4}>
            <Typography variant="inherit" gutterBottom >
              Aceleração RMS
            </Typography>
          </Box>
          <TimeSeriesChart
            data={[
              { name: 'Axial', data: accelerationData.x },
              { name: 'Horizontal', data: accelerationData.y },
              { name: 'Radial', data: accelerationData.z },
            ]}
            title="Aceleração RMS"
            colors={['#2386CB', '#CC337D', '#B48A00']}
          />
        </Box>

        <Box sx={{ mb: 4 }} border={1} borderRadius={1} borderColor="gray">
          <Box borderBottom={1} p={2} borderColor="gray" mb={4}>
            <Typography variant="inherit" gutterBottom>
              Temperatura
            </Typography>
          </Box>
          <TimeSeriesChart
            data={[{ name: 'Temperatura', data: temperatureData }]}
            title="Temperatura"
            colors={['#89982E']}
          />
        </Box>

        <Box sx={{ mb: 4 }} border={1} borderRadius={1} borderColor="gray">
          <Box borderBottom={1} p={2} borderColor="gray" mb={4}>
            <Typography variant="inherit" gutterBottom>
              Velocidade RMS
            </Typography>
          </Box>
          <TimeSeriesChart
            data={[
              { name: 'Axial', data: velocityData.x },
              { name: 'Horizontal', data: velocityData.y },
              { name: 'Radial', data: velocityData.z },
            ]}
            title="Velocidade RMS"
            colors={['#2386CB', '#CC337D', '#B48A00']}
          />
        </Box>

      </Box>

    </Container>
  );
};

export default IndexPage;
