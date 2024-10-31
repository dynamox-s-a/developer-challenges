'use client';

import * as React from 'react';
import { Box, Card, CardHeader, Divider } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { Machine } from '@/types/data-types';

import ListAwaitingLayout from '../list-awaiting-layout';
import { MachinesTable } from './machines-table';

interface ListMachinesProps {
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | null;
  machines: Machine[];
}

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
        <ListAwaitingLayout isLoading={isLoading} error={error ?? null} />
        {isReadyForTable && <MachinesTable machines={machines} />}
      </Box>
    </Card>
  );
}
