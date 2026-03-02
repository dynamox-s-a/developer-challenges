import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { utilityTest, baseInitialState } from './utility.fixture';
import type { MachinesListResponse } from '@dynamox/types';
import type { MachinesState } from '../../src/store/features/machines/machine.slice';

export const initialMachinesState: MachinesState = {
  ...baseInitialState,
  machines: [],
};

type MachineListItem = MachinesListResponse['machines'][number];

interface MachineFixtures {
  mockMachine: MachineListItem;
  anotherMockMachine: MachineListItem;
  initialStateWithMachine: MachinesState;
}

export const machineTest = utilityTest.extend<MachineFixtures>({
  mockMachine: async ({ fake }, use) => {
    const now = dayjs().toISOString();
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: fake.uuid,
      name: fake.name,
      type: 'Pump',
      userId: faker.number.int({ min: 1 }),
      createdAt: now,
      updatedAt: now,
      monitoringPoints: [],
      unassignedSensorCount: 0,
    });
  },

  // eslint-disable-next-line no-empty-pattern
  anotherMockMachine: async ({}, use) => {
    const now = dayjs().toISOString();
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: faker.string.uuid(),
      name: faker.word.noun(),
      type: 'Fan',
      userId: faker.number.int({ min: 1 }),
      createdAt: now,
      updatedAt: now,
      monitoringPoints: [],
      unassignedSensorCount: 0,
    });
  },

  initialStateWithMachine: async ({ mockMachine }, use) => {
    await use({ ...initialMachinesState, machines: [mockMachine] });
  },
});
