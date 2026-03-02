import { repositoryTest } from './fastify.fixture';

export interface MockMonitoringPointWithoutSensor {
  id: number;
  uuid: string;
  name: string;
  sensor: null;
}

export interface MockMonitoringPoint extends Omit<MockMonitoringPointWithoutSensor, 'sensor'> {
  sensor: { uuid: string; model: string };
}

interface MonitoringPointFixtures {
  mockMonitoringPoint: MockMonitoringPoint;
  mockMonitoringPointWithoutSensor: MockMonitoringPointWithoutSensor;
}

export const monitoringPointTest = repositoryTest.extend<MonitoringPointFixtures>({
  mockMonitoringPoint: async ({ fake }, use) => {
    await use({ id: fake.id, uuid: fake.uuid, name: fake.name, sensor: { uuid: fake.uuid, model: 'HFPlus' } });
  },
  mockMonitoringPointWithoutSensor: async ({ fake }, use) => {
    await use({ id: fake.id, uuid: fake.uuid, name: fake.name, sensor: null });
  },
});
