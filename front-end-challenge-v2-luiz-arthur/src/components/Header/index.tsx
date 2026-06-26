import { Paper, Box, Typography, Divider, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../context/ThemeContext';

import MachineIcon from '../icons/MachineIcon';
import CentralPointIcon from '../icons/CentralPointIcon';
import RMSIcon from '../icons/RMSIcon';
import SensorIcon from '../icons/SensorIcon';
import TimeIcon from '../icons/TimeIcon';

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  const machineInfo = [
    { label: 'Máquina', value: '1023', icon: <MachineIcon/>, width: '366px' },
    { label: 'Ponto', value: '20192', icon: <CentralPointIcon/>, width: '366px' },
    { label: '', value: '200', icon: <RMSIcon/>, width: '228px' },
    { label: '', value: '16g', icon: <SensorIcon/>, width: '252px' },
    { label: '', value: '20 min', icon: <TimeIcon />, width: '252px' },
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
              className="header-info-item-wrapper"
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
              }}
            >
              <Box
                className="header-info-item"
                sx={{
                  width: item.width,
                  minWidth: item.width,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Box className="header-info-icon">{item.icon}</Box>
                <Box className="header-info-text">
                  {item.label && (
                    <span className="header-info-label">{item.label}</span>
                  )}
                  <span className="header-info-value">{item.value}</span>
                </Box>
              </Box>

              {index < machineInfo.length - 1 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  className="header-divider"
                  sx={{
                    marginLeft: '16px',
                    marginRight: '16px',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default Header;