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
import RPM from '../assets/rpm.svg';
import Maquina from '../assets/maquina.svg';
import GPS from '../assets/GPS_24px.svg';
import FaixaDinamica from '../assets/faixa_dinamica.svg';
import Duracao from '../assets/icon - header - numero de voltas.svg';

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
            <GridItem text="Máquina 1023" icon={Maquina} />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="Ponto 20192" icon={GPS} />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="200" icon={RPM} />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="16g" icon={FaixaDinamica} />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <GridItem text="20 min" icon={Duracao} />
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
