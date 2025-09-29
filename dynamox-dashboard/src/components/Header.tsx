import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Home,
  TrendingUp,
  Speed,
  Thermostat,
  Info,
  Dashboard,
  Menu
} from '@mui/icons-material';
import styled from 'styled-components';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const NavButton = styled(Button)`
  color: white !important;
  font-weight: 500;
  margin: 0 8px;
  transition: all 0.3s ease;
  
  & .MuiButton-startIcon {
    color: white !important;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    color: white !important;
    
    & .MuiButton-startIcon {
      color: white !important;
    }
  }
`;

const Logo = styled(Typography)`
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DesktopMenu = styled(Box)`
  display: flex;
  align-items: center;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileMenuButton = styled(IconButton)`
  color: white !important;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    color: white !important;
  }
  
  transition: all 0.3s ease;
  
  & .MuiSvgIcon-root {
    color: white !important;
  }
  
  @media (min-width: 768px) {
    display: none !important;
  }
`;

interface HeaderProps {
  sensorTypes: string[];
}

const Header: React.FC<HeaderProps> = ({ sensorTypes }) => {
  const { scrollToElement, scrollToTop } = useSmoothScroll();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (type: string) => {
    const chartId = `chart-${type}`;
    scrollToElement(chartId, 80);
    setMobileOpen(false); // Fecha o drawer após navegação
  };

  const handleInfoNavigation = () => {
    scrollToElement('sensor-info', 80);
    setMobileOpen(false); // Fecha o drawer após navegação
  };

  const getDisplayName = (type: string): string => {
    const names = {
      acceleration: 'Aceleração',
      velocity: 'Velocidade',
      temperature: 'Temperatura'
    };
    return names[type as keyof typeof names] || type;
  };

  const getIcon = (type: string) => {
    const icons = {
      acceleration: <TrendingUp />,
      velocity: <Speed />,
      temperature: <Thermostat />
    };
    return icons[type as keyof typeof icons] || <Dashboard />;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: '#1976d2', fontWeight: 700 }}>
        Dynamox Dashboard
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={scrollToTop} data-testid="mobile-nav-home">
            <ListItemIcon>
              <Home sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="Início" sx={{ color: '#333' }} />
          </ListItemButton>
        </ListItem>
        
        {sensorTypes.map((type) => (
          <ListItem key={type} disablePadding>
            <ListItemButton onClick={() => handleNavigation(type)} data-testid={`mobile-nav-${type}`}>
              <ListItemIcon>
                {React.cloneElement(getIcon(type), { sx: { color: '#1976d2' } })}
              </ListItemIcon>
              <ListItemText primary={getDisplayName(type)} sx={{ color: '#333' }} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleInfoNavigation} data-testid="mobile-nav-info">
            <ListItemIcon>
              <Info sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="Informações" sx={{ color: '#333' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

          return (
            <>
            <StyledAppBar position="sticky" elevation={0} data-testid="header">
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Logo variant="h5">
                  Dynamox Dashboard
                </Logo>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Menu Desktop */}
                  <DesktopMenu data-testid="desktop-menu">
                    <NavButton
                      onClick={scrollToTop}
                      startIcon={<Home sx={{ color: 'white !important' }} />}
                      data-testid="nav-home"
                    >
                      Início
                    </NavButton>
                    {sensorTypes.map((type) => (
                      <NavButton
                        key={type}
                        onClick={() => handleNavigation(type)}
                        startIcon={React.cloneElement(getIcon(type), { sx: { color: 'white !important' } })}
                        data-testid={`nav-${type}`}
                      >
                        {getDisplayName(type)}
                      </NavButton>
                    ))}
                    <NavButton
                      onClick={() => scrollToElement('sensor-info', 80)}
                      startIcon={<Info sx={{ color: 'white !important' }} />}
                      data-testid="nav-info"
                    >
                      Informações
                    </NavButton>
                  </DesktopMenu>
                  
                  {/* Botão Mobile */}
                  <MobileMenuButton onClick={handleDrawerToggle} data-testid="mobile-menu-button">
                    <Menu sx={{ color: 'white !important' }} />
                  </MobileMenuButton>
                </Box>
              </Toolbar>
            </StyledAppBar>
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        data-testid="mobile-drawer"
      >
        {drawer}
      </Drawer>
    </Box>
  </>
  );
};

export default Header;
