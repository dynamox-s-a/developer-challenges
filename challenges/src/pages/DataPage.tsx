import { AppDispatch, RootState } from '../store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/material';
import BoxChart from '../components/BoxChat';
import FaixaSVGIcon from '../assets/Faixa';
import InfoData from '../components/InfoData';
import IntevaloSVGIcon from '../assets/Intervalo';
import Layout from '../components/Layout';
import LocationSVGIcon from '../assets/Location';
import RpmSVGIcon from '../assets/Rpm';
import VectorSVGIcon from '../assets/Vector';
import VerticalDivider from '../components/VerticalDivider';
import { fetchDataRequest } from '../store/slices/dataSlice';

const DataPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const accelerationData = items
    .filter((item) => item.name.startsWith('accelerationRms'))
    .map((item) => ({
      name: item.name,
      data: item.data.map((entry) => [new Date(entry.datetime).getTime(), entry.max] as [number, number])
    }));

  const velocityData = items
    .filter((item) => item.name.startsWith('velocityRms'))
    .map((item) => ({
      name: item.name,
      data: item.data.map((entry) => [new Date(entry.datetime).getTime(), entry.max] as [number, number])
    }));

  const temperatureData = items
    .filter((item) => item.name === 'temperature')
    .map((item) => ({
      name: item.name,
      data: item.data.map((entry) => [new Date(entry.datetime).getTime(), entry.max] as [number, number])
    }));
    
  return (
    <Layout>
      <Box sx={{
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: 'solid 0.1em #DFE3E8',
        display: 'flex',
        flexWrap: 'wrap',
        height: { xs: '100%', md: '25px' },
        justifyContent:  {xs: 'center', md: 'space-around'},
        padding: '10px',
        margin: {xs: '0 auto 20px auto', md: '0 0 20px 0'},
        maxWidth: {xs: 'calc(80% - 20px)', md: '100%'},
        paddingTop: {xs: 0, md: 0},
        paddingBottom: {xs: 0, md: '25px'},
        px: { xs: 2, md: 4 },
        py: 3,
      }}>
        <InfoData title='Máquna 1023'>
          <VectorSVGIcon />
        </InfoData>
        <VerticalDivider />
        <InfoData title='Ponto 20192'>
          <LocationSVGIcon />
        </InfoData>
        <VerticalDivider />
        <InfoData title='200'>
          <RpmSVGIcon/>
        </InfoData>
        <VerticalDivider />
        <InfoData title='16g'>
          <FaixaSVGIcon />
        </InfoData>
        <VerticalDivider />
        <InfoData title='20 min'>
          <IntevaloSVGIcon />
        </InfoData>
      </Box>

      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          border: 'solid 0.1em #DFE3E8',
          padding: '10px',
        }}  
      >
        <BoxChart
          title="Aceleração RMS"
          data={accelerationData}
          yAxisTitle="Aceleração RMS (g)"
        />
        <BoxChart
          title="Temperatura"
          data={temperatureData}
          yAxisTitle="Temperatura (°C)"
        />
        <BoxChart
          title="Velocidade RMS"
          data={velocityData}
          yAxisTitle="Aceleração (g)"
        />
      </Box>
    </Layout>
  );
};

export default DataPage;