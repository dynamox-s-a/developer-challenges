import { SensorModel, MachineType } from '@prisma/client';
import { SensorRepository } from '../repositories/sensor.repository';
import { MonitoringPointRepository } from '../repositories/monitoring-point.repository';

const SENSOR_MACHINE_COMPATIBILITY: Record<SensorModel, MachineType[]> = {
  [SensorModel.TcAg]: [MachineType.Fan],
  [SensorModel.TcAs]: [MachineType.Fan],
  [SensorModel.HFPlus]: [MachineType.Pump, MachineType.Fan],
};

function validateSensorCompatibility(sensorModel: SensorModel, machineType: MachineType) {
  const allowedMachineTypes = SENSOR_MACHINE_COMPATIBILITY[sensorModel];
  
  if (!allowedMachineTypes.includes(machineType)) {
    throw {
      statusCode: 400,
      message: `Sensor ${sensorModel} is not compatible with machine type ${machineType}. Allowed: ${allowedMachineTypes.join(', ')}`,
    };
  }
}

export function createSensorService(
  sensorRepository: SensorRepository,
  monitoringPointRepository: MonitoringPointRepository
) {
  return {
    findAll: () => sensorRepository.findAll(),

    findById: async (id: string) => {
      const sensor = await sensorRepository.findById(id);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }
      return sensor;
    },

    create: async (data: { model: SensorModel; monitoringPointId: string }) => {
      const monitoringPoint = await monitoringPointRepository.findById(data.monitoringPointId);
      
      if (!monitoringPoint) {
        throw { statusCode: 404, message: 'Monitoring point not found' };
      }

      if (monitoringPoint.sensor) {
        throw { statusCode: 400, message: 'Monitoring point already has a sensor' };
      }

      validateSensorCompatibility(data.model, monitoringPoint.machine.type);

      return sensorRepository.create(data);
    },

    update: async (id: string, data: { model?: SensorModel }) => {
      const sensor = await sensorRepository.findById(id);
      
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      if (data.model) {
        validateSensorCompatibility(data.model, sensor.monitoringPoint.machine.type);
      }

      return sensorRepository.update(id, data);
    },

    delete: async (id: string) => {
      const sensor = await sensorRepository.findById(id);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }
      return sensorRepository.delete(id);
    },
  };
}

export type SensorService = ReturnType<typeof createSensorService>;
