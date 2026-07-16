import type { DataPoint } from '@repo/contracts';

import type { MeasurementRepository } from '../domain/measurement-repository';
import { METRIC_UNITS, parseSeriesId, type SensorSeries } from '../domain/series';

type RawSeries = { name: string; data: DataPoint[] };

export const makeJsonMeasurementRepository = (raw: RawSeries[]): MeasurementRepository => {
  const series = toDomain(raw);

  return {
    async findByMachineId() {
      return series;
    },
  };
};

const toDomain = (raw: RawSeries[]): SensorSeries[] =>
  raw.flatMap((item) => {
    const parsed = parseSeriesId(item.name);

    if (!parsed) return [];

    return [
      {
        id: item.name,
        metric: parsed.metric,
        axis: parsed.axis,
        unit: METRIC_UNITS[parsed.metric],
        points: item.data,
      },
    ];
  });
