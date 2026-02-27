/**
 * @fileoverview Domain logic for the Time Series module.
 * Centralizes business rules such as default query windows.
 */

import dayjs from 'dayjs';
import { TIME_SERIES_ERR_INVALID_DATE_RANGE } from '../../shared/errors/errors';

export const TIME_SERIES_DEFAULT_WINDOW_HOURS = 24;

/**
 * Resolves optional startDate/endDate strings into a concrete Date range.
 * - endDate defaults to now
 * - startDate defaults to TIME_SERIES_DEFAULT_WINDOW_HOURS before endDate
 * - throws TIME_SERIES_ERR_INVALID_DATE_RANGE -> if startDate > endDate
 */
export function resolveTimeSeriesDateRange(
  startDate?: string,
  endDate?: string,
): { gte: Date; lte: Date } {
  const lte = endDate ? dayjs(endDate) : dayjs();
  const gte = startDate ? dayjs(startDate) : lte.subtract(TIME_SERIES_DEFAULT_WINDOW_HOURS, 'hour');

  if (gte.isAfter(lte)) throw new TIME_SERIES_ERR_INVALID_DATE_RANGE();

  return { gte: gte.toDate(), lte: lte.toDate() };
}
