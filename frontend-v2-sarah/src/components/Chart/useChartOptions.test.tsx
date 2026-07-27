import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import {
  ChartTitle,
  YAxisTitle,
  type ChartData,
} from '../../features/data/types';
import { useChartOptions } from './useChartOptions';
import { mockChartData, theme } from './chart.mock';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('useChartOptions Hook', () => {
  it('should return Highcharts options correctly structured based on the data provided', () => {
    const { result } = renderHook(() => useChartOptions(mockChartData), {
      wrapper,
    });

    const options = result.current;

    expect(options).toBeDefined();
    expect(options.chart?.type).toBe('line');

    const yAxis = options.yAxis as Highcharts.YAxisOptions;
    expect(yAxis?.title?.text).toBe(mockChartData.yAxisTitle);

    const series = options.series as Highcharts.SeriesOptionsType[];
    expect(series).toBeDefined();
    expect(series).toHaveLength(1);

    expect(series[0]).toMatchObject({
      id: mockChartData.series[0].id,
      name: mockChartData.series[0].label,
      color: mockChartData.series[0].color,
      data: mockChartData.series[0].data,
    });
  });

  it('should update the options if the input data changes', () => {
    const updatedData: ChartData = {
      ...mockChartData,
      chartTitle: ChartTitle.VELOCITY,
      yAxisTitle: YAxisTitle.VELOCITY,
      series: [],
    };

    const { result, rerender } = renderHook(
      ({ data }) => useChartOptions(data),
      {
        wrapper,
        initialProps: { data: mockChartData },
      },
    );

    expect(result.current.series).toHaveLength(mockChartData.series.length);

    rerender({ data: updatedData });
    expect(result.current.series).toHaveLength(updatedData.series.length);
  });
});
