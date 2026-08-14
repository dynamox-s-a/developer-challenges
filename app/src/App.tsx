import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dynamox Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Projeto inicializado com Vite, React, TypeScript, Redux, Redux Saga, Material UI,
          Highcharts e Jest.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
