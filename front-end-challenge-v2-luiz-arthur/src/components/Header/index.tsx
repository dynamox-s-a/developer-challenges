import { Paper, Box, Typography, Divider, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../context/ThemeContext';

// Ícones temporários (substitua pelos seus ícones do Figma)
import BusinessIcon from '@mui/icons-material/Business';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SpeedIcon from '@mui/icons-material/Speed';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  // Adicione a propriedade 'width' para cada item (use px, %, ou qualquer valor CSS)
  const machineInfo = [
    { label: 'Máquina', value: '1023', icon: <BusinessIcon fontSize="small" />, width: '366px' },
    { label: 'Ponto', value: '20192', icon: <PinDropIcon fontSize="small" />, width: '366px' },
    { label: '', value: '200', icon: <SpeedIcon fontSize="small" />, width: '228px' },
    { label: '', value: '16g', icon: <FitnessCenterIcon fontSize="small" />, width: '252px' },
    { label: '', value: '20 min', icon: <TimerIcon fontSize="small" />, width: '252px' },
  ];

  return (
    <Paper className="header-paper" elevation={0}>
      <Box className="header-top">
        <Typography className="header-title" variant="h5" component="h1">
          Análise de Dados
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" size="small">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Box className="header-container">

      <Box className="header-info-row">
        {machineInfo.map((item, index) => (
          <Box
            key={index}
            className="header-info-item"
            sx={{
              flex: '0 0 auto', // não cresce nem encolhe
              width: item.width, // largura personalizada
              minWidth: item.width,
            }}
          >
            <Box className="header-info-icon">{item.icon}</Box>
            <Box className="header-info-text">
              <span className="header-info-label">{item.label}</span>
              <span className="header-info-value">{item.value}</span>
            </Box>
            {index < machineInfo.length - 1 && (
              <Divider orientation="vertical" flexItem className="header-divider" />
            )}
          </Box>
        ))}
      </Box>

      </Box>
    </Paper>
  );
};

export default Header;