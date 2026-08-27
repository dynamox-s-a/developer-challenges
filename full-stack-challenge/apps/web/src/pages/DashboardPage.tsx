import { useEffect } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMachines } from '../features/machines/machinesSlice';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const machinesCount = useAppSelector((state) => state.machines.items.length);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Welcome, {user?.name}</Typography>
      <Typography color="text.secondary">
        Manage industrial assets, monitoring points and sensor time-series data.
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Machines</Typography>
          <Typography variant="h3" color="primary">
            {machinesCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currently loaded in the session. Open Machines to create and manage assets.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
