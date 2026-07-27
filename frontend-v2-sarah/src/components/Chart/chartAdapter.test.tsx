import { describe, it, expect } from 'vitest';
import { adaptChartDataToHighcharts } from './chartAdapter';
import type { CSSProperties } from 'react';
import { mockChartData } from './chart.mock';

describe('adaptChartDataToHighcharts', () => {
  const mockStyleConfig = {
    lineColor: '#cccccc',
    bodyFontConfig: {
      color: '#333333',
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: '20px',
    } as CSSProperties,
    legendFontConfig: {
      fontFamily: 'Arial',
      fontSize: '12px',
      fontWeight: 400,
      color: '#666666',
      lineHeight: '16px',
    } as CSSProperties,
  };

  it('should correctly convert the data and styles to the Highcharts format', () => {
    const result = adaptChartDataToHighcharts({
      data: mockChartData,
      chartStyleConfig: mockStyleConfig,
    });

    expect(result.chart?.type).toBe('line');
    expect(result.chart?.height).toBe(430);
    expect(result.chart?.backgroundColor).toBe('transparent');

    expect(result.title?.text).toBeUndefined();
    expect((result.yAxis as Highcharts.YAxisOptions)?.title?.text).toBe(
      mockChartData.yAxisTitle,
    );

    expect(result.legend?.enabled).toBe(true);
    expect(result.xAxis).toMatchObject({
      type: 'datetime',
      lineColor: mockStyleConfig.lineColor,
    });

    const series = result.series as Highcharts.SeriesOptionsType[];
    expect(series).toHaveLength(1);

    expect(series[0]).toMatchObject({
      type: 'line',
      id: mockChartData.series[0].id,
      name: mockChartData.series[0].label,
      color: mockChartData.series[0].color,
      data: mockChartData.series[0].data,
    });

    expect(result.credits?.enabled).toBe(false);
    expect(result.accessibility?.enabled).toBe(false);
  });
});
