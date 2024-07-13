import Image from 'next/image';
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Divider, useMediaQuery, useTheme } from '@mui/material';


const Header: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          alignItems="center"
          width="100%"
          justifyContent="space-around"
        >
          <Box display="flex" alignItems="center" mb={isSmallScreen ? 1 : 0}>
            <Image
              src="/assets/icon-motor.svg"
              color='black'
              alt='rpm'
              width={20}
              height={20} />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              Máquina 1023
            </Typography>
          </Box>
          <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
          <Box display="flex" alignItems="center" mb={isSmallScreen ? 1 : 0}>
            <Image
              src="/assets/icon-spot.svg"
              color='black'
              alt='rpm'
              width={20}
              height={20} />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              Ponto 20192
            </Typography>
          </Box>
          <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
          <Box display="flex" alignItems="center" mb={isSmallScreen ? 1 : 0}>
            <Image
              src="/assets/icon-rpm.svg"
              alt='rpm'
              width={20}
              height={20} />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              200
            </Typography>
          </Box>
          <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
          <Box display="flex" alignItems="center" mb={isSmallScreen ? 1 : 0}>
            <Image
              src="/assets/icon-faixa-dinamica.svg"
              color='black'
              alt='rpm'
              width={20}
              height={20} />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              16g
            </Typography>
          </Box>
          <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
          <Box display="flex" alignItems="center">
            <Image
              src="/assets/icon-time.svg"
              color='black'
              alt='rpm'
              width={20}
              height={20} />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              20 min
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
