import { useEffect } from 'react';
import { CircularProgress, Alert, Typography, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';
import { PageHeader, MachineData } from '../../components';
import { Chart, ChartsContainer, MainContainer, PageContent } from './style';
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
    <MainContainer>
      <PageHeader pageTitle={DATA_PAGE_TEXTS.pageTitle} />

      <PageContent>
        <Stack spacing={3}>
          <MachineData machineInfoTitle={DATA_PAGE_TEXTS.machineInfoTitle} />

          <ChartsContainer>
            <Stack spacing={3}>
              <Chart>
                <Typography variant="h6">
                  {DATA_PAGE_TEXTS.charts.acceleration}
                </Typography>
              </Chart>

              <Chart>
                <Typography variant="h6">
                  {DATA_PAGE_TEXTS.charts.temperature}
                </Typography>
              </Chart>

              <Chart>
                <Typography variant="h6">
                  {DATA_PAGE_TEXTS.charts.velocity}
                </Typography>
              </Chart>
            </Stack>
          </ChartsContainer>
        </Stack>
      </PageContent>
    </MainContainer>
  );
};

export default DataPage;
