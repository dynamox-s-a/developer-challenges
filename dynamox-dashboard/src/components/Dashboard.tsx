import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid
} from '@mui/material';
import styled from 'styled-components';
import type { RootState, AppDispatch } from '../store';
import { fetchDataRequest } from '../store/sensorSlice';
import SynchronizedChart from './SynchronizedChart';
import Header from './Header';
import { filterSensorsByType, getSensorTypes, getSensorColor, getSensorDisplayName } from '../utils/sensorUtils';

const ChartsGrid = styled(Grid)`
  gap: 16px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const ChartCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector((state: RootState) => state.sensor);

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  // Obter tipos de sensores disponíveis
  const sensorTypes = getSensorTypes(data);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, maxWidth: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} data-testid="loading-spinner" />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Carregando dados dos sensores...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Header sensorTypes={sensorTypes} />
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, md: 4 }, 
          mb: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        
      
      <ChartsGrid container spacing={3}>
        {/* Gráficos de Sensores Sincronizados */}
        {sensorTypes.map((type) => {
          const sensorData = filterSensorsByType(data, type);
          const displayName = getSensorDisplayName(type);
          const color = getSensorColor(type);
          
          return (
            <Grid size={12} key={type} id={`chart-${type}`}>
                      <ChartCard>
                        <ChartCardContent data-testid="chart-container">
                          <SynchronizedChart
                            id={`chart-${type}`}
                            title={displayName}
                            data={sensorData}
                            color={color}
                          />
                        </ChartCardContent>
                      </ChartCard>
            </Grid>
          );
        })}
        
        {/* Informações dos Sensores */}
        <Grid size={12} id="sensor-info">
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Informações dos Sensores
              </Typography>
              <Grid container spacing={2}>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((sensor, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" component="h3">
                            {sensor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total de medições: {sensor.data.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Última atualização: {
                              sensor.data.length > 0 
                                ? new Date(sensor.data[sensor.data.length - 1].datetime).toLocaleString()
                                : 'N/A'
                            }
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid size={12}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      Nenhum dado de sensor disponível
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </ChartsGrid>
      </Container>
    </>
  );
};

export default Dashboard;
