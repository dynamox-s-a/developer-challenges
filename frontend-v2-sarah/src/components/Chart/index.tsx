import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import type { ChartData } from '../../features/data/types';
import { CardWrapper } from '../CardWrapper';
import { ChartContent } from './style';
import { useChartOptions } from './useChartOptions';

export const Chart = ({ data }: { data: ChartData }) => {
  const { chartTitle } = data;
  const chartContentRef = useRef<HTMLDivElement>(null);
  const chartOptions = useChartOptions(data);

  useEffect(() => {
    let chartInstance: Highcharts.Chart | null = null;
    const chartContainer = chartContentRef.current;

    if (chartContainer)
      chartInstance = Highcharts.chart(chartContainer, chartOptions);

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [chartOptions]);

  return (
    <CardWrapper title={chartTitle}>
      <ChartContent
        ref={chartContentRef}
        data-testid="chart-content"
      ></ChartContent>
    </CardWrapper>
  );
};
