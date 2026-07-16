import type { Measurements, MeasurementsQuery } from '@repo/contracts';

import type { MachineRepository } from '../../machines/domain/machine-repository';
import type { MeasurementRepository } from '../domain/measurement-repository';
import { computeStats, filterPointsByRange } from '../domain/series';

export const makeGetMachineMeasurements =
  (measurementRepository: MeasurementRepository, machineRepository: MachineRepository) =>
  async ({ machineId, from, to, metrics }: MeasurementsQuery): Promise<Measurements | null> => {
    const machine = await machineRepository.findById(machineId);

    if (!machine) return null;

    const series = await measurementRepository.findByMachineId(machineId);

    const filtered = series
      .filter((item) => !metrics?.length || metrics.includes(item.metric))
      .map((item) => {
        const points = filterPointsByRange(item.points, from, to);

        return { ...item, points, stats: computeStats(points) };
      });

    return { machineId, series: filtered };
  };
