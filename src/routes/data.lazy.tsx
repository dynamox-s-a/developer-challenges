import { AppBar, Box, Card, Container, Divider, Typography, Grid } from '@mui/material';
import { createLazyFileRoute } from '@tanstack/react-router';

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
        sx={{ maxWidth: 1980, display: 'flex', flexDirection: 'column', gap: 2 }}
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
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '4px',
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Aceleração RMS</Typography>
          </Box>
          <Box
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
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Temperatura</Typography>
          </Box>
          <Box
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
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Velocidade RMS</Typography>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default Data;
