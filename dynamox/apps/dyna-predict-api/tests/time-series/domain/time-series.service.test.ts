import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import {
  resolveTimeSeriesDateRange,
  TIME_SERIES_DEFAULT_WINDOW_HOURS,
} from '../../../src/time-series/domain/time-series.service';
import { TIME_SERIES_ERR_INVALID_DATE_RANGE } from '../../../src/shared/errors/errors';

const DEFAULT_TIME_SERIES_WINDOW_MS = TIME_SERIES_DEFAULT_WINDOW_HOURS * 60 * 60 * 1000;

describe('resolveTimeSeriesDateRange', () => {
  describe('when no arguments are provided', () => {
    it('should default lte to now and gte to 24 hours before', () => {
      const before = dayjs().valueOf();

      const result = resolveTimeSeriesDateRange();

      const after = dayjs().valueOf();

      expect(result.lte.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.lte.getTime()).toBeLessThanOrEqual(after);
      expect(result.gte.getTime()).toBeCloseTo(
        result.lte.getTime() - DEFAULT_TIME_SERIES_WINDOW_MS,
        -3,
      );
    });
  });

  describe('when only endDate is provided', () => {
    it('should set lte to endDate and gte to 24 hours before', () => {
      const endDate = dayjs().toISOString();

      const result = resolveTimeSeriesDateRange(undefined, endDate);

      expect(result.lte).toEqual(dayjs(endDate).toDate());
      expect(result.gte).toEqual(dayjs(endDate).subtract(24, 'hour').toDate());
    });
  });

  describe('when only startDate is provided', () => {
    it('should set gte to startDate and lte to now', () => {
      const startDate = dayjs().subtract(2, 'day').toISOString();
      const before = dayjs().valueOf();

      const result = resolveTimeSeriesDateRange(startDate);

      const after = dayjs().valueOf();

      expect(result.gte).toEqual(dayjs(startDate).toDate());
      expect(result.lte.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.lte.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('when startDate is after endDate', () => {
    it('should throw TIME_SERIES_ERR_INVALID_DATE_RANGE', () => {
      const startDate = dayjs().add(1, 'hour').toISOString();
      const endDate = dayjs().toISOString();

      expect(() => resolveTimeSeriesDateRange(startDate, endDate)).toThrow(
        TIME_SERIES_ERR_INVALID_DATE_RANGE,
      );
    });
  });

  describe('when both startDate and endDate are provided and both are valid', () => {
    it('should set gte to startDate and lte to endDate', () => {
      const startDate = dayjs().subtract(1, 'day').toISOString();
      const endDate = dayjs().toISOString();

      const result = resolveTimeSeriesDateRange(startDate, endDate);

      expect(result.gte).toEqual(dayjs(startDate).toDate());
      expect(result.lte).toEqual(dayjs(endDate).toDate());
    });
  });
});
