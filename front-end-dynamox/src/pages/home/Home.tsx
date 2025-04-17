import { Box, Typography } from '@mui/material';
import imagemApp from '../../assets/desktop-and-mobile.png';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 6,
        gap: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to the Dynamox Monitoring Platform
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: '700px' }}>
        Our platform leverages smart sensors to enable predictive maintenance and real-time monitoring of industrial machines.
        By detecting potential issues early, we help reduce downtime, optimize performance, and extend equipment lifespan.
      </Typography>

      <img
        src={imagemApp}
        alt="App preview"
        style={{
          maxWidth: '60%',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        }}
      />

    </Box>
  );
}
