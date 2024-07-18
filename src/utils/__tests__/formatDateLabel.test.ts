import { describe, it, expect } from 'vitest';
import Highcharts from 'highcharts';
import { formatDateLabel } from '../formatDateLabel';

describe('formatDateLabel', () => {
  it('should format a numeric date value correctly', () => {
    const dateValue = new Date('2024-07-18T00:00:00Z').getTime();
    const formattedDate = formatDateLabel(dateValue);
    const expectedDate = Highcharts.dateFormat('%e. %b', dateValue);
    expect(formattedDate).toBe(expectedDate);
  });

  it('should format a string date value correctly', () => {
    const dateValue = '2024-07-18T00:00:00Z';
    const formattedDate = formatDateLabel(dateValue);
    const expectedDate = Highcharts.dateFormat(
      '%e. %b',
      new Date(dateValue).getTime(),
    );
    expect(formattedDate).toBe(expectedDate);
  });

  it('should format an invalid date value as NaN', () => {
    const dateValue = 'invalid-date';
    const formattedDate = formatDateLabel(dateValue);
    const expectedDate = Highcharts.dateFormat('%e. %b', NaN);
    expect(formattedDate).toBe(expectedDate);
  });
});
