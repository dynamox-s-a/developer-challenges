import { describe, expect } from 'vitest';
import dayjs from 'dayjs';
import machinesReducer, {
  fetchMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from '../../../../src/store/features/machines/machine.slice';
import {
  machineTest,
  initialMachinesState,
} from '../../../fixtures/machine.fixture';
import { errorWithoutMessage } from '../../../fixtures/utility.fixture';

describe('machinesSlice', () => {
  describe('fetchMachines', () => {
    describe('when pending', () => {
      machineTest('should set isLoading to true and clear the error', async () => {
        const action = fetchMachines.pending('requestId', undefined);

        const nextState = machinesReducer(initialMachinesState, action);

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('when fulfilled', () => {
      machineTest('should store the returned machines and stop loading', async ({ mockMachine }) => {
        const action = fetchMachines.fulfilled({ machines: [mockMachine] }, 'requestId', undefined);

        const nextState = machinesReducer(initialMachinesState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.machines).toEqual([mockMachine]);
      });
    });

    describe('when rejected with a known error', () => {
      machineTest('should store the error message and stop loading', async ({ fake }) => {
        const action = fetchMachines.rejected(fake.error, 'requestId', undefined);

        const nextState = machinesReducer(initialMachinesState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      machineTest('should fall back to the default error message and stop loading', async () => {
        const action = fetchMachines.rejected(errorWithoutMessage, 'requestId', undefined);

        const nextState = machinesReducer(initialMachinesState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Erro ao carregar máquinas');
      });
    });
  });

  describe('createMachine', () => {
    describe('when fulfilled', () => {
      machineTest('should append the new machine to the list', async ({ initialStateWithMachine, anotherMockMachine }) => {
        expect(initialStateWithMachine.machines).toHaveLength(1);

        const action = createMachine.fulfilled(anotherMockMachine, 'requestId', { name: anotherMockMachine.name, type: anotherMockMachine.type });

        const nextState = machinesReducer(initialStateWithMachine, action);

        expect(nextState.machines).toHaveLength(2);
        expect(nextState.machines[1].uuid).toBe(anotherMockMachine.uuid);
      });
    });
  });

  describe('updateMachine', () => {
    describe('when fulfilled', () => {
      machineTest('should update only the matching machine in the list', async ({ fake, mockMachine, anotherMockMachine }) => {
        const stateWithTwoMachines = { ...initialMachinesState, machines: [mockMachine, anotherMockMachine] };

        expect(stateWithTwoMachines.machines[0].name).toBe(mockMachine.name);
        expect(stateWithTwoMachines.machines[1].name).toBe(anotherMockMachine.name);

        const newMachineName = fake.name;
        const updatePayload = { id: mockMachine.id, uuid: mockMachine.uuid, name: newMachineName, type: mockMachine.type, updatedAt: dayjs().toISOString() };

        const action = updateMachine.fulfilled(updatePayload, 'requestId', { uuid: mockMachine.uuid, data: { name: newMachineName } });

        const nextState = machinesReducer(stateWithTwoMachines, action);

        expect(nextState.machines[0].name).toBe(newMachineName);
        expect(nextState.machines[1].name).toBe(anotherMockMachine.name);
      });
    });
  });

  describe('deleteMachine', () => {
    describe('when fulfilled', () => {
      machineTest('should remove the machine and keep the others intact', async ({ mockMachine, anotherMockMachine }) => {
        const stateWithTwoMachines = { ...initialMachinesState, machines: [mockMachine, anotherMockMachine] };

        expect(stateWithTwoMachines.machines).toHaveLength(2);

        const action = deleteMachine.fulfilled(mockMachine.uuid, 'requestId', mockMachine.uuid);

        const nextState = machinesReducer(stateWithTwoMachines, action);

        expect(nextState.machines).toHaveLength(1);
        expect(nextState.machines[0].uuid).toBe(anotherMockMachine.uuid);
      });
    });
  });
});
