import { AppBar, Box, Card, Container, Divider, Typography, Grid } from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';
import AccelerationChart from '../components/AccelerationChart';
import TemperatureChart from '../components/TemperatureChart';
import VelocityRmsChart from '../components/VelocityRmsChart';

export const Route = createLazyFileRoute('/data')({
  component: Data,
});

function Data() {
  return (
    <>
      <AppBar
        position="static"
        sx={{ px: 3, py: 2, mb: 2, boxShadow: 0, border: 1, borderColor: '#DFE3E8', background: '#FFFFFF' }}
      >
        <Typography variant="h1" sx={{ fontSize: 20, fontWeight: 500, color: '#3A3B3F' }}>
          Análise de Dados
        </Typography>
      </AppBar>
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1980, display: 'flex', flexDirection: 'column', gap: 2, pb: 6 }}
        component={'main'}
        role="main"
      >
        <Card
          component={'header'}
          sx={{
            boxShadow: 0,
            border: 1,
            borderColor: '#DFE3E8',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '4px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                Icon
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Máquina 1023</Typography>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Grid item xs={12} sm={6} md>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                Icon
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Ponto 20192</Typography>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Grid item xs={12} sm={6} md>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                Icon
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>200</Typography>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Grid item xs={12} sm={6} md>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                Icon
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>16g</Typography>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Grid item xs={12} sm={6} md>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                Icon
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>20 min</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
        <Card
          component={'section'}
          sx={{
            p: 2,
            pb: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: 0,
            border: 1,
            borderColor: '#DFE3E8',
          }}
        >
          <Box
            sx={{
              boxShadow: 0,
              border: 1,
              borderColor: '#DFE3E8',
              px: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '4px',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                borderBottom: 1,
                borderColor: '#DFE3E8',
                width: 1,
                p: 2,
                textAlign: 'left',
              }}
            >
              Aceleração RMS
            </Typography>
            <div className="highcard-container">
              <AccelerationChart />
            </div>
          </Box>
          <Box
            sx={{
              boxShadow: 0,
              border: 1,
              borderColor: '#DFE3E8',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '4px',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                borderBottom: 1,
                borderColor: '#DFE3E8',
                width: 1,
                p: 2,
                textAlign: 'left',
              }}
              component={'h2'}
            >
              Temperatura
            </Typography>
            <div className="highcard-container">
              <TemperatureChart />
            </div>
          </Box>
          <Box
            sx={{
              boxShadow: 0,
              border: 1,
              borderColor: '#DFE3E8',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '4px',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                borderBottom: 1,
                borderColor: '#DFE3E8',
                width: 1,
                p: 2,
                textAlign: 'left',
              }}
            >
              Velocidade RMS
            </Typography>
            <div className="highcard-container">
              <VelocityRmsChart />
            </div>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default Data;
