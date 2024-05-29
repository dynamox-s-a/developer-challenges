import { Container, Divider, Grid } from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';
import AccelerationChart from '../components/Chart/AccelerationChart';
import TemperatureChart from '../components/Chart/TemperatureChart';
import VelocityRmsChart from '../components/Chart/VelocityRmsChart';
import Header from '../components/Header';
import GridItem from '../components/Grid';
import CardHeader from '../components/Card/CardHeader';
import CardChart from '../components/Card/CardChart';
import BoxChart from '../components/BoxChart';

export const Route = createLazyFileRoute('/data')({
  component: Data,
});

function Data() {
  return (
    <>
      <Header title="Análise de Dados" />
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1980, display: 'flex', flexDirection: 'column', gap: 2, pb: 6 }}
        component={'main'}
        role="main"
      >
        <CardHeader>
          <Grid container spacing={2} alignItems="center">
            <GridItem text="Máquina 1023" icon="ICON" />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="Ponto 20192" icon="ICON" />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="200" icon="icon" />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="16g" icon="ICON" />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="20 min" icon="ICON" />
          </Grid>
        </CardHeader>

        <CardChart>
          <BoxChart text="Aceleração RMS">
            <AccelerationChart />
          </BoxChart>
          <BoxChart text="Temperatura">
            <TemperatureChart />
          </BoxChart>
          <BoxChart text="Velocidade RMS">
            <VelocityRmsChart />
          </BoxChart>
        </CardChart>
      </Container>
    </>
  );
}

export default Data;
