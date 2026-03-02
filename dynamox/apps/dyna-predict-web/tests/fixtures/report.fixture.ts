import { faker } from '@faker-js/faker';
import { utilityTest, baseInitialState } from './utility.fixture';
import type { DashboardMetrics } from '@dynamox/types';
import type { ReportsState } from '../../src/store/features/reports/report.slice';

export const initialReportsState: ReportsState = {
  ...baseInitialState,
  metrics: null,
};

interface ReportFixtures {
  mockMetrics: DashboardMetrics;
}

export const reportTest = utilityTest.extend<ReportFixtures>({
  // eslint-disable-next-line no-empty-pattern
  mockMetrics: async ({}, use) => {
    await use({
      machineCount: faker.number.int(),
      monitoringPointCount: faker.number.int(),
      assignedSensorCount: faker.number.int(),
      timeSeriesRecordCount: faker.number.int(),
      machinesByType: [
        { type: 'Pump', _count: { type: faker.number.int() } },
        { type: 'Fan', _count: { type: faker.number.int() } },
      ],
      sensorDistribution: [
        { model: 'TcAg', _count: { model: faker.number.int() } },
        { model: 'TcAs', _count: { model: faker.number.int() } },
        { model: 'HFPlus', _count: { model: faker.number.int() } },
      ],
    });
  },
});
