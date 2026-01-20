import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/indext';
import { MonitoringPoint } from './monitoring.types';

export type Order = 'asc' | 'desc';

export const makeSelectMonitoringPoints = () =>
  createSelector(
    [
      (state: RootState) => state.monitoring.items,
      (_: RootState, orderBy: keyof MonitoringPoint) => orderBy,
      (_: RootState, __: keyof MonitoringPoint, order: Order) => order,
      (_: RootState, __: keyof MonitoringPoint, ___: Order, page: number) =>
        page,
      (
        _: RootState,
        __: keyof MonitoringPoint,
        ___: Order,
        ____: number,
        rowsPerPage: number
      ) => rowsPerPage,
    ],
    (items, orderBy, order, page, rowsPerPage) => {
      const sorted = [...items].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });

      const start = page * rowsPerPage;
      return sorted.slice(start, start + rowsPerPage);
    }
  );
export const selectMonitoringPoints = makeSelectMonitoringPoints();
