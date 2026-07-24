import { useEffect } from 'react';
import { CircularProgress, Alert, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';
import { PageHeader, MachineData, Chart } from '../../components';
import { ChartsContainer, MainContainer, PageContent } from './style';
import { DATA_PAGE_TEXTS } from './constants';

const DataPage = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  console.log('metrics', metrics);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <MainContainer>
      <PageHeader pageTitle={DATA_PAGE_TEXTS.pageTitle} />

      <PageContent>
        <Stack spacing={3}>
          <MachineData machineInfoTitle={DATA_PAGE_TEXTS.machineInfoTitle} />

          {metrics && (
            <ChartsContainer>
              <Stack spacing={3}>
                {metrics.accelerationRms && (
                  <Chart data={metrics.accelerationRms} />
                )}
                {metrics.temperature && <Chart data={metrics.temperature} />}
                {metrics.velocityRms && <Chart data={metrics.velocityRms} />}
              </Stack>
            </ChartsContainer>
          )}
        </Stack>
      </PageContent>
    </MainContainer>
  );
};

export default DataPage;
