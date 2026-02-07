import { MonitoringPointRepository } from '../repositories/monitoring-point.repository';
import { MachineRepository } from '../repositories/machine.repository';

export interface FindAllQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function createMonitoringPointService(
  monitoringPointRepository: MonitoringPointRepository,
  machineRepository: MachineRepository
) {
  return {
    findAll: async (query: FindAllQuery) => {
      const page = query.page || 1;
      const limit = query.limit || 5;
      const skip = (page - 1) * limit;

      const orderBy: any = {};
      if (query.sortBy) {
        if (query.sortBy === 'machineName') {
          orderBy.machine = { name: query.sortOrder || 'asc' };
        } else if (query.sortBy === 'machineType') {
          orderBy.machine = { type: query.sortOrder || 'asc' };
        } else if (query.sortBy === 'sensorModel') {
          orderBy.sensor = { model: query.sortOrder || 'asc' };
        } else {
          orderBy[query.sortBy] = query.sortOrder || 'asc';
        }
      } else {
        orderBy.createdAt = 'desc';
      }

      const [data, total] = await Promise.all([
        monitoringPointRepository.findAll({ skip, take: limit, orderBy }),
        monitoringPointRepository.count(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    findByMachineId: (machineId: string) => 
      monitoringPointRepository.findByMachineId(machineId),

    findById: async (id: string) => {
      const point = await monitoringPointRepository.findById(id);
      if (!point) {
        throw { statusCode: 404, message: 'Monitoring point not found' };
      }
      return point;
    },

    create: async (data: { name: string; machineId: string }) => {
      const machine = await machineRepository.findById(data.machineId);
      if (!machine) {
        throw { statusCode: 404, message: 'Machine not found' };
      }
      return monitoringPointRepository.create(data);
    },

    update: async (id: string, data: { name?: string }) => {
      const existing = await monitoringPointRepository.findById(id);
      if (!existing) {
        throw { statusCode: 404, message: 'Monitoring point not found' };
      }
      return monitoringPointRepository.update(id, data);
    },

    delete: async (id: string) => {
      const existing = await monitoringPointRepository.findById(id);
      if (!existing) {
        throw { statusCode: 404, message: 'Monitoring point not found' };
      }
      return monitoringPointRepository.delete(id);
    },
  };
}

export type MonitoringPointService = ReturnType<typeof createMonitoringPointService>;
