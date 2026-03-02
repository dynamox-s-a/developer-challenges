import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { utilityTest, baseInitialState } from './utility.fixture';
import type { MonitoringPointWithMachineAndSensor, PaginationMetadata } from '@dynamox/types';
import type { MonitoringPointsState } from '../../src/store/features/monitoring-points/monitoring-points.slice';

export const initialMonitoringPointsState: MonitoringPointsState = {
  ...baseInitialState,
  monitoringPoints: [],
  pagination: null,
};

interface MonitoringPointFixtures {
  mockMonitoringPoint: MonitoringPointWithMachineAndSensor;
  mockPagination: PaginationMetadata;
}

export const monitoringPointTest = utilityTest.extend<MonitoringPointFixtures>({
  mockMonitoringPoint: async ({ fake }, use) => {
    const now = dayjs().toISOString();
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: fake.uuid,
      name: fake.name,
      createdAt: now,
      updatedAt: now,
      machine: {
        uuid: faker.string.uuid(),
        name: faker.word.noun(),
        type: 'Pump',
      },
    });
  },

  // eslint-disable-next-line no-empty-pattern
  mockPagination: async ({}, use) => {
    await use({
      currentPage: faker.number.int({ min: 1, max: 5 }),
      pageSize: 10,
      totalPages: faker.number.int({ min: 1, max: 10 }),
      totalElements: faker.number.int({ min: 1, max: 100 }),
      hasNextPage: faker.datatype.boolean(),
    });
  },
});
