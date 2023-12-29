import { Box, CardHeader, Container } from '@mui/material';
import InfoCard from './InfoCard';
import LineChart from '../../components/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect } from 'react';
import { getAccRmsData } from '../../store/reducers/accelerationRms';

function PageData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAccRmsData([]));
  }, [dispatch, getAccRmsData]);

  const { accelerationRms, temperature, velocityRms } = useSelector(
    (state: IRootState) => ({
      accelerationRms: state.chartAccelerationRms,
      temperature: state.chartTemperature,
      velocityRms: state.chartVelocityRms,
    }),
  );

  return (
    <>
      <header>
        <CardHeader
          title="Análise de Dados"
          sx={{
            padding: '20px 24px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #dfe3e8',
          }}
          titleTypographyProps={{
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: '24px',
          }}
        />
      </header>
      <Container>
        <InfoCard />
        <Box>
          <Box>
            <LineChart {...accelerationRms} />
          </Box>
          <Box>
            <LineChart {...temperature} />
          </Box>
          <Box>
            <LineChart {...velocityRms} />
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default PageData;
