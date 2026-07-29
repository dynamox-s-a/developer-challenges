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
  const validCharts = getValidCharts(metrics);

  return (
    <DataPageMainContainer data-testid="data-page-main-container">
      <PageHeader pageTitle={DATA_PAGE_TEXTS.pageTitle} />

      <DataPageContent>
        <Stack spacing={3}>
          <MachineSummaryBar machineData={mockMachineData} />

          {error && <ErrorMessage message={error} />}

          {!error && (isLoading || !!validCharts?.length) && (
            <DataPageChartsContainer data-testid="data-page-charts-container">
              {isLoading && <Loading />}

              {!isLoading && !!validCharts?.length && (
                <Stack spacing={3} data-testid="data-page-wrapper-chat">
                  {validCharts.map(({ id, data }) => (
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
