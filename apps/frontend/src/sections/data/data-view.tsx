import { useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { EmptyContent } from 'src/components/empty-content';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { fetchMachines } from 'src/store/machines/slice';
import { selectMetricGroups, selectSelectedMachine } from 'src/store/measurements/selectors';
import { fetchMeasurements } from 'src/store/measurements/slice';

import { ChartSyncGroup } from './chart-sync';
import { DataToolbar } from './data-toolbar';
import { MachineHeader } from './machine-header';
import { MetricChart } from './metric-chart';
import { useUrlFilters } from './use-url-filters';

export function DataView() {
  const dispatch = useAppDispatch();

  useUrlFilters();

  const machine = useAppSelector(selectSelectedMachine);
  const groups = useAppSelector(selectMetricGroups);
  const period = useAppSelector((state) => state.measurements.period);
  const machines = useAppSelector((state) => state.machines);
  const measurements = useAppSelector((state) => state.measurements);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  useEffect(() => {
    if (machine) dispatch(fetchMeasurements({ machineId: machine.id }));
  }, [dispatch, machine, period]);

  const error = machines.error ?? measurements.error;
  const isLoading = machines.status === 'loading' || measurements.status === 'loading';

  const retry = () => {
    dispatch(fetchMachines());
    if (machine) dispatch(fetchMeasurements({ machineId: machine.id }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <DataToolbar />

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={retry}>
                Tentar de novo
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {machine && <MachineHeader machine={machine} />}

        {isLoading && <ChartsSkeleton />}

        {!isLoading && !error && groups.length === 0 && (
          <EmptyContent
            title="Nenhuma leitura no período"
            description="Amplie o intervalo para visualizar as séries deste sensor."
          />
        )}

        {!isLoading && groups.length > 0 && (
          <ChartSyncGroup>
            {groups.map((group) => (
              <MetricChart key={group.metric} group={group} />
            ))}
          </ChartSyncGroup>
        )}
      </Stack>
    </Container>
  );
}

function ChartsSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} variant="rounded" height={380} />
      ))}
    </Box>
  );
}
