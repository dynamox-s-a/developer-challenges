import { Stack } from '@mui/material';
import {
  PageHeader,
  Chart,
  Loading,
  ErrorMessage,
  MachineSummaryBar,
} from '../../components';
import { mockMachineData } from '../../mocks/machieDataMock';
import { useMetricsData } from './useMetricsData';
import { getValidCharts } from './chartMetricsMapper';
import { DATA_PAGE_TEXTS } from './constants';
import {
  DataPageChartsContainer,
  DataPageContent,
  DataPageMainContainer,
} from './style';

const DataPage = () => {
  const { metrics, isLoading, error } = useMetricsData();
  const validChats = getValidCharts(metrics);

  return (
    <DataPageMainContainer>
      <PageHeader pageTitle={DATA_PAGE_TEXTS.pageTitle} />

      <DataPageContent>
        <Stack spacing={3}>
          <MachineSummaryBar machineData={mockMachineData} />

          {error && <ErrorMessage message={error} />}

          {!error && (!!validChats.length || isLoading) && (
            <DataPageChartsContainer>
              {isLoading && <Loading />}

              {!isLoading && !!validChats.length && (
                <Stack spacing={3}>
                  {validChats.map(({ id, data }) => (
                    <Chart key={id} data={data} />
                  ))}
                </Stack>
              )}
            </DataPageChartsContainer>
          )}
        </Stack>
      </DataPageContent>
    </DataPageMainContainer>
  );
};

export default DataPage;
