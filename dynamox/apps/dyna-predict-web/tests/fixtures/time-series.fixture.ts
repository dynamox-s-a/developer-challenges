import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { utilityTest, baseInitialState } from './utility.fixture';
import type { TimeSeriesEntry, TimeSeriesMetricsResponse } from '@dynamox/types';
import type { TimeSeriesState } from '../../src/store/features/time-series/time-series.slice';

export const initialTimeSeriesState: TimeSeriesState = {
  ...baseInitialState,
  entries: [],
  metrics: null,
};

interface TimeSeriesFixtures {
  mockEntry: TimeSeriesEntry;
  mockMetrics: TimeSeriesMetricsResponse;
  initialStateWithEntries: TimeSeriesState;
}

export const timeSeriesTest = utilityTest.extend<TimeSeriesFixtures>({
  mockEntry: async ({ fake }, use) => {
    await use({
      uuid: fake.uuid,
      temperature: faker.number.float({ fractionDigits: 2 }),
      accelerationRms: faker.number.float({ fractionDigits: 2 }),
      velocityRms: faker.number.float({ fractionDigits: 2 }),
      timestamp: dayjs().toISOString(),
    });
  },

  // eslint-disable-next-line no-empty-pattern
  mockMetrics: async ({}, use) => {
    await use({
      temperature: { min: faker.number.float(), max: faker.number.float(), avg: faker.number.float() },
      accelerationRms: { min: faker.number.float(), max: faker.number.float(), avg: faker.number.float() },
      velocityRms: { min: faker.number.float(), max: faker.number.float(), avg: faker.number.float() },
      count: faker.number.int(),
    });
  },

  initialStateWithEntries: async ({ mockEntry, mockMetrics }, use) => {
    await use({ ...initialTimeSeriesState, entries: [mockEntry], metrics: mockMetrics });
  },
});
