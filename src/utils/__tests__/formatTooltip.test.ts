import { describe, it, expect } from 'vitest';
import Highcharts from 'highcharts';
import { formatTooltip } from '../formatTooltip';

describe('formatTooltip', () => {
  it('should format the tooltip string correctly', () => {
    const context = {
      series: { name: 'Sample Series' },
      x: new Date('2024-07-18T12:00:00Z').getTime(),
      y: 123,
    } as Highcharts.TooltipFormatterContextObject;

    const formattedTooltip = formatTooltip.call(context);
    const expectedDate = Highcharts.dateFormat('%e. %b %H:%M', context.x);
    const expectedOutput = `<b>Sample Series</b><br/>${expectedDate}: 123`;

    expect(formattedTooltip).toBe(expectedOutput);
  });

  it('should handle invalid date values', () => {
    const context = {
      series: { name: 'Sample Series' },
      x: NaN,
      y: 123,
    } as Highcharts.TooltipFormatterContextObject;

    const formattedTooltip = formatTooltip.call(context);
    const expectedDate = Highcharts.dateFormat('%e. %b %H:%M', NaN);
    const expectedOutput = `<b>Sample Series</b><br/>${expectedDate}: 123`;

    expect(formattedTooltip).toBe(expectedOutput);
  });
});
