import { Box, Typography } from '@mui/material';

import React from 'react';

interface InfoDataProps {
  children: React.ReactNode;
  title: string;
}

const InfoData: React.FC<InfoDataProps> = ({ children, title}) => {
  return (
    <Box
      mb={3}
      sx={{
        alignItems: 'center',
        display: 'flex',
        margin: '10px 30px',
      }}
    >
      {children}
      <Typography
        variant="caption"
        sx={{
          padding: '0.5rem',
          textAlign: 'start'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default InfoData;
