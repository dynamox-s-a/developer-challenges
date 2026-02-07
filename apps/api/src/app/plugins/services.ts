import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createUserRepository, UserRepository } from '../repositories/user.repository';
import { createMachineRepository, MachineRepository } from '../repositories/machine.repository';
import { createMonitoringPointRepository, MonitoringPointRepository } from '../repositories/monitoring-point.repository';
import { createSensorRepository, SensorRepository } from '../repositories/sensor.repository';
import { createTimeSeriesRepository, TimeSeriesRepository } from '../repositories/time-series.repository';
import { createAuthService, AuthService } from '../services/auth.service';
import { createMachineService, MachineService } from '../services/machine.service';
import { createMonitoringPointService, MonitoringPointService } from '../services/monitoring-point.service';
import { createSensorService, SensorService } from '../services/sensor.service';
import { createTimeSeriesService, TimeSeriesService } from '../services/time-series.service';

declare module 'fastify' {
  interface FastifyInstance {
    userRepository: UserRepository;
    machineRepository: MachineRepository;
    monitoringPointRepository: MonitoringPointRepository;
    sensorRepository: SensorRepository;
    timeSeriesRepository: TimeSeriesRepository;
    authService: AuthService;
    machineService: MachineService;
    monitoringPointService: MonitoringPointService;
    sensorService: SensorService;
    timeSeriesService: TimeSeriesService;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const userRepository = createUserRepository(fastify);
  const machineRepository = createMachineRepository(fastify);
  const monitoringPointRepository = createMonitoringPointRepository(fastify);
  const sensorRepository = createSensorRepository(fastify);
  const timeSeriesRepository = createTimeSeriesRepository(fastify);

  const authService = createAuthService(userRepository);
  const machineService = createMachineService(machineRepository);
  const monitoringPointService = createMonitoringPointService(monitoringPointRepository, machineRepository);
  const sensorService = createSensorService(sensorRepository, monitoringPointRepository);
  const timeSeriesService = createTimeSeriesService(timeSeriesRepository, sensorRepository);

  fastify.decorate('userRepository', userRepository);
  fastify.decorate('machineRepository', machineRepository);
  fastify.decorate('monitoringPointRepository', monitoringPointRepository);
  fastify.decorate('sensorRepository', sensorRepository);
  fastify.decorate('timeSeriesRepository', timeSeriesRepository);
  fastify.decorate('authService', authService);
  fastify.decorate('machineService', machineService);
  fastify.decorate('monitoringPointService', monitoringPointService);
  fastify.decorate('sensorService', sensorService);
  fastify.decorate('timeSeriesService', timeSeriesService);

  fastify.log.info('Services registered');
});
