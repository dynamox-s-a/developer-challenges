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
    <Paper className="header-paper" elevation={0}>
      <Box>
        <Typography className="header-title" component="h1">
          Análise de Dados
        </Typography>
        <Box className="header-info">
          <span>{machineInfo.name}</span>
          <span>{machineInfo.point}</span>
          <span>{machineInfo.rpm}</span>
          <span>{machineInfo.weight}</span>
          <span>{machineInfo.duration}</span>
        </Box>
      </Box>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Paper>
  );
};

export default Header;