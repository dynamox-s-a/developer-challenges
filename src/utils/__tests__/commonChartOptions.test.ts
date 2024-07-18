import { describe, it, expect, vi } from 'vitest';
import Highcharts from 'highcharts';
import { commonChartOptions } from '../commonChartOptions';
import { formatTooltip } from '../formatTooltip';
import { syncCrosshair } from '../syncCrosshair';

vi.mock('../formatDateLabel', () => ({
  formatDateLabel: (value: number) => `formatted ${value}`,
}));

vi.mock('../formatTooltip', () => ({
  formatTooltip: vi.fn(() => 'tooltip content'),
}));

vi.mock('../syncCrosshair', () => ({
  syncCrosshair: vi.fn(),
}));

describe('commonChartOptions', () => {
  it('should return correct chart options', () => {
    const titleText = 'Sample Title';
    const yAxisText = 'Sample Y-Axis';
    const series = [
      { name: 'Sample Series', data: [1, 2, 3] },
    ] as Highcharts.SeriesLineOptions[];

    const options = commonChartOptions(titleText, yAxisText, series);

    expect(options.title?.text).toBe(titleText);
    expect(options.xAxis?.type).toBe('datetime');
    expect(options.xAxis?.crosshair).toBe(true);
    expect(options.yAxis?.title?.text).toBe(yAxisText);
    expect(options.series).toEqual(series);
    expect(options.tooltip?.shared).toBe(true);
    expect(typeof options.tooltip?.formatter).toBe('function');
    expect(typeof options.chart?.events?.load).toBe('function');
  });

  it('should call formatDateLabel for xAxis labels', () => {
    const options = commonChartOptions('Title', 'Y-Axis', []);
    const labelFormatter = options.xAxis?.labels?.formatter;

    if (labelFormatter) {
      expect(labelFormatter.call({ value: 1627843200000 })).toBe(
        'formatted 1627843200000',
      );
    }
  });

  it('should call formatTooltip for tooltip', () => {
    const options = commonChartOptions('Title', 'Y-Axis', []);
    const tooltipFormatter = options.tooltip?.formatter;

    if (tooltipFormatter) {
      tooltipFormatter.call({});
      expect(formatTooltip).toHaveBeenCalled();
    }
  });

  it('should call syncCrosshair on chart load event', () => {
    const options = commonChartOptions('Title', 'Y-Axis', []);
    const loadEvent = options.chart?.events?.load;

    if (loadEvent) {
      const chartMock = {
        container: {
          addEventListener: vi.fn((event, handler) => {
            if (event === 'mousemove') {
              handler({} as MouseEvent);
            }
          }),
        },
      };

      loadEvent.call(chartMock as unknown as Highcharts.Chart);
      expect(chartMock.container.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
      expect(syncCrosshair).toHaveBeenCalled();
    }
  });
});
