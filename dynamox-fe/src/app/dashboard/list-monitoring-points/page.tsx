'use client'

import type { MonitoringPoints } from '@/components/dashboard/list-monitoring-points/monitoring-points-table';
import { MonitoringPointsTable } from '@/components/dashboard/list-monitoring-points/monitoring-points-table';
import { getAll } from '@/store/reducers/monitoring-points.reducer';
import { RootState } from '@/store/rootReducer';
import { AppDispatch } from '@/store/store';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';


export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const { monitoringPoints } = useSelector((state: RootState) => state.monitoringPointReducer);
  const [paginatedMonitoringPoints, setPaginatedMonitoringPoints] = React.useState<MonitoringPoints[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  
  React.useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  React.useEffect(() => {
    setPaginatedMonitoringPoints(applyPagination(monitoringPoints, page, rowsPerPage));
  }, [monitoringPoints]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring Points</Typography>
        </Stack>
      </Stack>
      <MonitoringPointsTable
        count={paginatedMonitoringPoints.length}
        page={page}
        rows={paginatedMonitoringPoints}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: MonitoringPoints[], page: number, rowsPerPage: number): MonitoringPoints[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
