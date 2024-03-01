import Box from '@mui/material/Box';
import React from 'react';
import { Copyright } from '../../page';
import SensorsHeader from './sensors-header';
import SensorsTable from './sensors-table';

export interface SensorContentProps {
  onDrawerToggle?: () => void;
}

const SensorsContent: React.FC<SensorContentProps> = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <SensorsHeader />
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
        <SensorsTable />
      </Box>
      <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default SensorsContent;
