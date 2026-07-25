import { useEffect } from 'react';
import { CircularProgress, Alert, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';
import { PageHeader, MachineData, Chart } from '../../components';
import {
  DataPageChartsContainer,
  DataPageContent,
  DataPageMainContainer,
} from './style';
import { DATA_PAGE_TEXTS } from './constants';

const DataPage = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <DataPageMainContainer>
      <PageHeader pageTitle={DATA_PAGE_TEXTS.pageTitle} />

      <DataPageContent>
        <Stack spacing={3}>
          <MachineData machineInfoTitle={DATA_PAGE_TEXTS.machineInfoTitle} />

          {metrics && (
            <DataPageChartsContainer>
              <Stack spacing={3}>
                {metrics.accelerationRms && (
                  <Chart data={metrics.accelerationRms} />
                )}
                {metrics.temperature && <Chart data={metrics.temperature} />}
                {metrics.velocityRms && <Chart data={metrics.velocityRms} />}
              </Stack>
            </DataPageChartsContainer>
          )}
        </Stack>
      </DataPageContent>
    </DataPageMainContainer>
  );
};

export default DataPage;
