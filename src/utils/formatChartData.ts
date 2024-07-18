import { DataPoint } from '../interfaces/types';

export const formatChartData = (points: DataPoint[]) =>
  points.map(
    (point) =>
      [new Date(point.datetime).getTime(), point.max * 100] as [number, number],
  );
