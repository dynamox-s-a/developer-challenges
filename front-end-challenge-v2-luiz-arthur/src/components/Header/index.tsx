// src/components/Header/index.tsx
import { Paper, Typography, Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  const machineInfo = {
    name: 'Máquina 1023',
    point: 'Ponto 20192',
    rpm: '200',
    weight: '16g',
    duration: '20 min',
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1.5rem', md: '2rem' },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Análise de Dados
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 2, md: 4 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
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
      </Box>

      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Paper>
  );
};

export default Header;