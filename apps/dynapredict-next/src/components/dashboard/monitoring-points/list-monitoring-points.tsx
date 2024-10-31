'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

import { useGetMonitoringPointsQuery } from '@/lib/redux/service/api';

import ListAwaitingLayout from '../list-awaiting-layout';
import MonitoringPointsTable from './monitoring-points-table';

export function ListMonitoringPoints(): React.JSX.Element {
  const { data: monitoringPoints, isLoading, error } = useGetMonitoringPointsQuery(undefined);
  const isReadyForTable = !isLoading && !error && monitoringPoints;

  return (
    <Card>
      <CardHeader
        title="Monitoring Points"
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
        {isReadyForTable && <MonitoringPointsTable monitoringPoints={monitoringPoints} />}
      </Box>
    </Card>
  );
}
