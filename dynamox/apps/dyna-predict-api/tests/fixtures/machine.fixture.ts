import type { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { buildAuthenticated } from '../shared/helper';
import { authenticatedTest } from './fastify.fixture';

export interface MockMachine {
  id: number;
  uuid: string;
  name: string;
  type: 'Pump' | 'Fan';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockMonitoringPoint {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sensor?: { uuid: string; model: 'TcAg' | 'TcAs' | 'HFPlus' };
}

export interface MockMachineListItem extends MockMachine {
  monitoringPoints: MockMonitoringPoint[];
}

interface MachineFixtures {
  fastify: FastifyInstance;
  mockMachine: MockMachine;
  mockMonitoringPoint: MockMonitoringPoint;
  mockMachineListItem: MockMachineListItem;
}

export const machineTest = authenticatedTest.extend<MachineFixtures>({
  fastify: async ({ authenticatedUser }, use) => {
    const app = await buildAuthenticated(authenticatedUser);
    await use(app);
    await app.close();
  },
  // eslint-disable-next-line no-empty-pattern
  mockMachine: async ({}, use) => {
    const now = new Date().toISOString();
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: faker.string.uuid(),
      name: faker.word.noun(),
      type: 'Pump',
      userId: faker.number.int({ min: 1 }),
      createdAt: now,
      updatedAt: now,
    });
  },
  // eslint-disable-next-line no-empty-pattern
  mockMonitoringPoint: async ({}, use) => {
    const now = new Date().toISOString();
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: faker.string.uuid(),
      name: faker.word.noun(),
      createdAt: now,
      updatedAt: now,
      sensor: undefined,
    });
  },
  mockMachineListItem: async ({ mockMachine, mockMonitoringPoint }, use) => {
    await use({
      ...mockMachine,
      monitoringPoints: [mockMonitoringPoint],
    });
  },
});
