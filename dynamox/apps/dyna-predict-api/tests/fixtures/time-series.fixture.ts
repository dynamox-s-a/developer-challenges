import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { repositoryTest } from './fastify.fixture';

export interface MockTimeSeriesEntry {
  uuid: string;
  temperature: number;
  accelerationRms: number;
  velocityRms: number;
  timestamp: Date;
}

export interface MockTimeSeriesMetrics {
  _avg: { temperature: number; accelerationRms: number; velocityRms: number };
  _max: { temperature: number; accelerationRms: number; velocityRms: number };
  _min: { temperature: number; accelerationRms: number; velocityRms: number };
  _count: number;
}

interface TimeSeriesFixtures {
  mockTimeSeriesEntry: MockTimeSeriesEntry;
  mockTimeSeriesMetrics: MockTimeSeriesMetrics;
}

function mockTimeSeriesMetricFields() {
  return {
    temperature: faker.number.float({ min: 0, max: 100 }),
    accelerationRms: faker.number.float({ min: 0, max: 10 }),
    velocityRms: faker.number.float({ min: 0, max: 10 }),
  };
}

export const timeSeriesTest = repositoryTest.extend<TimeSeriesFixtures>({
  // eslint-disable-next-line no-empty-pattern
  mockTimeSeriesEntry: async ({}, use) => {
    await use({
      uuid: faker.string.uuid(),
      temperature: faker.number.float({ min: 0, max: 100 }),
      accelerationRms: faker.number.float({ min: 0, max: 10 }),
      velocityRms: faker.number.float({ min: 0, max: 10 }),
      timestamp: dayjs().toDate(),
    });
  },
  // eslint-disable-next-line no-empty-pattern
  mockTimeSeriesMetrics: async ({}, use) => {
    await use({
      _avg: mockTimeSeriesMetricFields(),
      _max: mockTimeSeriesMetricFields(),
      _min: mockTimeSeriesMetricFields(),
      _count: faker.number.int({ min: 1, max: 100 }),
    });
  },
});
