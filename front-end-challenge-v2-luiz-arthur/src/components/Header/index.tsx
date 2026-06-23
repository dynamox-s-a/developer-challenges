import { Paper, Typography, Box } from '@mui/material';

const Header = () => {
  // Dados mockados (você pode ajustar conforme o Figma)
  const machineInfo = {
    name: 'Máquina 1023',
    point: 'Ponto 20192',
    rpm: '200',
    weight: '16g',
    duration: '20 min',
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
        Análise de Dados
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 2 }}>
        <Typography variant="body1">
          <strong>Máquina:</strong> {machineInfo.name}
        </Typography>
        <Typography variant="body1">
          <strong>Ponto:</strong> {machineInfo.point}
        </Typography>
        <Typography variant="body1">
          <strong>Rotação:</strong> {machineInfo.rpm} RPM
        </Typography>
        <Typography variant="body1">
          <strong>Peso:</strong> {machineInfo.weight}
        </Typography>
        <Typography variant="body1">
          <strong>Duração:</strong> {machineInfo.duration}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Header;