'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { Machine } from '@/types/data-types';

import { MachinesTable } from './machines-table';

type ListMachinesProps = {
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | null;
  machines: Machine[];
};

export function ListMachines({ isLoading, error, machines }: ListMachinesProps): React.JSX.Element {
  const isReadyForTable = !isLoading && !error && machines;

  return (
    <Card>
      <CardHeader
        title="Machines"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
        }}
      />
      <Divider />
      <Box sx={{ overflowX: 'auto', minHeight: 200, position: 'relative' }}>
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">Failed to fetch machines. Please try again later.</Alert>
          </Box>
        )}
        {isReadyForTable && <MachinesTable machines={machines} />}
      </Box>
    </Card>
  );
}
