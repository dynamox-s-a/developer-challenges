import { Box, CardHeader, Container } from '@mui/material';
import InfoCard from './InfoCard';
import LineChart from '../../components/LineChart';

function PageData() {
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
            <LineChart title="Aceleração RMS" yAxisTitle="Aceleração RMS (g)" />
          </Box>
          <Box>
            <LineChart title="Temperatura" yAxisTitle="Temperatura (°C)" />
          </Box>
          <Box>
            <LineChart title="Velocidade RMS" yAxisTitle="Aceleração (g)" />
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default PageData;
