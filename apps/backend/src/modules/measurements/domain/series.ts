import type { Axis, DataPoint, Metric, SeriesStats } from '@repo/contracts';

export type SensorSeries = {
  id: string;
  metric: Metric;
  axis: Axis | null;
  unit: string;
  points: DataPoint[];
};

export const METRIC_UNITS: Record<Metric, string> = {
  acceleration: 'g',
  velocity: 'mm/s',
  temperature: '°C',
};

const METRIC_BY_PREFIX: Record<string, Metric> = {
  accelerationRms: 'acceleration',
  velocityRms: 'velocity',
  temperature: 'temperature',
};

export const parseSeriesId = (id: string): { metric: Metric; axis: Axis | null } | null => {
  const [prefix, axis] = id.split('/');
  const metric = METRIC_BY_PREFIX[prefix];

  if (!metric) return null;
  if (!axis) return { metric, axis: null };
  if (axis !== 'x' && axis !== 'y' && axis !== 'z') return null;

  return { metric, axis };
};

export const computeStats = (points: DataPoint[]): SeriesStats => {
  if (points.length === 0) return { min: 0, max: 0, avg: 0, last: 0 };

  const values = points.map((point) => point.max);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: total / values.length,
    last: values[values.length - 1],
  };
};

export const filterPointsByRange = (points: DataPoint[], from?: string, to?: string): DataPoint[] => {
  const fromTime = toTime(from);
  const toTimeValue = toTime(to);

  if (fromTime === null && toTimeValue === null) return points;

  return points.filter((point) => {
    const time = new Date(point.datetime).getTime();

    if (fromTime !== null && time < fromTime) return false;
    if (toTimeValue !== null && time > toTimeValue) return false;

    return true;
  });
};

const toTime = (value?: string): number | null => {
  if (!value) return null;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? null : time;
};
