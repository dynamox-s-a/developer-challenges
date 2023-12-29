import { Box, CardHeader, Container, Grid } from '@mui/material';
import InfoCard from '../../components/InfoCard';
import LineChart from '../../components/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect } from 'react';
import { getAccRmsData } from '../../store/reducers/accelerationRms';
import { getTemperatureData } from '../../store/reducers/temperature';
import { getVelocityRmsData } from '../../store/reducers/velocityRms';

function PageData() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAccRmsData());
    dispatch(getTemperatureData());
    dispatch(getVelocityRmsData());
  }, [dispatch]);

  const { accelerationRms, temperature, velocityRms } = useSelector(
    (state: IRootState) => ({
      accelerationRms: state.accelerationRms,
      temperature: state.temperature,
      velocityRms: state.velocityRms,
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
        <Box
          sx={{
            margin: '24px 0px',
            padding: '24px',
            backgroundColor: '#fff',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LineChart {...accelerationRms} />
            </Grid>
            <Grid item xs={12}>
              <LineChart {...velocityRms} />
            </Grid>
            <Grid item xs={12}>
              <LineChart {...temperature} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default PageData;
